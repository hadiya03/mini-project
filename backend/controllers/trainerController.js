const pool = require("../db");

exports.getTeam = async (req, res) => {
  const trainerId = req.params.trainerId;
  const result = await pool.query(
    `SELECT u.id, u.name, u.email
     FROM users u
     JOIN trainer_players tp ON u.id = tp.player_id
     WHERE tp.trainer_id = $1`, [trainerId]);
  res.json(result.rows);
};

exports.getPlayerDetails = async (req, res) => {
  const playerId = req.params.playerId;
  const result = await pool.query(
    `SELECT u.name, u.email,
            COALESCE(AVG(p.performance_score),0) AS readiness_score
     FROM users u
     LEFT JOIN performance p ON u.id = p.player_id
     WHERE u.id = $1
     GROUP BY u.name, u.email`, [playerId]);
  res.json(result.rows[0]);
};

exports.scheduleTeamSession = async (req, res) => {
  const { trainer_id, session_date, session_time, description } = req.body;
  await pool.query(
    `INSERT INTO team_sessions (trainer_id, session_date, session_time, description)
     VALUES ($1,$2,$3,$4)`,
    [trainer_id, session_date, session_time, description]);
  res.json("Scheduled");
};

exports.getScheduledSessions = async (req, res) => {
  const trainerId = req.params.trainerId;
  const result = await pool.query(
    `SELECT * FROM team_sessions WHERE trainer_id=$1 ORDER BY session_date DESC`,
    [trainerId]);
  res.json(result.rows);
};