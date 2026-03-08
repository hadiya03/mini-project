const pool = require("../db/db.js");

exports.getTeam = async (req, res) => {
  const trainerId = req.params.trainerId;
  const result = await pool.query(
    `SELECT u.id, u.name, u.email
     FROM users u
     JOIN trainer_players tp ON u.id = tp.player_id
     WHERE tp.trainer_id = $1`, [trainerId]);
  res.json(result.rows);
};


exports.getPlayers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM players ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get Players Error:", error);
    res.status(500).json({ message: "Failed to fetch players" });
  }
};



exports.deletePlayer = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    // 1️⃣ Get email of the player
    const playerResult = await client.query(
      "SELECT email FROM players WHERE id = $1",
      [id]
    );

    if (playerResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Player not found" });
    }

    const email = playerResult.rows[0].email;

    // 2️⃣ Delete player
    await client.query(
      "DELETE FROM players WHERE id = $1",
      [id]
    );

    // 3️⃣ Delete user using same email
    await client.query(
      "DELETE FROM users WHERE email = $1",
      [email]
    );

    await client.query("COMMIT");

    res.status(200).json({ message: "Player and user deleted successfully" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete Player Error:", error);
    res.status(500).json({ message: "Failed to delete player" });
  } finally {
    client.release();
  }
};


exports.getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM players WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get Player By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch player" });
  }
};


/**exports.updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      position,
      age,
      height,
      weight,
      preferred_foot,
      current_team,
    } = req.body;

    const result = await pool.query(
      `UPDATE players
       SET name=$1, email=$2, position=$3, age=$4,
           height=$5, weight=$6,
           preferred_foot=$7, current_team=$8
       WHERE id=$9
       RETURNING *`,
      [
        name,
        email,
        position,
        age,
        height,
        weight,
        preferred_foot,
        current_team,
        id,
      ]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update player" });
  }
};*/


exports.updatePlayer = async (req, res) => {

  
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { name, email, position, age, weight, height, preferred_foot, current_team, profile_image } = req.body;

    await client.query("BEGIN");

    // 1️⃣ Get old name & email from players
    const playerResult = await client.query(
      "SELECT name, email FROM players WHERE id = $1",
      [id]
    );

    if (playerResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Player not found" });
    }

    const oldName = playerResult.rows[0].name;
    const oldEmail = playerResult.rows[0].email;

    // 2️⃣ Update players table
    await client.query(
      `UPDATE players SET
        name = $1,
        email = $2,
        position = $3,
        age = $4,
        weight = $5,
        height = $6,
        preferred_foot = $7,
        current_team = $8,
        profile_image = $9
       WHERE id = $10`,
      [name, email, position, age, weight, height, preferred_foot, current_team, profile_image, id]
    );

    // 3️⃣ If name OR email changed → update users
    if (name !== oldName || email !== oldEmail) {
      await client.query(
        `UPDATE users
         SET name = $1,
             email = $2
         WHERE email = $3`,
        [name, email, oldEmail]
      );
    }

    await client.query("COMMIT");

    res.status(200).json({ message: "Player & user updated successfully" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update Error:", error);
    res.status(500).json({ message: "Update failed" });
  } finally {
    client.release();
  }
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