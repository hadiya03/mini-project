/*import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./updateAssessment.css";

const UpdateAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playerInput, setPlayerInput] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [coachNotes, setCoachNotes] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        
        const resMetrics = await fetch(`http://localhost:5000/api/players/${id}/daily-input`);
        if (resMetrics.ok) {
          const data = await resMetrics.json();
          if (data) setPlayerInput(data);
        }

        const resProfile = await fetch(`http://localhost:5000/api/players/${id}`);
        if (resProfile.ok) {
          const data = await resProfile.json();
          setPlayerProfile(data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchPlayerData();
  }, [id]);

 // ✅ FIXED ENDPOINT (removed /players)
const handleEmailReminder = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/assessments/${id}/send-reminder`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }
    );

    if (res.ok) {
      toast.success("Reminder email sent successfully!");
    } else {
      const errData = await res.json();
      toast.error(`Failed: ${errData.error || "Server error"}`);
    }
  } catch (err) {
    toast.error("Failed to send email. Check your connection.");
  }
};


  const calculateAndSync = async () => {
    if (!playerInput) {
      toast.error("Cannot calculate: Player metrics data is missing!");
      return;
    }

    const fatigue =
      (playerInput.rpe * 0.5) +
      (playerInput.tiredness * 0.3) +
      (playerInput.soreness * 0.2);

    const readiness = Math.max(
      0,
      Math.min(
        100,
        (
          playerInput.sleepHour +
          (10 - playerInput.rpe) +
          (10 - playerInput.tiredness) +
          (10 - playerInput.soreness)
        ) * 2.5
      )
    );

    const updatedResult = {
      ...playerInput,
      readiness: Number(readiness.toFixed(1)),
      fatigue: Number(fatigue.toFixed(1)),
      coachNotes: coachNotes
    };

    try {
      const res = await fetch(`http://localhost:5000/api/assessments/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedResult)
      });
      
      if (res.ok) {
        setResult(updatedResult);
        toast.success("Assessment synced and update email sent!");
      } else {
        toast.error("Sync failed on server.");
      }
    } catch (error) {
      toast.error("Sync failed.");
    }
  };

  if (loading) return <div className="assessment-container">Loading...</div>;

  return (
    <div className="assessment-container">
      <h2>Player Performance Assessment</h2>
      <p className="subtitle">
        Analyst Review Dashboard for {playerProfile?.name || "Player"}
      </p>

      <div className="metrics-grid">
        <div className="metric-card"><span>RPE :</span><strong>{playerInput?.rpe || "N/A"}</strong></div>
        <div className="metric-card"><span>Sleep Hour :</span><strong>{playerInput?.sleepHour || "N/A"}h</strong></div>
        <div className="metric-card"><span>Tiredness :</span><strong>{playerInput?.tiredness || "N/A"}</strong></div>
        <div className="metric-card"><span>Duration :</span><strong>{playerInput?.duration || "N/A"}m</strong></div>
        <div className="metric-card"><span>Soreness :</span><strong>{playerInput?.soreness || "N/A"}</strong></div>
        <div className="metric-card"><span>Strength :</span><strong>{playerInput?.strength || "N/A"}</strong></div>
        <div className="metric-card"><span>Endurance :</span><strong>{playerInput?.endurance || "N/A"}</strong></div>
        <div className="metric-card"><span>Balance :</span><strong>{playerInput?.balance || "N/A"}</strong></div>
        <div className="metric-card"><span>Speed :</span><strong>{playerInput?.speed || "N/A"}</strong></div>
        <div className="metric-card"><span>Flexibility :</span><strong>{playerInput?.flexibility || "N/A"}</strong></div>
        <div className="metric-card"><span>Cardio Fitness :</span><strong>{playerInput?.cardio || "N/A"}</strong></div>
        <div className="metric-card"><span>Agility :</span><strong>{playerInput?.agility || "N/A"}</strong></div>
      </div>

      {(!playerInput || Object.keys(playerInput).length === 0) && (
        <div className="no-data-alert">
          <p>⚠️ Missing player metrics. Calculations will use "0" until player submits.</p>
          <button className="reminder-btn" onClick={handleEmailReminder}>
            Email Reminder
          </button>
        </div>
      )}

      <div className="notes-container">
        <h3>Coach Notes</h3>
        <textarea
          rows="5"
          placeholder="Enter feedback for the player dashboard here..."
          value={coachNotes}
          onChange={(e) => setCoachNotes(e.target.value)}
        />
        
        <div className="action-buttons">
          <button
            className="sync-btn"
            onClick={calculateAndSync}
            style={{ opacity: playerInput ? 1 : 0.5 }}
          >
            Calculate & Sync to Player Dashboard
          </button>
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back to Roster
          </button>
        </div>
      </div>

      {result && (
        <div className="final-results">
          <p>Calculated Readiness: <strong>{result.readiness}%</strong></p>
          <p>Calculated Fatigue: <strong>{result.fatigue}</strong></p>
        </div>
      )}
    </div>
  );
};

export default UpdateAssessment;*/













