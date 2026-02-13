
const pool = require("../db/db.js");
const nodemailer = require("nodemailer");

// 📧 NODEMAILER CONFIGURATION
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "miniproject783@gmail.com",
    pass: "wwgaucxltubvfwbw",
  },
});


// 📢 SEND REMINDER EMAIL
exports.sendReminder = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const playerRecord = await pool.query(
      "SELECT email, name FROM players WHERE id = $1",
      [id]
    );

    if (playerRecord.rows.length === 0) {
      return res.status(404).json({ error: "Player ID not found." });
    }

    const { email, name } = playerRecord.rows[0];

    await transporter.sendMail({
      from: '"Football Training Team" <miniproject783@gmail.com>',
      to: email,
      subject: "Daily Metrics Reminder",
      html: `
        <h3>Hello ${name || "Athlete"},</h3>
        <p>Please submit your daily training metrics.</p>
      `,
    });

    res.status(200).json({ success: true, message: "Reminder sent successfully." });

  } catch (err) {
    console.error("Reminder Error:", err);
    res.status(500).json({ error: "Failed to send email." });
  }
};



// 💾 SAVE ASSESSMENT (USING YOUR EXACT EQUATIONS)
exports.saveAssessment = async (req, res) => {
  const id = Number(req.params.id);

  const {
    rpe, sleepHour, tiredness, duration, soreness,
    strength, endurance, balance, speed, flexibility,
    cardio, agility, coachNotes
  } = req.body;

  try {
    const playerRecord = await pool.query(
      "SELECT email, name FROM players WHERE id = $1",
      [id]
    );

    if (playerRecord.rows.length === 0) {
      return res.status(404).json({ error: "Player not found." });
    }

    const { email: playerEmail, name: playerName } = playerRecord.rows[0];

    const val = (num) => (isNaN(Number(num)) ? 0 : Number(num));

    const vRpe = val(rpe);
    const vSleep = val(sleepHour);
    const vTired = val(tiredness);
    const vDuration = val(duration);
    const vSore = val(soreness);

    // ===============================
    // 🔹 1️⃣ RECOVERY SCORE
    // recovery = (sleep * soreness + tiredness) / 3
    // ===============================
    const recoveryScore = (vSleep * vSore + vTired) / 3;

    // ===============================
    // 🔹 2️⃣ TRAINING LOAD
    // trainingLoad = rpe * duration
    // ===============================
    const trainingLoad = vRpe * vDuration;

    // ===============================
    // 🔹 3️⃣ FATIGUE SCORE
    // fatigue = trainingLoad / (recoveryScore * 10)
    // ===============================
    const fatigueScore =
      recoveryScore === 0 ? 0 : trainingLoad / (recoveryScore * 10);

    // ===============================
    // 🔹 4️⃣ READINESS SCORE
    // readiness = (0.4*recovery) + (0.3*rpe) + (0.3*trainingLoad)
    // ===============================
    const readinessScore =
      (0.4 * recoveryScore) +
      (0.3 * vRpe) +
      (0.3 * trainingLoad);

    // ===============================
    // 🔹 5️⃣ INJURY RISK (Weighted Method)
    // ===============================

    const fatigueMax = 10;
    const recoveryMax = 10;
    const readinessMax = 100;

    const FR = fatigueScore / fatigueMax;

    const WR_raw = trainingLoad / (trainingLoad || 1);
    const WR_limited = Math.min(WR_raw, 1.5);
    const WR = WR_limited / 1.5;

    const RR = 1 - (recoveryScore / recoveryMax);

    const ReR = 1 - (readinessScore / readinessMax);

    const injuryRisk =
      (0.35 * FR) +
      (0.25 * WR) +
      (0.25 * RR) +
      (0.15 * ReR);

    // ===============================
    // STORE ONLY injury_risk
    // ===============================
    await pool.query(
      `INSERT INTO player_assessments 
       (player_id, rpe, sleep_hour, tiredness, duration, soreness,
        strength, endurance, balance, speed, flexibility, cardio, agility,
        injury_risk, coach_notes, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,NOW())`,
      [
        id, vRpe, vSleep, vTired, vDuration, vSore,
        val(strength), val(endurance), val(balance),
        val(speed), val(flexibility), val(cardio),
        val(agility),
        Number(injuryRisk.toFixed(3)),
        coachNotes || null
      ]
    );

    // SEND EMAIL WITH RESULTS
    await transporter.sendMail({
      from: '"MiniProject Analyst" <miniproject783@gmail.com>',
      to: playerEmail,
      subject: `Performance Update: ${playerName}`,
      html: `
        <p><strong>Readiness:</strong> ${readinessScore.toFixed(2)}</p>
        <p><strong>Fatigue:</strong> ${fatigueScore.toFixed(2)}</p>
        <p><strong>Injury Risk:</strong> ${injuryRisk.toFixed(3)}</p>
      `,
    });

    // RETURN RESULTS TO FRONTEND
    res.status(201).json({
      success: true,
      readiness: Number(readinessScore.toFixed(2)),
      fatigue: Number(fatigueScore.toFixed(2)),
      injuryRisk: Number(injuryRisk.toFixed(3))
    });

  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: "Failed to process request." });
  }
};

