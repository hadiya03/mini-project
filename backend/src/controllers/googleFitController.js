const db = require("../db/db");
const { oauth2Client, GOOGLE_FIT_SCOPES } = require("../googleFit");
const {
  fetchSleepHoursFromGoogleFit,
  persistGoogleFitMetricsForPlayerEmail,
  getSleepApiDiagnostics,
} = require("../services/googleFitSleep");
const { fetchDerivedTrainingMetrics } = require("../services/googleFitDerived");

const ensureTable = async () => {
  // Store refresh tokens keyed by the user's email so we can access the Fit API server-side later.
  await db.query(`
    CREATE TABLE IF NOT EXISTS google_fit_credentials (
      email TEXT PRIMARY KEY,
      refresh_token TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

const startGoogleAuth = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Missing query param: email" });
    }

    // "state" is used to tie the OAuth response back to the correct user email.
    // For this app we keep it simple (dev use); do not rely on this for security in production.
    const state = Buffer.from(email, "utf8").toString("base64");

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: GOOGLE_FIT_SCOPES,
      state,
    });

    return res.redirect(authUrl);
  } catch (err) {
    console.error("startGoogleAuth error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to start Google OAuth" });
  }
};

const googleAuthCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;

    if (!code || !state) {
      return res
        .status(400)
        .send("Missing required OAuth query params (code/state).");
    }

    const email = Buffer.from(state, "base64").toString("utf8");

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    await ensureTable();

    // Google only returns refresh_token on the first consent (usually).
    // If it's missing, fall back to the previously saved refresh token (if any).
    const refreshToken =
      tokens.refresh_token ||
      (
        await db.query(
          "SELECT refresh_token FROM google_fit_credentials WHERE email = $1",
          [email]
        )
      ).rows?.[0]?.refresh_token;

    if (!refreshToken) {
      return res.redirect(
        "http://localhost:5173/playerdashboard?googlefit=missing_refresh_token"
      );
    }

    await db.query(
      `
        INSERT INTO google_fit_credentials (email, refresh_token, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (email)
        DO UPDATE SET refresh_token = EXCLUDED.refresh_token, updated_at = NOW();
      `,
      [email, refreshToken]
    );

    oauth2Client.setCredentials({
      ...tokens,
      refresh_token: refreshToken,
    });
    try {
      const { sleepHours, sleepWindow } = await fetchSleepHoursFromGoogleFit();
      const derived = await fetchDerivedTrainingMetrics(
        sleepWindow.startMs,
        sleepWindow.endMs,
        sleepHours
      );
      await persistGoogleFitMetricsForPlayerEmail(db, email, {
        sleepHours,
        tiredness: derived.estimatedTiredness,
        rpe: derived.estimatedRpe,
      });
    } catch (syncErr) {
      console.error("Google Fit sleep sync after OAuth failed:", syncErr.message || syncErr);
    }

    // Redirect back into the app.
    return res.redirect("http://localhost:5173/playerdashboard");
  } catch (err) {
    console.error("googleAuthCallback error:", err);
    return res.redirect("http://localhost:5173/playerdashboard?googlefit=error");
  }
};

const getGoogleFitData = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Missing query param: email" });
    }

    await ensureTable();

    const result = await db.query(
      "SELECT refresh_token FROM google_fit_credentials WHERE email = $1",
      [email]
    );

    const refreshToken = result.rows?.[0]?.refresh_token;
    if (!refreshToken) {
      return res.json({
        success: true,
        connected: false,
        email,
      });
    }

    // We can access Google Fit server-side using the refresh token.
    // For now, keep it minimal and just report connectivity (frontend currently only logs the response).
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    let sleepHours = null;
    let sleepWindow = null;
    let sleepPersisted = null;
    let estimatedTiredness = null;
    let estimatedRpe = null;
    let activityLoad = null;
    try {
      const fit = await fetchSleepHoursFromGoogleFit();
      sleepHours = fit.sleepHours;
      sleepWindow = fit.sleepWindow;
      const derived = await fetchDerivedTrainingMetrics(
        fit.sleepWindow.startMs,
        fit.sleepWindow.endMs,
        fit.sleepHours
      );
      estimatedTiredness = derived.estimatedTiredness;
      estimatedRpe = derived.estimatedRpe;
      activityLoad = derived.activityLoad;
      sleepPersisted = await persistGoogleFitMetricsForPlayerEmail(db, email, {
        sleepHours,
        tiredness: estimatedTiredness,
        rpe: estimatedRpe,
      });
    } catch (syncErr) {
      console.error("Google Fit sleep sync on /data failed:", syncErr.message || syncErr);
    }

    let sleepDiagnostics = null;
    if (!sleepHours) {
      try {
        sleepDiagnostics = await getSleepApiDiagnostics(sleepWindow);
      } catch (_) {
        /* ignore */
      }
    }

    return res.json({
      success: true,
      connected: true,
      email,
      sleepHours,
      sleepWindow,
      estimatedTiredness,
      estimatedRpe,
      activityLoad,
      sleepSavedToTrainingSubmissions: sleepPersisted,
      sleepDiagnostics,
    });
  } catch (err) {
    console.error("getGoogleFitData error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load Google Fit data" });
  }
};

module.exports = {
  startGoogleAuth,
  googleAuthCallback,
  getGoogleFitData,
};