/*import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./updateAssessment.css";

const UpdateAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playerInput, setPlayerInput] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);

        const resMetrics = await fetch(
          `http://localhost:5000/api/players/${id}/daily-input`
        );
        if (resMetrics.ok) {
          const data = await resMetrics.json();
          if (data) setPlayerInput(data);
        }

        const resProfile = await fetch(
          `http://localhost:5000/api/players/${id}`
        );
        if (resProfile.ok) {
          const data = await resProfile.json();
          setPlayerProfile(data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchPlayerData();
  }, [id]);

  const handleEmailReminder = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/assessments/${id}/send-reminder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        toast.success("Reminder email sent successfully!");
      } else {
        const errData = await res.json();
        toast.error(`Failed: ${errData.error || "Server error"}`);
      }
    } catch (err) {
      toast.error("Failed to send email. Check your connection.");
    }
  };

  const calculateAndSync = async () => {
    if (!playerInput) {
      toast.error("Cannot calculate: Player metrics data is missing!");
      return;
    }

    const fatigue =
      playerInput.rpe * 0.5 +
      playerInput.tiredness * 0.3 +
      playerInput.soreness * 0.2;

    const readiness = Math.max(
      0,
      Math.min(
        100,
        (
          playerInput.sleepHour +
          (10 - playerInput.rpe) +
          (10 - playerInput.tiredness) +
          (10 - playerInput.soreness)
        ) * 2.5
      )
    );

    const updatedResult = {
      ...playerInput,
      readiness: Number(readiness.toFixed(1)),
      fatigue: Number(fatigue.toFixed(1)),
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/assessments/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedResult),
        }
      );

      if (res.ok) {
        setResult(updatedResult);
        toast.success("Assessment synced and update email sent!");
      } else {
        toast.error("Sync failed on server.");
      }
    } catch (error) {
      toast.error("Sync failed.");
    }
  };

  if (loading)
    return <div className="assessment-container">Loading...</div>;

  return (
    <div className="assessment-container">
      <h2>Player Performance Assessment</h2>
      <p className="subtitle">
        Analyst Review Dashboard for {playerProfile?.name || "Player"}
      </p>

      <div className="metrics-grid">
        <div className="metric-card"><span>RPE :</span><strong>{playerInput?.rpe || "N/A"}</strong></div>
        <div className="metric-card"><span>Sleep Hour :</span><strong>{playerInput?.sleepHour || "N/A"}h</strong></div>
        <div className="metric-card"><span>Tiredness :</span><strong>{playerInput?.tiredness || "N/A"}</strong></div>
        <div className="metric-card"><span>Duration :</span><strong>{playerInput?.duration || "N/A"}m</strong></div>
        <div className="metric-card"><span>Soreness :</span><strong>{playerInput?.soreness || "N/A"}</strong></div>
        <div className="metric-card"><span>Strength :</span><strong>{playerInput?.strength || "N/A"}</strong></div>
        <div className="metric-card"><span>Endurance :</span><strong>{playerInput?.endurance || "N/A"}</strong></div>
        <div className="metric-card"><span>Balance :</span><strong>{playerInput?.balance || "N/A"}</strong></div>
        <div className="metric-card"><span>Speed :</span><strong>{playerInput?.speed || "N/A"}</strong></div>
        <div className="metric-card"><span>Flexibility :</span><strong>{playerInput?.flexibility || "N/A"}</strong></div>
        <div className="metric-card"><span>Cardio Fitness :</span><strong>{playerInput?.cardio || "N/A"}</strong></div>
        <div className="metric-card"><span>Agility :</span><strong>{playerInput?.agility || "N/A"}</strong></div>
      </div>

      {(!playerInput || Object.keys(playerInput).length === 0) && (
        <div className="no-data-alert">
          <p>⚠️ Missing player metrics. Calculations will use "0" until player submits.</p>
          <button className="reminder-btn" onClick={handleEmailReminder}>
            Email Reminder
          </button>
        </div>
      )}

      <div className="action-buttons" style={{ marginTop: "30px" }}>
        <button
          className="sync-btn"
          onClick={calculateAndSync}
          style={{ opacity: playerInput ? 1 : 0.5 }}
        >
          Calculate & Sync to Player Dashboard
        </button>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back to Roster
        </button>
      </div>

      {result && (
        <div className="final-results">
          <p>Calculated Readiness: <strong>{result.readiness}%</strong></p>
          <p>Calculated Fatigue: <strong>{result.fatigue}</strong></p>
        </div>
      )}
    </div>
  );
};

export default UpdateAssessment;*/






