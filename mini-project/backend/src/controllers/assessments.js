
/*const pool = require("../db/db.js");
const nodemailer = require("nodemailer");

// 📧 NODEMAILER CONFIGURATION
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "miniproject783@gmail.com",
    pass: "wwgaucxltubvfwbw", // Gmail App Password ONLY
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



exports.saveAssessment = async (req, res) => {
  const id = Number(req.params.id);

  const {
    rpe,
    sleepHour,
    tiredness,
    duration,
    soreness,
    strength,
    endurance,
    balance,
    speed,
    flexibility,
    cardio,
    agility,
    coachNotes
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

    const val = (n) => (isNaN(Number(n)) ? 0 : Number(n));

    const vRpe = val(rpe);
    const vSleep = val(sleepHour);
    const vTired = val(tiredness);
    const vDuration = val(duration);
    const vSore = val(soreness);

    const vStrength = val(strength);
    const vEndurance = val(endurance);
    const vBalance = val(balance);
    const vSpeed = val(speed);
    const vFlexibility = val(flexibility);
    const vCardio = val(cardio);
    const vAgility = val(agility);

    // ============================
    // 1️⃣ Training Load
    // ============================
    const trainingLoad = vRpe * vDuration;

    // ============================
    // 2️⃣ Recovery Score
    // ============================
    const recovery =
      (vSleep + vSore + vTired) / 3;

    // ============================
    // 3️⃣ Fatigue Score
    // ============================
    const fatigue =
      recovery === 0
        ? 0
        : trainingLoad / (recovery * 10);

    // ============================
    // 4️⃣ Readiness Score
    // ============================
    const readiness =
      (0.4 * recovery) +
      (0.3 * vRpe) +
      (0.3 * trainingLoad);

    // ============================
    // 5️⃣ Overall Performance
    // ============================
    const overallPerformance =
      (vStrength +
       vFlexibility +
       vEndurance +
       vCardio +
       vBalance +
       vAgility +
       vSpeed) / 7;


       // ============================
   // 6️⃣ Skill Gap
    // ============================
    const MAX_SKILL_SCORE = 10;

     const skillGap =MAX_SKILL_SCORE - overallPerformance;


    // ============================
    // 6️⃣ Get Average Training Load
    // ============================
    const avgResult = await pool.query(
      `SELECT AVG(training_load) AS avg_load
       FROM player_assessments
       WHERE player_id = $1`,
      [id]
    );

    const averageTrainingLoad =
      Number(avgResult.rows[0].avg_load) || 0;

    // ============================
    // 7️⃣ Injury Risk
    // ============================

    const FATIGUE_MAX = 10;
    const RECOVERY_MAX = 10;
    const READINESS_MAX = 100;

    const FR = fatigue / FATIGUE_MAX;

    const WR =
      averageTrainingLoad > 0
        ? trainingLoad / averageTrainingLoad
        : 0;

    const WR_normalized = WR / 1.5;

    const RR =
      1 - (recovery / RECOVERY_MAX);

    const ReR =
      1 - (readiness / READINESS_MAX);

    const injuryRisk =
      (0.35 * FR) +
      (0.25 * WR_normalized) +
      (0.25 * RR) +
      (0.15 * ReR);

    // ============================
    // 8️⃣ Risk Level
    // ============================

    let riskLevel = "Low Risk";

    if (injuryRisk >= 0.30 && injuryRisk <= 0.55) {
      riskLevel = "Moderate Risk";
    } else if (injuryRisk > 0.55) {
      riskLevel = "High Risk";
    }

    // ============================
    // 9️⃣ Store in Database
    // ============================

    await pool.query(
      `INSERT INTO player_assessments (
        player_id,
        rpe,
        sleep_hour,
        tiredness,
        duration,
        soreness,
        strength,
        endurance,
        balance,
        speed,
        flexibility,
        cardio,
        agility,
        recovery_score,
        training_load,
        fatigue,
        readiness,
        overall_performance,
        injury_risk,
        skill_gap,
        coach_notes,
        created_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12,$13,
        $14,$15,$16,$17,$18,$19,$20,$21,
        NOW()
      )`,
      [
        id,
        vRpe,
        vSleep,
        vTired,
        vDuration,
        vSore,
        vStrength,
        vEndurance,
        vBalance,
        vSpeed,
        vFlexibility,
        vCardio,
        vAgility,
        Number(recovery.toFixed(2)),
        Number(trainingLoad.toFixed(2)),
        Number(fatigue.toFixed(2)),
        Number(readiness.toFixed(2)),
        Number(overallPerformance.toFixed(2)),
        Number(injuryRisk.toFixed(3)),
        Number(skillGap.toFixed(2)),
        coachNotes || null
      ]
    );

    // ============================
    // 🔟 Send Email
    // ============================

    await transporter.sendMail({
      from: '"MiniProject Analyst" <miniproject783@gmail.com>',
      to: playerEmail,
      subject: `Performance Update: ${playerName}`,
      html: `
        <h3>Your Latest Assessment</h3>
        <p><strong>Training Load:</strong> ${trainingLoad.toFixed(2)}</p>
        <p><strong>Recovery:</strong> ${recovery.toFixed(2)}</p>
        <p><strong>Fatigue:</strong> ${fatigue.toFixed(2)}</p>
        <p><strong>Readiness:</strong> ${readiness.toFixed(2)}</p>
        <p><strong>Overall Performance:</strong> ${overallPerformance.toFixed(2)}</p>
        <p><strong>Injury Risk:</strong> ${injuryRisk.toFixed(3)} (${riskLevel})</p>
      `,
    });

    res.status(201).json({
      success: true,
      trainingLoad: Number(trainingLoad.toFixed(2)),
      recovery: Number(recovery.toFixed(2)),
      fatigue: Number(fatigue.toFixed(2)),
      readiness: Number(readiness.toFixed(2)),
      overallPerformance: Number(overallPerformance.toFixed(2)),
      injuryRisk: Number(injuryRisk.toFixed(3)),
      skillGap: Number(skillGap.toFixed(2)),
      riskLevel
    });

  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: "Failed to process request." });
  }
};*/






