const { DateTime } = require("luxon");
const { fitness } = require("../googleFit");

/** Google Fit sleep segment stages (com.google.sleep.segment). */
const SLEEP_STAGE_AWAKE = 1;
const SLEEP_STAGE_OUT_OF_BED = 3;

const MS_PER_HOUR = 60 * 60 * 1000;

/**
 * Rolling sleep window: [now − N hours, now] (default N=24).
 * Matches "today's sleep" as last 24 hours of clock time, not calendar midnight.
 */
function getLast24HoursSleepWindow() {
  const timeZone =
    process.env.GOOGLE_FIT_SLEEP_TZ ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "UTC";

  const rawHours = process.env.GOOGLE_FIT_SLEEP_WINDOW_HOURS;
  const parsed =
    rawHours != null && rawHours !== "" ? Number(rawHours) : 24;
  const hours = Math.max(
    1,
    Math.min(168, Number.isFinite(parsed) ? parsed : 24)
  );

  const endMs = Date.now();
  const startMs = endMs - hours * MS_PER_HOUR;
  const startDt = DateTime.fromMillis(startMs, { zone: timeZone });
  const endDt = DateTime.fromMillis(endMs, { zone: timeZone });

  return {
    type: "rolling",
    hours,
    timeZone,
    startMs,
    endMs,
    startIso: startDt.toISO(),
    endIso: endDt.toISO(),
  };
}

/**
 * Clip [startNs, endNs] to [windowStartMs, windowEndMs) expressed in nanoseconds.
 */
function clippedDurationNanos(startNs, endNs, window) {
  if (!window) {
    const a = BigInt(String(startNs));
    const b = BigInt(String(endNs));
    return b > a ? b - a : 0n;
  }
  const w0 = BigInt(window.startMs) * 1000000n;
  const w1 = BigInt(window.endMs) * 1000000n;
  const a = BigInt(String(startNs));
  const b = BigInt(String(endNs));
  const lo = a < w0 ? w0 : a;
  const hi = b > w1 ? w1 : b;
  if (hi <= lo) return 0n;
  return hi - lo;
}

/**
 * Sum sleep hours from raw DataPoint[] (sleep segment API shape).
 * If `window` is set, only counts portions of segments overlapping that window (ms since epoch).
 */
function sleepHoursFromDataPoints(points, window) {
  let totalNanos = 0n;

  const countStage = (point) => {
    const startN =
      point.startTimeNanos != null
        ? BigInt(String(point.startTimeNanos))
        : 0n;
    const endN =
      point.endTimeNanos != null ? BigInt(String(point.endTimeNanos)) : 0n;
    const dur = clippedDurationNanos(startN, endN, window);
    if (dur <= 0n) return;

    const raw = point.value?.[0]?.intVal ?? point.value?.[0]?.fpVal;
    const stage = raw == null || raw === "" ? null : Number(raw);
    if (stage === SLEEP_STAGE_AWAKE || stage === SLEEP_STAGE_OUT_OF_BED) {
      return;
    }
    totalNanos += dur;
  };

  for (const point of points) {
    countStage(point);
  }

  // If staging wasn't usable (unknown shape) but we have segments, use time-in-bed total (still clipped).
  if (totalNanos === 0n && points.length > 0) {
    for (const point of points) {
      const startN =
        point.startTimeNanos != null
          ? BigInt(String(point.startTimeNanos))
          : 0n;
      const endN =
        point.endTimeNanos != null ? BigInt(String(point.endTimeNanos)) : 0n;
      const dur = clippedDurationNanos(startN, endN, window);
      if (dur > 0n) totalNanos += dur;
    }
  }

  const hours = Number(totalNanos) / 1e9 / 3600;
  return Math.round(hours * 100) / 100;
}

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

function parseSleepHoursFromAggregate(aggregateResponse, window) {
  return sleepHoursFromDataPoints(flattenAggregatePoints(aggregateResponse), window);
}

/**
 * Read raw sleep segments for [startMs, endMs] from all com.google.sleep.segment data streams.
 * Returns the max total asleep hours across streams (avoids double-counting merged vs raw duplicates).
 */
async function fetchSleepViaDataSources(startMs, endMs, window) {
  const listRes = await fitness.users.dataSources.list({
    userId: "me",
    dataTypeName: ["com.google.sleep.segment"],
  });

  const sources = listRes.data?.dataSource || [];
  if (!sources.length) {
    return 0;
  }

  const startNs = (BigInt(Math.floor(startMs)) * 1000000n).toString();
  const endNs = (BigInt(Math.floor(endMs)) * 1000000n).toString();
  const datasetId = `${startNs}-${endNs}`;

  let maxHours = 0;
  for (const src of sources) {
    const streamId = src.dataStreamId;
    if (!streamId) continue;

    try {
      const dsRes = await fitness.users.dataSources.datasets.get({
        userId: "me",
        dataSourceId: streamId,
        datasetId,
      });
      const pts = dsRes.data?.point || [];
      const hrs = sleepHoursFromDataPoints(pts, window);
      if (hrs > maxHours) {
        maxHours = hrs;
      }
    } catch (_) {
      // Empty / 404 for this stream in range — try next source
    }
  }

  return maxHours;
}