/*import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./updateAssessment.css";

const UpdateAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playerInput, setPlayerInput] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  // ✅ NEW: Analyst manual performance inputs
  const [analystMetrics, setAnalystMetrics] = useState({
    strength: "",
    endurance: "",
    balance: "",
    speed: "",
    flexibility: "",
    cardio: "",
    agility: "",
  });

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);

        const resMetrics = await fetch(
          `http://localhost:5000/api/players/${id}/daily-input`
        );
        if (resMetrics.ok) {
          const data = await resMetrics.json();
          if (data) setPlayerInput(data);
        }

        const resProfile = await fetch(
          `http://localhost:5000/api/players/${id}`
        );
        if (resProfile.ok) {
          const data = await resProfile.json();
          setPlayerProfile(data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchPlayerData();
  }, [id]);

  const handleEmailReminder = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/assessments/${id}/send-reminder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        toast.success("Reminder email sent successfully!");
      } else {
        const errData = await res.json();
        toast.error(`Failed: ${errData.error || "Server error"}`);
      }
    } catch (err) {
      toast.error("Failed to send email. Check your connection.");
    }
  };

  const handleAnalystChange = (e) => {
    setAnalystMetrics({
      ...analystMetrics,
      [e.target.name]: e.target.value,
    });
  };

  const calculateAndSync = async () => {
    if (!playerInput) {
      toast.error("Cannot calculate: Player metrics data is missing!");
      return;
    }

    const fatigue =
      playerInput.rpe * 0.5 +
      playerInput.tiredness * 0.3 +
      playerInput.soreness * 0.2;

    const readiness = Math.max(
      0,
      Math.min(
        100,
        (
          playerInput.sleepHour +
          (10 - playerInput.rpe) +
          (10 - playerInput.tiredness) +
          (10 - playerInput.soreness)
        ) * 2.5
      )
    );

    const updatedResult = {
      ...playerInput,
      ...analystMetrics, // ✅ Add analyst typed data
      readiness: Number(readiness.toFixed(1)),
      fatigue: Number(fatigue.toFixed(1)),
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/assessments/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedResult),
        }
      );

      if (res.ok) {
        setResult(updatedResult);
        toast.success("Assessment synced and update email sent!");
      } else {
        toast.error("Sync failed on server.");
      }
    } catch (error) {
      toast.error("Sync failed.");
    }
  };

  if (loading)
    return <div className="assessment-container">Loading...</div>;

  return (
    <div className="assessment-container">
      <h2>Player Performance Assessment</h2>
      <p className="subtitle">
        Analyst Review Dashboard for {playerProfile?.name || "Player"}
      </p>

    
<div className="player-metrics-section">
  <h3 className="section-title">Player Daily Input Metrics</h3>

  <div className="metrics-grid">

    <div className="metric-card">
      <div className="metric-label">RPE</div>
      <div className="metric-value">
        {playerInput?.rpe ?? "--"}
      </div>
    </div>

    <div className="metric-card">
      <div className="metric-label">Sleep Hours</div>
      <div className="metric-value">
        {playerInput?.sleepHour ?? "--"} 
        <span className="metric-unit">hrs</span>
      </div>
    </div>

    <div className="metric-card">
      <div className="metric-label">Tiredness</div>
      <div className="metric-value">
        {playerInput?.tiredness ?? "--"}
      </div>
    </div>

    <div className="metric-card">
      <div className="metric-label">Training Duration</div>
      <div className="metric-value">
        {playerInput?.duration ?? "--"}
        <span className="metric-unit"> min</span>
      </div>
    </div>

    <div className="metric-card">
      <div className="metric-label">Muscle Soreness</div>
      <div className="metric-value">
        {playerInput?.soreness ?? "--"}
      </div>
    </div>

  </div>
</div>


      
      <div className="analyst-section">
  <h3 className="section-title">Analyst Performance Input</h3>

  <div className="analyst-grid">
    {Object.keys(analystMetrics).map((key) => (
      <div key={key} className="input-card">
        <label className="input-label">
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </label>
        <input
          type="number"
          name={key}
          value={analystMetrics[key]}
          onChange={handleAnalystChange}
          placeholder="0 - 10"
          min="0"
          max="10"
          className="styled-input"
        />
      </div>
    ))}
  </div>
</div>


      {(!playerInput || Object.keys(playerInput).length === 0) && (
        <div className="no-data-alert">
          <p>⚠️ Missing player metrics. Calculations will use "0" until player submits.</p>
          <button className="reminder-btn" onClick={handleEmailReminder}>
            Email Reminder
          </button>
        </div>
      )}

      <div className="action-buttons" style={{ marginTop: "30px" }}>
        <button
          className="sync-btn"
          onClick={calculateAndSync}
          style={{ opacity: playerInput ? 1 : 0.5 }}
        >
          Calculate & Sync to Player Dashboard
        </button>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back to Roster
        </button>
      </div>

      {result && (
        <div className="final-results">
          <p>Calculated Readiness: <strong>{result.readiness}%</strong></p>
          <p>Calculated Fatigue: <strong>{result.fatigue}</strong></p>
        </div>
      )}
    </div>
  );
};

export default UpdateAssessment;*/