const pool = require("../db/db.js");
const nodemailer = require("nodemailer");

// 📧 NODEMAILER CONFIGURATION
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  family:4,
  port: 587,
  secure: false,
  auth: {
    user: "miniproject783@gmail.com",
    pass: "wwgaucxltubvfwbw", // Gmail App Password ONLY
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



exports.saveAssessment = async (req, res) => {
  const id = Number(req.params.id);

  const {
    rpe,
    sleepHour,
    tiredness,
    duration,
    soreness,
    strength,
    endurance,
    balance,
    speed,
    flexibility,
    cardio,
    agility,
    coachNotes
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

    const val = (n) => (isNaN(Number(n)) ? 0 : Number(n));

    const vRpe = val(rpe);
    const vSleep = val(sleepHour);
    const vTired = val(tiredness);
    const vDuration = val(duration);
    const vSore = val(soreness);

    const vStrength = val(strength);
    const vEndurance = val(endurance);
    const vBalance = val(balance);
    const vSpeed = val(speed);
    const vFlexibility = val(flexibility);
    const vCardio = val(cardio);
    const vAgility = val(agility);

    // ============================
    // 1️⃣ Training Load
    // ============================
    const trainingLoad = vRpe * vDuration;

    // ============================
    // 2️⃣ Recovery Score
    // ============================
    const recovery =
      (vSleep + (10 - vSore) + (10 - vTired)) / 3;

    // ============================
    // 3️⃣ Fatigue Score
    // ============================

    const MaxTrainingLoad = 1200; // Example max value  if a player trains 120 minutes at RPE 10 (10(120)=1200)
    const NormalizedLoad = trainingLoad / MaxTrainingLoad;
    const fatigue =
      recovery === 0
        ? 0
        : (0.6 * NormalizedLoad) + (0.4*(1-(recovery / 10)));

    // ============================
    // 4️⃣ Readiness Score
    // ============================
    const readiness =
      ((0.5 * recovery) +
      (0.3 * (10-vRpe)) +
      (0.2 * (1-NormalizedLoad)*10))/10 * 100;

    // ============================
    // 5️⃣ Overall Performance
    // ============================
    const overallPerformance =
      (vStrength +
       vFlexibility +
       vEndurance +
       vCardio +
       vBalance +
       vAgility +
       vSpeed) / 7;


       // ============================
   // 6️⃣ Skill Gap
    // ============================
    const MAX_SKILL_SCORE = 10;

     const skillGap =MAX_SKILL_SCORE - overallPerformance;


    // ============================
    // 6️⃣ Get Average Training Load
    // ============================
    const avgResult = await pool.query(
      `SELECT AVG(training_load) AS avg_load
       FROM player_assessments
       WHERE player_id = $1`,
      [id]
    );

    const averageTrainingLoad =
      Number(avgResult.rows[0].avg_load) || 0;

    // ============================
    // 7️⃣ Injury Risk
    // ============================

    const fatigueN = fatigue;   //normalize to 0-1
    const sorenessN=vSore/10;
    const rpeN = vRpe / 10;
    const sleepN = vSleep / 10;



    

    
    const injuryRisk =
      (0.35 * fatigueN) +
      (0.30 * sorenessN) +
      (0.20 * rpeN) +
      (0.15 * (1-sleepN));

    // ============================
    // 8️⃣ Risk Level
    // ============================

    let riskLevel = "";

    if (injuryRisk < 0.25 ) {
      riskLevel = "Low Risk";
    } else if (injuryRisk < 0.50) {
      riskLevel = "Moderate Risk";
    } else if(injuryRisk <0.75){
      riskLevel = "High Risk";
    }
    else{
      riskLevel="Very High Risk";
    }

    // ============================
    // 9️⃣ Store in Database
    // ============================

    await pool.query(
      `INSERT INTO player_assessments (
        player_id,
        rpe,
        sleep_hour,
        tiredness,
        duration,
        soreness,
        strength,
        endurance,
        balance,
        speed,
        flexibility,
        cardio,
        agility,
        recovery_score,
        training_load,
        fatigue,
        readiness,
        overall_performance,
        injury_risk,
        skill_gap,
        coach_notes,
        created_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12,$13,
        $14,$15,$16,$17,$18,$19,$20,$21,
        NOW()
      )`,
      [
        id,
        vRpe,
        vSleep,
        vTired,
        vDuration,
        vSore,
        vStrength,
        vEndurance,
        vBalance,
        vSpeed,
        vFlexibility,
        vCardio,
        vAgility,
        Number(recovery.toFixed(2)),
        Number(trainingLoad.toFixed(2)),
        Number(fatigue.toFixed(2)),
        Number(readiness.toFixed(2)),
        Number(overallPerformance.toFixed(2)),
        Number(injuryRisk.toFixed(3)),
        Number(skillGap.toFixed(2)),
        coachNotes || null
      ]
    );

    // ============================
    // 🔟 Send Email
    // ============================

    await transporter.sendMail({
      from: '"MiniProject Analyst" <miniproject783@gmail.com>',
      to: playerEmail,
      subject: `Performance Update: ${playerName}`,
      html: `
        <h3>Your Latest Assessment</h3>
        <p><strong>Training Load:</strong> ${trainingLoad.toFixed(2)}</p>
        <p><strong>Recovery:</strong> ${recovery.toFixed(2)}</p>
        <p><strong>Fatigue:</strong> ${fatigue.toFixed(2)}</p>
        <p><strong>Readiness:</strong> ${readiness.toFixed(2)}</p>
        <p><strong>Overall Performance:</strong> ${overallPerformance.toFixed(2)}</p>
        <p><strong>Injury Risk:</strong> ${injuryRisk.toFixed(3)} (${riskLevel})</p>
      `,
    });

    res.status(201).json({
      success: true,
      trainingLoad: Number(trainingLoad.toFixed(2)),
      recovery: Number(recovery.toFixed(2)),
      fatigue: Number(fatigue.toFixed(2)),
      readiness: Number(readiness.toFixed(2)),
      overallPerformance: Number(overallPerformance.toFixed(2)),
      injuryRisk: Number(injuryRisk.toFixed(3)),
      skillGap: Number(skillGap.toFixed(2)),
      riskLevel
    });

  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: "Failed to process request." });
  }
};




