async function fetchSleepViaAggregate(startMs, endMs, window) {
  const durationMillis = Math.max(1, Math.floor(endMs - startMs));
  const { data } = await fitness.users.dataset.aggregate({
    userId: "me",
    requestBody: {
      aggregateBy: [{ dataTypeName: "com.google.sleep.segment" }],
      startTimeMillis: String(Math.floor(startMs)),
      endTimeMillis: String(Math.floor(endMs)),
      bucketByTime: { durationMillis: String(durationMillis) },
    },
  });

  return parseSleepHoursFromAggregate(data, window);
}

/**
 * Total asleep hours in the rolling window (default last 24 hours).
 */
async function fetchSleepHoursFromGoogleFit() {
  const window = getLast24HoursSleepWindow();
  const { startMs, endMs } = window;

  try {
    const fromSources = await fetchSleepViaDataSources(startMs, endMs, window);
    if (fromSources > 0) {
      return { sleepHours: fromSources, sleepWindow: window };
    }
  } catch (e) {
    console.error("Google Fit sleep (dataSources):", e.message || e);
  }

  try {
    const agg1 = await fetchSleepViaAggregate(startMs, endMs, window);
    if (agg1 > 0) {
      return { sleepHours: agg1, sleepWindow: window };
    }
  } catch (e) {
    console.error("Google Fit sleep (aggregate full):", e.message || e);
  }

  return { sleepHours: 0, sleepWindow: window };
}

/**
 * Lightweight hint when sleep hours are 0 (wrong account, no sync, or API empty).
 */
async function getSleepApiDiagnostics(existingWindow) {
  const win = existingWindow || getLast24HoursSleepWindow();
  try {
    const listRes = await fitness.users.dataSources.list({
      userId: "me",
      dataTypeName: ["com.google.sleep.segment"],
    });
    const n = listRes.data?.dataSource?.length ?? 0;
    return {
      sleepSegmentDataSources: n,
      sleepWindow: win,
      hint:
        n === 0
          ? "No sleep data streams for this Google account in Fitness API. Log sleep in Google Fit with the same account you used for Connect, and ensure cloud sync."
          : `No sleep segments overlapped the last ${win.hours}h window (${win.startIso} → ${win.endIso}, ${win.timeZone}). Open Google Fit and wait for cloud sync.`,
    };
  } catch (e) {
    return { error: String(e.message || e), sleepWindow: win };
  }
}

/**
 * Write Google Fit–derived fields into training_submissions for this player email.
 * Prefer updating today's latest row; otherwise insert (soreness stays 0 — not estimated).
 */
async function persistGoogleFitMetricsForPlayerEmail(
  db,
  email,
  { sleepHours, tiredness, rpe }
) {
  const hasSleep =
    sleepHours != null && !Number.isNaN(Number(sleepHours)) && Number(sleepHours) > 0;
  const hasTiredness =
    tiredness != null && Number.isFinite(Number(tiredness)) && tiredness >= 1;
  const hasRpe = rpe != null && Number.isFinite(Number(rpe)) && rpe >= 1;

  if (!hasSleep && !hasTiredness && !hasRpe) {
    return { updated: false, inserted: false };
  }

  const player = await db.query(
    "SELECT id FROM players WHERE LOWER(email) = LOWER($1)",
    [email.trim()]
  );
  if (!player.rows.length) {
    throw new Error(`Player not found for email: ${email}`);
  }
  const playerId = player.rows[0].id;

  const sleepVal = hasSleep ? Number(sleepHours) : null;
  const tirednessVal = hasTiredness ? Math.round(Number(tiredness)) : null;
  const rpeVal = hasRpe ? Math.round(Number(rpe)) : null;

  const upd = await db.query(
    `UPDATE training_submissions
     SET sleep = COALESCE($1::numeric, sleep),
         tiredness = COALESCE($2::integer, tiredness),
         rpe = COALESCE($3::integer, rpe)
     WHERE id = (
       SELECT id FROM training_submissions
       WHERE player_id = $4
         AND submitted_at::date = CURRENT_DATE
       ORDER BY submitted_at DESC
       LIMIT 1
     )
     RETURNING id`,
    [sleepVal, tirednessVal, rpeVal, playerId]
  );

  if (upd.rowCount > 0) {
    return { updated: true, inserted: false };
  }

  await db.query(
    `INSERT INTO training_submissions (player_id, rpe, sleep, soreness, tiredness)
     VALUES ($1, COALESCE($2, 0), COALESCE($3, 0), 0, COALESCE($4, 0))`,
    [playerId, rpeVal, sleepVal, tirednessVal]
  );

  return { updated: false, inserted: true };
}

/** @deprecated use persistGoogleFitMetricsForPlayerEmail */
async function persistSleepForPlayerEmail(db, email, sleepHours) {
  return persistGoogleFitMetricsForPlayerEmail(db, email, {
    sleepHours,
    tiredness: null,
    rpe: null,
  });
}

module.exports = {
  getLast24HoursSleepWindow,
  /** @deprecated use getLast24HoursSleepWindow */
  getYesterdaySleepWindow: getLast24HoursSleepWindow,
  fetchSleepHoursFromGoogleFit,
  persistGoogleFitMetricsForPlayerEmail,
  persistSleepForPlayerEmail,
  parseSleepHoursFromAggregate,
  sleepHoursFromDataPoints,
  getSleepApiDiagnostics,
};