/*import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./updateAssessment.css";

const UpdateAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playerInput, setPlayerInput] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const [analystMetrics, setAnalystMetrics] = useState({
    strength: "",
    endurance: "",
    balance: "",
    speed: "",
    flexibility: "",
    cardio: "",
    agility: "",
  });

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);

        const resMetrics = await fetch(
          `http://localhost:5000/api/player/${id}/daily-input`
        );
        if (resMetrics.ok) {
          const data = await resMetrics.json();
          if (data) setPlayerInput(data);
        }

        const resProfile = await fetch(
          `http://localhost:5000/api/players/${id}`
        );
        if (resProfile.ok) {
          const data = await resProfile.json();
          setPlayerProfile(data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchPlayerData();
  }, [id]);

  const handleEmailReminder = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/assessments/${id}/send-reminder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        toast.success("Reminder email sent successfully!");
      } else {
        const errData = await res.json();
        toast.error(`Failed: ${errData.error || "Server error"}`);
      }
    } catch (err) {
      toast.error("Failed to send email. Check your connection.");
    }
  };

  const handleAnalystChange = (e) => {
    setAnalystMetrics({
      ...analystMetrics,
      [e.target.name]: e.target.value,
    });
  };

  const calculateAndSync = async () => {
    if (
    !playerInput ||
    playerInput.rpe == null ||
    playerInput.sleep == null ||
    playerInput.tiredness == null ||
    playerInput.soreness == null
  ) {
    toast.error("Player daily metrics are incomplete!");
    return;
  }

  // 🚫 Check if analyst filled all skill fields
  const hasEmptyField = Object.values(analystMetrics).some(
    (value) => value === ""
  );

  if (hasEmptyField) {
    toast.error("Please fill all analyst performance fields!");
    return;
  }

    const fatigue =
      playerInput.rpe * 0.5 +
      playerInput.tiredness * 0.3 +
      playerInput.soreness * 0.2;

    const readiness = Math.max(
      0,
      Math.min(
        100,
        (
          playerInput.sleep +
          (10 - playerInput.rpe) +
          (10 - playerInput.tiredness) +
          (10 - playerInput.soreness)
        ) * 2.5
      )
    );

    // 🎯 SINGLE METHOD TO FIND SKILL GAP (OUT OF 100)

    const TARGET_SCORE = 8;

    // Step 1: Calculate Average Skill Score
    const strength = Number(analystMetrics.strength || 0);
    const endurance = Number(analystMetrics.endurance || 0);
    const balance = Number(analystMetrics.balance || 0);
    const speed = Number(analystMetrics.speed || 0);
    const flexibility = Number(analystMetrics.flexibility || 0);
    const cardio = Number(analystMetrics.cardio || 0);
    const agility = Number(analystMetrics.agility || 0);

    const averageSkillScore =
      (strength +
        endurance +
        balance +
        speed +
        flexibility +
        cardio +
        agility) / 7;

    // Step 2: Calculate Skill Gap %
    let skillGapPercentage = 0;

    if (averageSkillScore < TARGET_SCORE) {
      skillGapPercentage =
        (1 - averageSkillScore / TARGET_SCORE) * 100;
    }

    const updatedResult = {
      ...playerInput,
      ...analystMetrics,
      readiness: Number(readiness.toFixed(1)),
      fatigue: Number(fatigue.toFixed(1)),
      averageSkillScore: Number(averageSkillScore.toFixed(2)),
      skillGapPercentage: Number(skillGapPercentage.toFixed(2)),
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/assessments/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedResult),
        }
      );

      if (res.ok) {
        setResult(updatedResult);
        toast.success("Assessment synced and update email sent!");
      } else {
        toast.error("Sync failed on server.");
      }
    } catch (error) {
      toast.error("Sync failed.");
    }
  };

  if (loading)
    return <div className="assessment-container">Loading...</div>;

  return (
    <div className="assessment-container">
      <h2>Player Performance Assessment</h2>
      <p className="subtitle">
        Analyst Review Dashboard for {playerProfile?.name || "Player"}
      </p>

      <div className="player-metrics-section">
        <h3 className="section-title">Player Daily Input Metrics</h3>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">RPE</div>
            <div className="metric-value">
              {playerInput?.rpe ?? "--"}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Sleep Hours</div>
            <div className="metric-value">
              {playerInput?.sleep ?? "--"}
              <span className="metric-unit">hrs</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Tiredness</div>
            <div className="metric-value">
              {playerInput?.tiredness ?? "--"}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Training Duration</div>
            <div className="metric-value">
              {playerInput?.duration ?? "--"}
              <span className="metric-unit"> min</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Muscle Soreness</div>
            <div className="metric-value">
              {playerInput?.soreness ?? "--"}
            </div>
          </div>
        </div>
      </div>

      <div className="analyst-section">
        <h3 className="section-title">Analyst Performance Input</h3>

        <div className="analyst-grid">
          {Object.keys(analystMetrics).map((key) => (
            <div key={key} className="input-card">
              <label className="input-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="number"
                name={key}
                value={analystMetrics[key]}
                onChange={handleAnalystChange}
                placeholder="0 - 10"
                min="0"
                max="10"
                className="styled-input"
              />
            </div>
          ))}
        </div>
      </div>

      {(!playerInput || Object.keys(playerInput).length === 0) && (
        <div className="no-data-alert">
          <p>⚠️ Missing player metrics. Calculations will use "0" until player submits.</p>
          <button className="reminder-btn" onClick={handleEmailReminder}>
            Email Reminder
          </button>
        </div>
      )}

      <div className="action-buttons" style={{ marginTop: "30px" }}>
        <button
          className="sync-btn"
          onClick={calculateAndSync}
          style={{ opacity: playerInput ? 1 : 0.5 }}
        >
          Calculate & Sync to Player Dashboard
        </button>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back👈
        </button>
      </div>

      {result && (
        <div className="final-results">
          <p>Calculated Readiness: <strong>{result.readiness}%</strong></p>
          <p>Calculated Fatigue: <strong>{result.fatigue}</strong></p>
          <p>Average Skill Score: <strong>{result.averageSkillScore}</strong></p>
          <p>Overall Skill Gap (%): <strong>{result.skillGapPercentage}%</strong></p>
        </div>
      )}
    </div>
  );
};

export default UpdateAssessment;*/




