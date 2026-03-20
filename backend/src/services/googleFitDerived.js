const { fitness } = require("../googleFit");

function flattenAggregatePoints(aggregateResponse) {
  const points = [];
  for (const bucket of aggregateResponse?.bucket || []) {
    for (const dataset of bucket.dataset || []) {
      for (const point of dataset.point || []) {
        points.push(point);
      }
    }
  }
  return points;
}

/**
 * 1 = well rested, 10 = very tired. Uses sleep duration only (proxy).
 * ~8h+ → 1; ~4h → 10; linear between 4h and 8h.
 */
function estimateTirednessFromSleepHours(sleepHours) {
  if (sleepHours == null || Number.isNaN(sleepHours) || sleepHours <= 0) {
    return null;
  }
  const h = sleepHours;
  if (h >= 8) return 1;
  if (h <= 4) return 10;
  return Math.min(10, Math.max(1, Math.round(10 - ((h - 4) / 4) * 9)));
}

/**
 * Map activity load (calories + logged workout duration) to 1–10 (proxy for session RPE).
 */
function estimateRpeFromLoad({ calories, sessionMinutes }) {
  const c = Math.max(0, calories || 0);
  const m = Math.max(0, sessionMinutes || 0);
  if (c < 15 && m < 1) return null;
  if (c < 25 && m < 3) return 1;
  const load = c / 200 + m / 40;
  return Math.min(10, Math.max(1, Math.round(1 + load * 4.2)));
}

async function fetchCaloriesExpended(startMs, endMs) {
  const durationMillis = Math.max(1, Math.floor(endMs - startMs));
  const { data } = await fitness.users.dataset.aggregate({
    userId: "me",
    requestBody: {
      aggregateBy: [{ dataTypeName: "com.google.calories.expended" }],
      startTimeMillis: String(Math.floor(startMs)),
      endTimeMillis: String(Math.floor(endMs)),
      bucketByTime: { durationMillis: String(durationMillis) },
    },
  });
  let total = 0;
  for (const point of flattenAggregatePoints(data)) {
    const v = point.value?.[0]?.fpVal ?? point.value?.[0]?.intVal;
    if (v != null && !Number.isNaN(Number(v))) total += Number(v);
  }
  return Math.round(total * 100) / 100;
}

async function fetchSessionsLoad(startMs, endMs) {
  const startTime = new Date(startMs).toISOString();
  const endTime = new Date(endMs).toISOString();
  let totalMs = 0;
  let sessionCount = 0;
  let pageToken;

  do {
    const res = await fitness.users.sessions.list({
      userId: "me",
      startTime,
      endTime,
      pageToken: pageToken || undefined,
    });
    const sessions = res.data?.session || [];
    sessionCount += sessions.length;
    for (const s of sessions) {
      const a = Number(s.startTimeMillis);
      const b = Number(s.endTimeMillis);
      if (Number.isFinite(a) && Number.isFinite(b) && b > a) {
        totalMs += b - a;
      }
    }
    pageToken = res.data?.nextPageToken;
  } while (pageToken);

  return {
    sessionCount,
    sessionMinutes: totalMs / 60000,
  };
}

/**
 * Uses the same rolling window as sleep (e.g. last 24h).
 */
async function fetchDerivedTrainingMetrics(startMs, endMs, sleepHours) {
  const tiredness = estimateTirednessFromSleepHours(sleepHours);

  let calories = 0;
  let sessionMinutes = 0;
  let sessionCount = 0;
  try {
    calories = await fetchCaloriesExpended(startMs, endMs);
  } catch (e) {
    console.error("Google Fit calories aggregate:", e.message || e);
  }
  try {
    const load = await fetchSessionsLoad(startMs, endMs);
    sessionMinutes = load.sessionMinutes;
    sessionCount = load.sessionCount;
  } catch (e) {
    console.error("Google Fit sessions list:", e.message || e);
  }

  const estimatedRpe = estimateRpeFromLoad({ calories, sessionMinutes });

  return {
    estimatedTiredness: tiredness,
    estimatedRpe,
    activityLoad: { calories, sessionMinutes, sessionCount },
  };
}

module.exports = {
  estimateTirednessFromSleepHours,
  estimateRpeFromLoad,
  fetchDerivedTrainingMetrics,
};
