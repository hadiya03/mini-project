
/*const pool = require("../db/db.js");
const bcrypt = require("bcrypt");


exports.createPlayer = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      player_id,
      email,
      name,
      position,
      age,
      weight,
      height,
      preferred_foot,
      current_team,
      profile_image,
    } = req.body;

    if (!player_id || !email || !name) {
      return res
        .status(400)
        .json({ message: "player_id, email and name are required" });
    }

    await client.query("BEGIN");

    // ✅ Check if email already exists in users table
    const existingUser = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Player can't register using this email",
      });
    }

    // ✅ Hash password (player_id as password)
    const hashedPassword = await bcrypt.hash(player_id.toString(), 10);

    // ✅ Insert into users table
    await client.query(
      `INSERT INTO users 
       (name, email, password, otp, is_verified, role)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        name,
        email,
        hashedPassword,
        null,      // otp
        1,         // is_verified
        "player",  // role
      ]
    );

    // ✅ Insert into players table
    const query = `
      INSERT INTO players (
        player_id,
        email,
        name,
        position,
        age,
        weight,
        height,
        preferred_foot,
        current_team,
        profile_image
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const values = [
      player_id,
      email,
      name,
      position || null,
      age ?? null,
      weight ?? null,
      height ?? null,
      preferred_foot || null,
      current_team || null,
      profile_image || null,
    ];

    const result = await client.query(query, values);

    await client.query("COMMIT");

    res.status(201).json(result.rows[0]);

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create Player Error:", error);
    res.status(500).json({ message: "Failed to create player" });
  } finally {
    client.release();
  }
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

exports.updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { readiness_score, fatigue_score, readiness_history } = req.body;

    const query = `
      UPDATE players
      SET
        readiness_score = $1,
        fatigue_score = $2,
        readiness_history = $3
      WHERE id = $4
      RETURNING *;
    `;

    const values = [
      readiness_score ?? null,
      fatigue_score ?? null,
      JSON.stringify(readiness_history || []),
      id,
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update Assessment Error:", error);
    res.status(500).json({ message: "Failed to update assessment" });
  }
};

// update player profile
exports.updatePlayer = async (req, res) => {
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
};


exports.deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM players WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Delete Player Error:", error);
    res.status(500).json({ message: "Failed to delete player" });
  }
};



// ✅ GET latest daily input for analyst dashboard
exports.getLatestDailyInput = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         rpe,
         sleep,
         soreness,
         tiredness,
         readiness,
         injury_risk,
         trainer_feedback,
         submitted_at
       FROM training_submissions
       WHERE player_id = $1
       ORDER BY submitted_at DESC
       LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json(null);
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Error fetching daily input:", error);
    res.status(500).json({ message: "Server error" });
  }
};*/










const pool = require("../db/db.js");
const bcrypt = require("bcrypt");

/* ================= CREATE PLAYER ================= */
exports.createPlayer = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      player_id,
      email,
      name,
      position,
      age,
      weight,
      height,
      preferred_foot,
      current_team,
      profile_image,
    } = req.body;

    if (!player_id || !email || !name) {
      return res
        .status(400)
        .json({ message: "player_id, email and name are required" });
    }

    await client.query("BEGIN");

    // ✅ Check if email already exists in users table
    const existingUser = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Player can't register using this email",
      });
    }

    // ✅ Hash password (player_id as password)
    const hashedPassword = await bcrypt.hash(player_id.toString(), 10);

    // ✅ Insert into users table
    await client.query(
      `INSERT INTO users 
       (name, email, password, otp, is_verified, role)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        name,
        email,
        hashedPassword,
        null,      // otp
        1,         // is_verified
        "player",  // role
      ]
    );

    // ✅ Insert into players table
    const query = `
      INSERT INTO players (
        player_id,
        email,
        name,
        position,
        age,
        weight,
        height,
        preferred_foot,
        current_team,
        profile_image
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const values = [
      player_id,
      email,
      name,
      position || null,
      age ?? null,
      weight ?? null,
      height ?? null,
      preferred_foot || null,
      current_team || null,
      profile_image || null,
    ];

    const result = await client.query(query, values);

    await client.query("COMMIT");

    res.status(201).json(result.rows[0]);

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create Player Error:", error);
    res.status(500).json({ message: "Failed to create player" });
  } finally {
    client.release();
  }
};

/* ================= GET ALL PLAYERS ================= */
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

/* ================= GET PLAYER BY ID ================= */
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

/* ================= UPDATE READINESS / FATIGUE ================= */
exports.updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { readiness_score, fatigue_score, readiness_history } = req.body;

    const query = `
      UPDATE players
      SET
        readiness_score = $1,
        fatigue_score = $2,
        readiness_history = $3
      WHERE id = $4
      RETURNING *;
    `;

    const values = [
      readiness_score ?? null,
      fatigue_score ?? null,
      JSON.stringify(readiness_history || []),
      id,
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update Assessment Error:", error);
    res.status(500).json({ message: "Failed to update assessment" });
  }
};

// update player profile
/*exports.updatePlayer = async (req, res) => {
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
/* ================= DELETE PLAYER ================= */
/*exports.deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM players WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    //await db.query("DELETE FROM users WHERE id = $1", [user_id]);


    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Delete Player Error:", error);
    res.status(500).json({ message: "Failed to delete player" });
  }
};*/



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



// ✅ GET latest daily input for analyst dashboard
exports.getLatestDailyInput = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         rpe,
         sleep,
         soreness,
         tiredness,
         readiness,
         injury_risk,
         trainer_feedback,
         submitted_at
       FROM training_submissions
       WHERE player_id = $1
       ORDER BY submitted_at DESC
       LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json(null);
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Error fetching daily input:", error);
    res.status(500).json({ message: "Server error" });
  }
};




/* ================= BULK CREATE PLAYERS ================= */
exports.bulkCreatePlayers = async (req, res) => {
  const client = await pool.connect();

  try {
    const players = req.body.players;

    if (!Array.isArray(players) || players.length === 0) {
      return res.status(400).json({ message: "Players array is required" });
    }

    await client.query("BEGIN");

    const insertedPlayers = [];

    for (const player of players) {
      const {
        player_id,
        email,
        name,
        position,
        age,
        weight,
        height,
        preferred_foot,
        current_team,
        profile_image,
      } = player;

      if (!player_id || !email || !name) {
        throw new Error("Missing required fields");
      }

      // Check email
      const existingUser = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error(`Email already exists: ${email}`);
      }

      const hashedPassword = await bcrypt.hash(player_id.toString(), 10);

      // Insert into users
      await client.query(
        `INSERT INTO users 
        (name, email, password, otp, is_verified, role)
        VALUES ($1,$2,$3,$4,$5,$6)`,
        [name, email, hashedPassword, null, 1, "player"]
      );

      // Insert into players
      const result = await client.query(
        `INSERT INTO players
        (player_id,email,name,position,age,weight,height,preferred_foot,current_team,profile_image)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`,
        [
          player_id,
          email,
          name,
          position || null,
          age ?? null,
          weight ?? null,
          height ?? null,
          preferred_foot || null,
          current_team || null,
          profile_image || null,
        ]
      );

      insertedPlayers.push(result.rows[0]);
    }

    console.log("Users updated rows:", userUpdate.rowCount);
    console.log("About to update players...");

    await client.query("COMMIT");

    res.status(201).json({
      message: "Players inserted successfully",
      count: insertedPlayers.length,
      players: insertedPlayers,
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Bulk Insert Error:", error);
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};
