/*import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./updateAssessment.css";

const UpdateAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playerInput, setPlayerInput] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const [analystMetrics, setAnalystMetrics] = useState({
    strength: "",
    endurance: "",
    balance: "",
    speed: "",
    flexibility: "",
    cardio: "",
    agility: "",
  });

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);

        const resMetrics = await fetch(
          `http://localhost:5000/api/player/${id}/daily-input`
        );
        if (resMetrics.ok) {
          const data = await resMetrics.json();
          if (data) setPlayerInput(data);
        }

        const resProfile = await fetch(
          `http://localhost:5000/api/players/${id}`
        );
        if (resProfile.ok) {
          const data = await resProfile.json();
          setPlayerProfile(data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchPlayerData();
  }, [id]);

  const handleEmailReminder = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/assessments/${id}/send-reminder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        toast.success("Reminder email sent successfully!");
      } else {
        const errData = await res.json();
        toast.error(`Failed: ${errData.error || "Server error"}`);
      }
    } catch (err) {
      toast.error("Failed to send email. Check your connection.");
    }
  };

  const handleAnalystChange = (e) => {
    setAnalystMetrics({
      ...analystMetrics,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ CHECK IF PLAYER METRICS ARE INCOMPLETE
  const isMetricsIncomplete =
    !playerInput ||
    playerInput.rpe == null ||
    playerInput.sleep == null ||
    playerInput.tiredness == null ||
    playerInput.soreness == null;

  const calculateAndSync = async () => {
    if (isMetricsIncomplete) {
      toast.error("Player daily metrics are incomplete!");
      return;
    }

    const hasEmptyField = Object.values(analystMetrics).some(
      (value) => value === ""
    );

    if (hasEmptyField) {
      toast.error("Please fill all analyst performance fields!");
      return;
    }

    const fatigue =
      playerInput.rpe * 0.5 +
      playerInput.tiredness * 0.3 +
      playerInput.soreness * 0.2;

    const readiness = Math.max(
      0,
      Math.min(
        100,
        (
          playerInput.sleep +
          (10 - playerInput.rpe) +
          (10 - playerInput.tiredness) +
          (10 - playerInput.soreness)
        ) * 2.5
      )
    );

    const TARGET_SCORE = 8;

    const strength = Number(analystMetrics.strength || 0);
    const endurance = Number(analystMetrics.endurance || 0);
    const balance = Number(analystMetrics.balance || 0);
    const speed = Number(analystMetrics.speed || 0);
    const flexibility = Number(analystMetrics.flexibility || 0);
    const cardio = Number(analystMetrics.cardio || 0);
    const agility = Number(analystMetrics.agility || 0);

    const averageSkillScore =
      (strength +
        endurance +
        balance +
        speed +
        flexibility +
        cardio +
        agility) / 7;

    let skillGapPercentage = 0;

    if (averageSkillScore < TARGET_SCORE) {
      skillGapPercentage =
        (1 - averageSkillScore / TARGET_SCORE) * 100;
    }

    const updatedResult = {
      ...playerInput,
      ...analystMetrics,
      readiness: Number(readiness.toFixed(1)),
      fatigue: Number(fatigue.toFixed(1)),
      averageSkillScore: Number(averageSkillScore.toFixed(2)),
      skillGapPercentage: Number(skillGapPercentage.toFixed(2)),
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/assessments/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedResult),
        }
      );

      if (res.ok) {
        setResult(updatedResult);
        toast.success("Assessment synced and update email sent!");
      } else {
        toast.error("Sync failed on server.");
      }
    } catch (error) {
      toast.error("Sync failed.");
    }
  };

  if (loading)
    return <div className="assessment-container">Loading...</div>;

  return (
    <div className="assessment-container">
      <h2>Player Performance Assessment</h2>
      <p className="subtitle">
        Analyst Review Dashboard for {playerProfile?.name || "Player"}
      </p>

      <div className="player-metrics-section">
        <h3 className="section-title">Player Daily Input Metrics</h3>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">RPE</div>
            <div className="metric-value">
              {playerInput?.rpe ?? "--"}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Sleep Hours</div>
            <div className="metric-value">
              {playerInput?.sleep ?? "--"}
              <span className="metric-unit">hrs</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Tiredness</div>
            <div className="metric-value">
              {playerInput?.tiredness ?? "--"}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Training Duration</div>
            <div className="metric-value">
              {playerInput?.duration ?? "--"}
              <span className="metric-unit"> min</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Muscle Soreness</div>
            <div className="metric-value">
              {playerInput?.soreness ?? "--"}
            </div>
          </div>
        </div>
      </div>

   
      {isMetricsIncomplete && (
        <div className="no-data-alert">
          <p>⚠️ Player daily metrics are incomplete.</p>
          <button className="reminder-btn" onClick={handleEmailReminder}>
            Email Reminder
          </button>
        </div>
      )}

      <div className="analyst-section">
        <h3 className="section-title">Analyst Performance Input</h3>

        <div className="analyst-grid">
          {Object.keys(analystMetrics).map((key) => (
            <div key={key} className="input-card">
              <label className="input-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="number"
                name={key}
                value={analystMetrics[key]}
                onChange={handleAnalystChange}
                placeholder="0 - 10"
                min="0"
                max="10"
                className="styled-input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons" style={{ marginTop: "30px" }}>
        <button
          className="sync-btn"
          onClick={calculateAndSync}
          style={{ opacity: isMetricsIncomplete ? 0.5 : 1 }}
        >
          Calculate & Sync to Player Dashboard
        </button>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back👈
        </button>
      </div>

      {result && (
        <div className="final-results">
          <p>Calculated Readiness: <strong>{result.readiness}%</strong></p>
          <p>Calculated Fatigue: <strong>{result.fatigue}</strong></p>
          <p>Average Skill Score: <strong>{result.averageSkillScore}</strong></p>
          <p>Overall Skill Gap (%): <strong>{result.skillGapPercentage}%</strong></p>
        </div>
      )}
    </div>
  );
};

export default UpdateAssessment;*/






/*import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./updateAssessment.css";

const UpdateAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playerInput, setPlayerInput] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [trainingDuration, setTrainingDuration] = useState(null); // ✅ added
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const [analystMetrics, setAnalystMetrics] = useState({
    strength: "",
    endurance: "",
    balance: "",
    speed: "",
    flexibility: "",
    cardio: "",
    agility: "",
  });

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);

        // Player daily metrics
        const resMetrics = await fetch(
          `http://localhost:5000/api/player/${id}/daily-input`
        );
        if (resMetrics.ok) {
          const data = await resMetrics.json();
          if (data) setPlayerInput(data);
        }

        // Player profile
        const resProfile = await fetch(
          `http://localhost:5000/api/players/${id}`
        );
        if (resProfile.ok) {
          const data = await resProfile.json();
          setPlayerProfile(data);
        }

        // ✅ Fetch latest training duration
        const resTraining = await fetch(
          `http://localhost:5000/api/training-sessions/latest`
        );
        if (resTraining.ok) {
          const data = await resTraining.json();
          if (data) setTrainingDuration(data.duration_minutes);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchPlayerData();
  }, [id]);

  const handleEmailReminder = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/assessments/${id}/send-reminder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        toast.success("Reminder email sent successfully!");
      } else {
        const errData = await res.json();
        toast.error(`Failed: ${errData.error || "Server error"}`);
      }
    } catch (err) {
      toast.error("Failed to send email. Check your connection.");
    }
  };

  const handleAnalystChange = (e) => {
    setAnalystMetrics({
      ...analystMetrics,
      [e.target.name]: e.target.value,
    });
  };

  const isMetricsIncomplete =
    !playerInput ||
    playerInput.rpe == null ||
    playerInput.sleep == null ||
    playerInput.tiredness == null ||
    playerInput.soreness == null;

  const calculateAndSync = async () => {
    if (isMetricsIncomplete) {
      toast.error("Player daily metrics are incomplete!");
      return;
    }

    const hasEmptyField = Object.values(analystMetrics).some(
      (value) => value === ""
    );

    if (hasEmptyField) {
      toast.error("Please fill all analyst performance fields!");
      return;
    }

    const fatigue =
      playerInput.rpe * 0.5 +
      playerInput.tiredness * 0.3 +
      playerInput.soreness * 0.2;

    const readiness = Math.max(
      0,
      Math.min(
        100,
        (
          playerInput.sleep +
          (10 - playerInput.rpe) +
          (10 - playerInput.tiredness) +
          (10 - playerInput.soreness)
        ) * 2.5
      )
    );

    const TARGET_SCORE = 8;

    const strength = Number(analystMetrics.strength || 0);
    const endurance = Number(analystMetrics.endurance || 0);
    const balance = Number(analystMetrics.balance || 0);
    const speed = Number(analystMetrics.speed || 0);
    const flexibility = Number(analystMetrics.flexibility || 0);
    const cardio = Number(analystMetrics.cardio || 0);
    const agility = Number(analystMetrics.agility || 0);

    const averageSkillScore =
      (strength +
        endurance +
        balance +
        speed +
        flexibility +
        cardio +
        agility) / 7;

    let skillGapPercentage = 0;

    if (averageSkillScore < TARGET_SCORE) {
      skillGapPercentage =
        (1 - averageSkillScore / TARGET_SCORE) * 100;
    }

    const updatedResult = {
      ...playerInput,
      ...analystMetrics,
      readiness: Number(readiness.toFixed(1)),
      fatigue: Number(fatigue.toFixed(1)),
      averageSkillScore: Number(averageSkillScore.toFixed(2)),
      skillGapPercentage: Number(skillGapPercentage.toFixed(2)),
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/assessments/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedResult),
        }
      );

      if (res.ok) {
        setResult(updatedResult);
        toast.success("Assessment synced and update email sent!");
      } else {
        toast.error("Sync failed on server.");
      }
    } catch (error) {
      toast.error("Sync failed.");
    }
  };

  if (loading)
    return <div className="assessment-container">Loading...</div>;

  return (
    <div className="assessment-container">
      <h2>Player Performance Assessment</h2>
      <p className="subtitle">
        Analyst Review Dashboard for {playerProfile?.name || "Player"}
      </p>

      <div className="player-metrics-section">
        <h3 className="section-title">Player Daily Input Metrics</h3>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">RPE</div>
            <div className="metric-value">
              {playerInput?.rpe ?? "--"}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Sleep Hours</div>
            <div className="metric-value">
              {playerInput?.sleep ?? "--"}
              <span className="metric-unit">hrs</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Tiredness</div>
            <div className="metric-value">
              {playerInput?.tiredness ?? "--"}
            </div>
          </div>

  
          <div className="metric-card">
            <div className="metric-label">Training Duration</div>
            <div className="metric-value">
              {trainingDuration ?? "--"}
              <span className="metric-unit"> min</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Muscle Soreness</div>
            <div className="metric-value">
              {playerInput?.soreness ?? "--"}
            </div>
          </div>
        </div>
      </div>

      {isMetricsIncomplete && (
        <div className="no-data-alert">
          <p>⚠️ Player daily metrics are incomplete.</p>
          <button className="reminder-btn" onClick={handleEmailReminder}>
            Email Reminder
          </button>
        </div>
      )}

      <div className="analyst-section">
        <h3 className="section-title">Analyst Performance Input</h3>

        <div className="analyst-grid">
          {Object.keys(analystMetrics).map((key) => (
            <div key={key} className="input-card">
              <label className="input-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="number"
                name={key}
                value={analystMetrics[key]}
                onChange={handleAnalystChange}
                placeholder="0 - 10"
                min="0"
                max="10"
                className="styled-input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons" style={{ marginTop: "30px" }}>
        <button
          className="sync-btn"
          onClick={calculateAndSync}
          style={{ opacity: isMetricsIncomplete ? 0.5 : 1 }}
        >
          Calculate & Sync to Player Dashboard
        </button>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back👈
        </button>
      </div>

      {result && (
        <div className="final-results">
          <p>Calculated Readiness: <strong>{result.readiness}%</strong></p>
          <p>Calculated Fatigue: <strong>{result.fatigue}</strong></p>
          <p>Average Skill Score: <strong>{result.averageSkillScore}</strong></p>
          <p>Overall Skill Gap (%): <strong>{result.skillGapPercentage}%</strong></p>
        </div>
      )}
    </div>
  );
};

export default UpdateAssessment;*/








import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./updateAssessment.css";

const UpdateAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playerInput, setPlayerInput] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [trainingDuration, setTrainingDuration] = useState(null);
  const [averageTrainingLoad, setAverageTrainingLoad] = useState(0);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const [analystMetrics, setAnalystMetrics] = useState({
    strength: "",
    endurance: "",
    balance: "",
    speed: "",
    flexibility: "",
    cardio: "",
    agility: "",
  });

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);

        const resMetrics = await fetch(
          `http://localhost:5000/api/player/${id}/daily-input`
        );
        if (resMetrics.ok) {
          const data = await resMetrics.json();
          if (data) setPlayerInput(data);
        }

        const resProfile = await fetch(
          `http://localhost:5000/api/players/${id}`
        );
        if (resProfile.ok) {
          const data = await resProfile.json();
          setPlayerProfile(data);
        }

        const resTraining = await fetch(
          `http://localhost:5000/api/training-sessions/latest`
        );
        if (resTraining.ok) {
          const data = await resTraining.json();
          if (data) setTrainingDuration(data.duration_minutes);
        }

        const resAvgLoad = await fetch(
          `http://localhost:5000/api/training-sessions/average-load/${id}`
        );
        if (resAvgLoad.ok) {
          const data = await resAvgLoad.json();
          setAverageTrainingLoad(data.averageLoad || 0);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchPlayerData();
  }, [id]);

  const handleEmailReminder = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/assessments/${id}/send-reminder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.ok) {
        toast.success("Reminder email sent successfully!");
      } else {
        toast.error("Failed to send reminder.");
      }
    } catch {
      toast.error("Failed to send email.");
    }
  };

  const handleAnalystChange = (e) => {
    setAnalystMetrics({
      ...analystMetrics,
      [e.target.name]: e.target.value,
    });
  };

  const isMetricsIncomplete =
    !playerInput ||
    playerInput.rpe == null ||
    playerInput.sleep == null ||
    playerInput.tiredness == null ||
    playerInput.soreness == null ||
    trainingDuration == null;

const calculateAndSync = async () => {
  if (isMetricsIncomplete) {
    toast.error("Player daily metrics are incomplete!");
    return;
  }

  const hasEmptyField = Object.values(analystMetrics).some(
    (value) => value === ""
  );

  if (hasEmptyField) {
    toast.error("Please fill all analyst performance fields!");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:5000/api/assessments/${id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rpe: playerInput.rpe,
          sleepHour: playerInput.sleep,
          tiredness: playerInput.tiredness,
          soreness: playerInput.soreness,
          duration: trainingDuration,
          strength: analystMetrics.strength,
          endurance: analystMetrics.endurance,
          balance: analystMetrics.balance,
          speed: analystMetrics.speed,
          flexibility: analystMetrics.flexibility,
          cardio: analystMetrics.cardio,
          agility: analystMetrics.agility,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setResult(data); // ✅ USE BACKEND RESULT ONLY
      toast.success("Assessment synced and update email sent!");
    } else {
      toast.error("Sync failed on server.");
    }
  } catch (error) {
    console.error(error);
    toast.error("Sync failed.");
  }
};


  if (loading)
    return <div className="assessment-container">Loading...</div>;

  return (
    <div className="assessment-container">
      <h2>Player Performance Assessment</h2>
      <p className="subtitle">
        Analyst Review Dashboard for {playerProfile?.name || "Player"}
      </p>

      <div className="player-metrics-section">
        <h3 className="section-title">Player Daily Input Metrics</h3>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">RPE</div>
            <div className="metric-value">
              {playerInput?.rpe ?? "--"}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Sleep Hours</div>
            <div className="metric-value">
              {playerInput?.sleep ?? "--"} hrs
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Tiredness</div>
            <div className="metric-value">
              {playerInput?.tiredness ?? "--"}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Training Duration</div>
            <div className="metric-value">
              {trainingDuration ?? "--"} min
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Muscle Soreness</div>
            <div className="metric-value">
              {playerInput?.soreness ?? "--"}
            </div>
          </div>
        </div>
      </div>

      {isMetricsIncomplete && (
        <div className="no-data-alert">
          <p>⚠️ Player daily metrics are incomplete.</p>
          <button className="reminder-btn" onClick={handleEmailReminder}>
            Email Reminder
          </button>
        </div>
      )}

      <div className="analyst-section">
        <h3 className="section-title">Analyst Performance Input</h3>

        <div className="analyst-grid">
          {Object.keys(analystMetrics).map((key) => (
            <div key={key} className="input-card">
              <label className="input-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="number"
                name={key}
                value={analystMetrics[key]}
                onChange={handleAnalystChange}
                placeholder="0 - 10"
                min="0"
                max="10"
                className="styled-input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons" style={{ marginTop: "30px" }}>
        <button
          className="sync-btn"
          onClick={calculateAndSync}
          style={{ opacity: isMetricsIncomplete ? 0.5 : 1 }}
        >
          Calculate & Sync to Player Dashboard
        </button>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back👈
        </button>
      </div>

      {result && (
        <div className="final-results">
          <p>Training Load: <strong>{result.trainingLoad}</strong></p>
          <p>Recovery Score: <strong>{result.recovery}</strong></p>
          <p>Fatigue Score: <strong>{result.fatigue}</strong></p>
          <p>Readiness Score: <strong>{result.readiness}</strong></p>
          <p>Overall Performance: <strong>{result.overallPerformance}</strong></p>
          <p>Skill Gap: <strong>{result.skillGap}</strong></p>

          <p>
            Injury Risk: <strong>{result.injuryRisk}</strong> ({result.injuryLevel})
          </p>
        </div>
      )}
    </div>
  );
};

export default UpdateAssessment;

