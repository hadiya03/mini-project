







/*import React, { useState, useEffect } from "react";
import './PlayerDashboard.css';
import {
  Activity, Brain, AlertTriangle, Moon,
  Zap, Lightbulb, User, Shield, Pencil, Check, Camera,
  FileDown, MessageSquare, Info, Clock, ChevronDown
} from "lucide-react";

export default function PlayerDashboard() {
  const [readiness, setReadiness] = useState(null);
  const [injuryRisk, setInjuryRisk] = useState("No data");   // <-- ADD THIS
  const [skillGap, setSkillGap] = useState("No data"); 
  const [rpe, setRpe] = useState("No data");
  const [sleep, setSleep] = useState("No data");
  const [soreness, setSoreness] = useState("No data");
  const [tiredness, setTiredness] = useState("No data");  // <-- ADD THIS
  const [isEditing, setIsEditing] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [player, setPlayer] = useState(null);
  const [trainerMessages, setTrainerMessages] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      // 1️⃣ Fetch player profile
      const profileRes = await fetch(`http://localhost:5000/api/playerdashboard/${user.email}`);
      const data = await profileRes.json();

      setPlayer({
        name: data.name,
        position: data.position,
        team: data.current_team,
        number: data.player_id,
        status: "Active",
        image: data.profile_image || ""
      });

      setReadiness(data.readiness ?? 0);
      setInjuryRisk(data.injury_risk ?? "No data");
      setSkillGap(data.skill_gap ?? "No data");
      setRpe(data.rpe ?? "No data");
      setSleep(data.sleep_hour ?? "No data");
      setSoreness(data.soreness ?? "No data");
      setTiredness(data.tiredness ?? "No data");

      // 2️⃣ Fetch trainer messages
      const messagesRes = await fetch(`http://localhost:5000/api/player/messages/${data.player_id}`);
      const messages = await messagesRes.json();
      const formattedMessages = messages.map(msg => ({
        sender: "Trainer",
        text: msg.message,
        time: new Date(msg.created_at).toLocaleString()
      }));
      setTrainerMessages(formattedMessages);

      // 3️⃣ Fetch training submissions (this is what shows Training History)
      const submissionsRes = await fetch(`http://localhost:5000/api/playerdashboard/history/${data.id}`);
      const submissionsData = await submissionsRes.json();
      const formattedSubmissions = submissionsData.map(sub => ({
        date: new Date(sub.created_at).toLocaleDateString(),
        rpe: sub.rpe,
        tiredness: sub.tiredness,
        sleep: sub.sleep,
        soreness: sub.soreness,
        readiness: sub.readiness
      }));
      setSubmissions(formattedSubmissions);

    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  fetchData();
}, []);






  const [form, setForm] = useState({
    rpe: "",
    sleep: "", 
    soreness: "",
    tiredness: ""
  });
  
  //const [trainerMessages, setTrainerMessages] = useState([]);

  const handleProfileChange = (field, value) => {
    setPlayer(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPlayer(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleInputChange = (field, value) => {
    const maxValue = field === 'sleep' ? 24 : 10;
    const numValue = parseFloat(value);
    if (value === "" || (numValue >= 0 && numValue <= maxValue)) {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
  const isFormComplete = Object.values(form).every(value => value !== "");
  if (!isFormComplete) {
    toast.error("Fill all fields");
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch(
      "http://localhost:5000/api/training-submissions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          rpe: Number(form.rpe),
          sleep: Number(form.sleep),
          soreness: Number(form.soreness),
          tiredness: Number(form.tiredness)
        })
      }
    );

    if (res.ok) {
      toast.success("Submitted successfully ✅");
      setForm({ email: user.email, rpe: "", sleep: "", soreness: "", tiredness: "" });
    } else {
      toast.error("Submission failed ❌");
    }

  } catch (err) {
    console.error(err);
    toast.error("Server error");
  }
};


  const handleDownloadPDF = () => {
  const printContents = document.getElementById("training-history-section").innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;

  window.location.reload(); // reload to restore React state
};



  const handleSaveProfile = async () => {
  if (!isEditing) {
    setIsEditing(true);
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user"));

    await fetch(`http://localhost:5000/api/playerdashboard/${user.email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: player.name,
        position: player.position,
        current_team: player.team,
        player_id: player.number,
        profile_image: player.image
      })
    });

    toast.success("Profile updated successfully ✅");
    setIsEditing(false);

  } catch (err) {
    console.error("Update failed:", err);
    toast.error("Update failed ❌");
  }
};



  // 🔒 Prevent crash before player loads
if (!player) {
  return <div className="pd-root">Loading...</div>;
}


  const initials = player.name.split(' ').map(n => n[0]).join('');

  const metrics = [
    {
      label: "RPE",
      value: rpe,
      icon: <Activity />,
      iconClass: "pd-metric-icon-blue"
    },
    {
      label: "Tiredness",
      value: tiredness,
      icon: <Zap />,
      iconClass: "pd-metric-icon-amber"
    },
    {
      label: "Injury Risk",
      value: injuryRisk,
      icon: <AlertTriangle />,
      iconClass: "pd-metric-icon-red"
    },
    {
      label: "Sleep",
      value: sleep,
      icon: <Moon />,
      iconClass: "pd-metric-icon-indigo"
    },
    {
      label: "Skill Gap",
      value: skillGap,
      icon: <Lightbulb />, // you can choose any icon you want
      iconClass: "pd-metric-icon-green"
    },
    {
       label: "Muscle Soreness",         // <-- ADD THIS
       value: soreness,  // <-- use the soreness from submissions
       icon: <Zap />,                    // <-- choose an icon, I reused Zap
       iconClass: "pd-metric-icon-pink"  // <-- choose a color class
    }
  ];

  return (
    <div className="pd-root">
      <div className="pd-container">

       
        <div className="pd-card">
          <div className="pd-card-body">
            <div className="pd-profile">

           
              <div className="pd-avatar">
                {player.image
                  ? <img src={player.image} alt={player.name} />
                  : initials
                }
                {isEditing && (
                  <label className="pd-avatar-upload">
                    <Camera />
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

            
              <div className="pd-profile-info">
                {isEditing ? (
                  <div className="pd-edit-grid">
                    <input className="pd-input" value={player.name} onChange={e => handleProfileChange('name', e.target.value)} placeholder="Name" />
                    <input className="pd-input" value={player.position} onChange={e => handleProfileChange('position', e.target.value)} placeholder="Position" />
                    <input className="pd-input" value={player.team} onChange={e => handleProfileChange('team', e.target.value)} placeholder="Team" />
                    <input className="pd-input" value={player.number} onChange={e => handleProfileChange('number', e.target.value)} placeholder="Number" />
                  </div>
                ) : (
                  <>
                    <div className="pd-profile-name-row">
                      <span className="pd-profile-name">{player.name}</span>
                      <span className="pd-badge">{player.status}</span>
                    </div>
                    <div className="pd-profile-meta">
                      <Shield size={14} /> {player.team}
                      <span className="pd-dot">•</span>
                      <User size={14} /> {player.position}
                      <span className="pd-dot">•</span>
                      #{player.number}
                    </div>
                  </>
                )}
              </div>

             
              <div className="pd-profile-actions">
                <button className="pd-btn pd-btn-outline" onClick={handleDownloadPDF}>
                  <FileDown size={16} /> Download Report
                </button>
                <button
                     className="pd-btn pd-btn-primary"
                     onClick={handleSaveProfile}
       >
                     {isEditing ? <><Check size={16} /> Save</> : <><Pencil size={16} /> Edit</>}
                </button>

              </div>

            </div>
          </div>
        </div>

       
        <div className="pd-grid-2">

          <div className="pd-card">
            <div className="pd-card-header">
              <Brain size={18} /> Daily Readiness Score
            </div>
            <div className="pd-card-body">
              <div className="pd-readiness-center">
                <div className="pd-circle">
                  <span className="pd-circle-value">{readiness !== null ? readiness : "--"}</span>
                  <span className="pd-circle-pct">%</span>
                </div>
              </div>
              <div className="pd-progress-bar">
                <div className="pd-progress-fill" style={{ width: `${readiness || 0}%` }} />
              </div>
            </div>
          </div>

          <div className="pd-card">
            <div className="pd-card-header">
              <MessageSquare size={18} /> Trainer Feedback
            </div>
            <div className="pd-feedback-scroll">
              {trainerMessages.length > 0 ? (
                trainerMessages.map((msg) => (
                  <div key={msg.time} className="pd-feedback-msg">
                    <div className="pd-feedback-msg-header">
                      <span className="pd-feedback-msg-sender">{msg.sender}</span>
                      <span className="pd-feedback-msg-time">{msg.time}</span>
                    </div>
                    <p className="pd-feedback-msg-text">{msg.text}</p>
                  </div>
                ))
              ) : (
                <div className="pd-feedback-empty">No feedback from trainer yet.</div>
              )}
            </div>
          </div>

        </div>

       
        <div className="pd-grid-4">
          {metrics.map((m, i) => (
            <div key={i} className="pd-metric-card">
              <div className={`pd-metric-icon ${m.iconClass}`}>
                {m.icon}
              </div>
              <div>
                <div className="pd-metric-label">{m.label}</div>
                <div className="pd-metric-value">{m.value}</div>
              </div>
            </div>
          ))}
        </div>

    
        <div className="pd-card">
          <div className="pd-card-header">
            <Lightbulb size={18} /> Post-Training Input
          </div>
          <div className="pd-card-body">
            <div className="pd-grid-form">
              <div className="pd-form-group">
                <label className="pd-label">RPE (1-10)</label>
                <input
                  className="pd-input"
                  placeholder="Rate of Perceived Exertion"
                  value={form.rpe}
                  onChange={e => handleInputChange('rpe', e.target.value)}
                  type="number" min="0" max="10"
                />
              </div>
              <div className="pd-form-group">
                <label className="pd-label">Sleep (0-24 hours)</label>
                <input
                  className="pd-input"
                  placeholder="Hours of sleep"
                  value={form.sleep}
                  onChange={e => handleInputChange('sleep', e.target.value)}
                  type="number" min="0" max="24"
                />
              </div>
              <div className="pd-form-group">
                <label className="pd-label">Soreness (1-10)</label>
                <input
                  className="pd-input"
                  placeholder="Muscle soreness level"
                  value={form.soreness}
                  onChange={e => handleInputChange('soreness', e.target.value)}
                  type="number" min="0" max="10"
                />
              </div>
              <div className="pd-form-group">
                <label className="pd-label">Tiredness (1-10)</label>
                <input
                  className="pd-input"
                  placeholder="Mental/physical tiredness"
                  value={form.tiredness}
                  onChange={e => handleInputChange('tiredness', e.target.value)}
                  type="number" min="0" max="10"
                />
              </div>
            </div>
            <button className="pd-btn pd-btn-primary pd-btn-full" onClick={handleSubmit}>
              <Check size={16} /> Submit Training Data
            </button>
          </div>
        </div>

 <div id="training-history-section">
        {submissions.length > 0 && (
  <div className="pd-card">
    <div className="pd-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <Clock size={18} /> Training History
      </div>
      <button
        className="pd-btn pd-btn-outline"
        onClick={() => setShowHistory(prev => !prev)}
      >
        {showHistory ? "Hide" : "Show"}
      </button>
    </div>

    {showHistory && (
      <div style={{ overflowX: 'auto' }}>
        <table className="pd-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>RPE</th>
              <th>Tiredness</th>
              <th>Sleep</th>
              <th>Soreness</th>
              <th>Readiness</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((entry, idx) => (
              <tr key={idx}>
                <td>{entry.date}</td>
                <td>{entry.rpe}</td>
                <td>{entry.tiredness}</td>
                <td>{entry.sleep}</td>
                <td>{entry.soreness}</td>
                <td className="pd-td-bold">{entry.readiness}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

  </div>
)}
</div>

       
        <div className="pd-accordion">
          <button
            className="pd-accordion-trigger"
            onClick={() => setAccordionOpen(!accordionOpen)}
          >
            <span className="pd-accordion-trigger-left">
              <Info size={18} /> Metric Descriptions
            </span>
            <ChevronDown className={`pd-accordion-chevron ${accordionOpen ? 'open' : ''}`} />
          </button>
          <div className={`pd-accordion-content ${accordionOpen ? 'open' : ''}`}>
            <ul>
              <li><strong>RPE:</strong> Rate of Perceived Exertion from 1 (very light) to 10 (maximum effort).</li>
              <li><strong>Sleep:</strong> Hours rested (0-24 hours).</li>
              <li><strong>Soreness:</strong> Muscle soreness level from 1 (no soreness) to 10 (extremely sore).</li>
              <li><strong>Tiredness:</strong> Physical/Mental fatigue from 1 (fully energized) to 10 (completely exhausted).</li>
              <p><strong>Injury Risk:</strong> If Injury Risk less than 0.25 - Low risk of injury ||
              If Injury Risk less than 0.50 - Moderate risk of injury ||
              If Injury Risk less than 0.75 - High risk of injury ||
              If Injury Risk less than 0.75 - very High risk of injury 
              </p>
            
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}*/


















import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import './PlayerDashboard.css';
import {
  Activity, Brain, AlertTriangle, Moon,
  Zap, Lightbulb, User, Shield, Pencil, Check, Camera,
  FileDown, MessageSquare, Info, Clock, ChevronDown
} from "lucide-react";

export default function PlayerDashboard() {
  const [readiness, setReadiness] = useState(null);
  const [injuryRisk, setInjuryRisk] = useState("No data");   // <-- ADD THIS
  const [skillGap, setSkillGap] = useState("No data"); 
  const [rpe, setRpe] = useState("No data");
  const [sleep, setSleep] = useState("No data");
  const [soreness, setSoreness] = useState("No data");
  const [tiredness, setTiredness] = useState("No data");  // <-- ADD THIS
  const [isEditing, setIsEditing] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [player, setPlayer] = useState(null);
  const [trainerMessages, setTrainerMessages] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [form, setForm] = useState({
    rpe: "",
    sleep: "",
    soreness: "",
    tiredness: ""
  });

  useEffect(() => {
  const fetchGoogleFit = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) return;
    const res = await fetch(
      "http://localhost:5000/api/googlefit/data?email=" +
        encodeURIComponent(user.email)
    );
    const data = await res.json();

    if (!data.connected) return;

    const hasSleep =
      typeof data.sleepHours === "number" && data.sleepHours > 0;
    const hasTiredness =
      typeof data.estimatedTiredness === "number" &&
      data.estimatedTiredness >= 1;
    const hasRpe =
      typeof data.estimatedRpe === "number" && data.estimatedRpe >= 1;

    if (hasSleep || hasTiredness || hasRpe) {
      setForm((prev) => ({
        ...prev,
        ...(hasSleep ? { sleep: String(data.sleepHours) } : {}),
        ...(hasTiredness
          ? { tiredness: String(data.estimatedTiredness) }
          : {}),
        ...(hasRpe ? { rpe: String(data.estimatedRpe) } : {}),
        soreness: ""
      }));
      if (hasSleep) {
        setSleep(`${data.sleepHours}h`);
      }
    }

  } catch (err) {
    console.error(err);
  }
};

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      // 1️⃣ Fetch player profile
      const profileRes = await fetch(`http://localhost:5000/api/playerdashboard/${user.email}`);
      const data = await profileRes.json();

      setPlayer({
        name: data.name,
        position: data.position,
        team: data.current_team,
        number: data.player_id,
        status: "Active",
        image: data.profile_image || ""
      });

      setReadiness(data.readiness ?? 0);
      setInjuryRisk(data.injury_risk ?? "No data");
      setSkillGap(data.skill_gap ?? "No data");
      setRpe(data.rpe ?? "No data");
      const sleepVal = data.sleep_hour;
      setSleep(
        sleepVal != null && sleepVal !== ""
          ? `${sleepVal}h`
          : "No data"
      );
      setSoreness(data.soreness ?? "No data");
      setTiredness(data.tiredness ?? "No data");

      if (sleepVal != null && sleepVal !== "") {
        setForm((prev) => ({
          ...prev,
          sleep: String(sleepVal),
        }));
      }

      // 2️⃣ Fetch trainer messages
      const messagesRes = await fetch(`http://localhost:5000/api/player/messages/${data.player_id}`);
      const messages = await messagesRes.json();
      const formattedMessages = messages.map(msg => ({
        sender: "Trainer",
        text: msg.message,
        time: new Date(msg.created_at).toLocaleString()
      }));
      setTrainerMessages(formattedMessages);

      // 3️⃣ Fetch training submissions (this is what shows Training History)
      const submissionsRes = await fetch(`http://localhost:5000/api/playerdashboard/history/${data.id}`);
      const submissionsData = await submissionsRes.json();
      const formattedSubmissions = submissionsData.map(sub => ({
        date: new Date(sub.created_at).toLocaleDateString(),
        rpe: sub.rpe,
        tiredness: sub.tiredness,
        sleep: sub.sleep,
        soreness: sub.soreness,
        readiness: sub.readiness
      }));
      setSubmissions(formattedSubmissions);

    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  (async () => {
    await fetchData();
    await fetchGoogleFit();
  })();
}, []);


  
  //const [trainerMessages, setTrainerMessages] = useState([]);

  const handleProfileChange = (field, value) => {
    setPlayer(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPlayer(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleInputChange = (field, value) => {
    const maxValue = field === 'sleep' ? 24 : 10;
    const numValue = parseFloat(value);
    if (value === "" || (numValue >= 0 && numValue <= maxValue)) {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
  const isFormComplete =
    form.rpe !== "" && form.sleep !== "" && form.tiredness !== "";
  if (!isFormComplete) {
    toast.error("Fill RPE, sleep, and tiredness (soreness optional)");
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch(
      "http://localhost:5000/api/training-submissions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          rpe: Number(form.rpe),
          sleep: Number(form.sleep),
          soreness: form.soreness === "" ? 0 : Number(form.soreness),
          tiredness: Number(form.tiredness)
        })
      }
    );

    if (res.ok) {
      toast.success("Submitted successfully ✅");
      setForm({ email: user.email, rpe: "", sleep: "", soreness: "", tiredness: "" });
    } else {
      toast.error("Submission failed ❌");
    }

  } catch (err) {
    console.error(err);
    toast.error("Server error");
  }
};


  const handleDownloadPDF = () => {
  const printContents = document.getElementById("training-history-section").innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;

  window.location.reload(); // reload to restore React state
};



  const handleSaveProfile = async () => {
  if (!isEditing) {
    setIsEditing(true);
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user"));

    await fetch(`http://localhost:5000/api/playerdashboard/${user.email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: player.name,
        position: player.position,
        current_team: player.team,
        player_id: player.number,
        profile_image: player.image
      })
    });

    toast.success("Profile updated successfully ✅");
    setIsEditing(false);

  } catch (err) {
    console.error("Update failed:", err);
    toast.error("Update failed ❌");
  }
};



  // 🔒 Prevent crash before player loads
if (!player) {
  return <div className="pd-root">Loading...</div>;
}


  const initials = player.name.split(' ').map(n => n[0]).join('');

  const metrics = [
    {
      label: "RPE",
      value: rpe,
      icon: <Activity />,
      iconClass: "pd-metric-icon-blue"
    },
    {
      label: "Tiredness",
      value: tiredness,
      icon: <Zap />,
      iconClass: "pd-metric-icon-amber"
    },
    {
      label: "Injury Risk",
      value: injuryRisk,
      icon: <AlertTriangle />,
      iconClass: "pd-metric-icon-red"
    },
    {
      label: "Sleep",
      value: sleep,
      icon: <Moon />,
      iconClass: "pd-metric-icon-indigo"
    },
    {
      label: "Skill Gap",
      value: skillGap,
      icon: <Lightbulb />, // you can choose any icon you want
      iconClass: "pd-metric-icon-green"
    },
    {
       label: "Muscle Soreness",         // <-- ADD THIS
       value: soreness,  // <-- use the soreness from submissions
       icon: <Zap />,                    // <-- choose an icon, I reused Zap
       iconClass: "pd-metric-icon-pink"  // <-- choose a color class
    }
  ];

  return (
    <div className="pd-root">
      <div className="pd-container">

       
        <div className="pd-card">
          <div className="pd-card-body">
            <div className="pd-profile">

           
              <div className="pd-avatar">
                {player.image
                  ? <img src={player.image} alt={player.name} />
                  : initials
                }
                {isEditing && (
                  <label className="pd-avatar-upload">
                    <Camera />
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

            
              <div className="pd-profile-info">
                {isEditing ? (
                  <div className="pd-edit-grid">
                    <input className="pd-input" value={player.name} onChange={e => handleProfileChange('name', e.target.value)} placeholder="Name" />
                    <input className="pd-input" value={player.position} onChange={e => handleProfileChange('position', e.target.value)} placeholder="Position" />
                    <input className="pd-input" value={player.team} onChange={e => handleProfileChange('team', e.target.value)} placeholder="Team" />
                    <input className="pd-input" value={player.number} onChange={e => handleProfileChange('number', e.target.value)} placeholder="Number" />
                  </div>
                ) : (
                  <>
                    <div className="pd-profile-name-row">
                      <span className="pd-profile-name">{player.name}</span>
                      <span className="pd-badge">{player.status}</span>
                    </div>
                    <div className="pd-profile-meta">
                      <Shield size={14} /> {player.team}
                      <span className="pd-dot">•</span>
                      <User size={14} /> {player.position}
                      <span className="pd-dot">•</span>
                      #{player.number}
                    </div>
                  </>
                )}
              </div>

             
              <div className="pd-profile-actions">
                <button className="pd-btn pd-btn-outline" onClick={handleDownloadPDF}>
                  <FileDown size={16} /> Download Report
                </button>
                <button
                     className="pd-btn pd-btn-primary"
                     onClick={handleSaveProfile}
       >
                     {isEditing ? <><Check size={16} /> Save</> : <><Pencil size={16} /> Edit</>}
                </button>

              </div>

            </div>
          </div>
        </div>

       
        <div className="pd-grid-2">

          <div className="pd-card">
            <div className="pd-card-header">
              <Brain size={18} /> Daily Readiness Score
            </div>
            <div className="pd-card-body">
              <div className="pd-readiness-center">
                <div className="pd-circle">
                  <span className="pd-circle-value">{readiness !== null ? readiness : "--"}</span>
                  <span className="pd-circle-pct">%</span>
                </div>
              </div>
              <div className="pd-progress-bar">
                <div className="pd-progress-fill" style={{ width: `${readiness || 0}%` }} />
              </div>
            </div>
          </div>

          <div className="pd-card">
            <div className="pd-card-header">
              <MessageSquare size={18} /> Trainer Feedback
            </div>
            <div className="pd-feedback-scroll">
              {trainerMessages.length > 0 ? (
                trainerMessages.map((msg) => (
                  <div key={msg.time} className="pd-feedback-msg">
                    <div className="pd-feedback-msg-header">
                      <span className="pd-feedback-msg-sender">{msg.sender}</span>
                      <span className="pd-feedback-msg-time">{msg.time}</span>
                    </div>
                    <p className="pd-feedback-msg-text">{msg.text}</p>
                  </div>
                ))
              ) : (
                <div className="pd-feedback-empty">No feedback from trainer yet.</div>
              )}
            </div>
          </div>

        </div>

       
        <div className="pd-grid-4">
          {metrics.map((m, i) => (
            <div key={i} className="pd-metric-card">
              <div className={`pd-metric-icon ${m.iconClass}`}>
                {m.icon}
              </div>
              <div>
                <div className="pd-metric-label">{m.label}</div>
                <div className="pd-metric-value">{m.value}</div>
              </div>
            </div>
          ))}
        </div>

    
        <div className="pd-card">
          <div className="pd-card-header">
            <Lightbulb size={18} /> Post-Training Input
          </div>
          <div className="pd-card-body">
            <div className="pd-grid-form">
              <div className="pd-form-group">
                <label className="pd-label">RPE (1-10)</label>
                <input
                  className="pd-input"
                  placeholder="Rate of Perceived Exertion"
                  value={form.rpe}
                  onChange={e => handleInputChange('rpe', e.target.value)}
                  type="number" min="0" max="10"
                />
              </div>
              <div className="pd-form-group">
                <label className="pd-label">Sleep (0-24 hours)</label>
                <input
                  className="pd-input"
                  placeholder="Hours of sleep"
                  value={form.sleep}
                  onChange={e => handleInputChange('sleep', e.target.value)}
                  type="number" min="0" max="24"
                />
              </div>
              <div className="pd-form-group">
                <label className="pd-label">Soreness (1-10)</label>
                <input
                  className="pd-input"
                  placeholder="Muscle soreness level"
                  value={form.soreness}
                  onChange={e => handleInputChange('soreness', e.target.value)}
                  type="number" min="0" max="10"
                />
              </div>
              <div className="pd-form-group">
                <label className="pd-label">Tiredness (1-10)</label>
                <input
                  className="pd-input"
                  placeholder="Mental/physical tiredness"
                  value={form.tiredness}
                  onChange={e => handleInputChange('tiredness', e.target.value)}
                  type="number" min="0" max="10"
                />
              </div>
            </div>
            <button className="pd-btn pd-btn-primary pd-btn-full" onClick={handleSubmit}>
              <Check size={16} /> Submit Training Data
            </button>


          <button
            onClick={() => {
              const user = JSON.parse(localStorage.getItem("user"));
              if (!user?.email) {
                toast.error("Please login first to connect Google Fit.");
                return;
              }
              window.location.href =
                "http://localhost:5000/auth/google?email=" +
                encodeURIComponent(user.email);
            }}
          >
            Connect Google Fit
          </button>


          </div>
        </div>

 <div id="training-history-section">
        {submissions.length > 0 && (
  <div className="pd-card">
    <div className="pd-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <Clock size={18} /> Training History
      </div>
      <button
        className="pd-btn pd-btn-outline"
        onClick={() => setShowHistory(prev => !prev)}
      >
        {showHistory ? "Hide" : "Show"}
      </button>
    </div>

    {showHistory && (
      <div style={{ overflowX: 'auto' }}>
        <table className="pd-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>RPE</th>
              <th>Tiredness</th>
              <th>Sleep</th>
              <th>Soreness</th>
              <th>Readiness</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((entry, idx) => (
              <tr key={idx}>
                <td>{entry.date}</td>
                <td>{entry.rpe}</td>
                <td>{entry.tiredness}</td>
                <td>{entry.sleep}</td>
                <td>{entry.soreness}</td>
                <td className="pd-td-bold">{entry.readiness}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

  </div>
)}
</div>

       
        <div className="pd-accordion">
          <button
            className="pd-accordion-trigger"
            onClick={() => setAccordionOpen(!accordionOpen)}
          >
            <span className="pd-accordion-trigger-left">
              <Info size={18} /> Metric Descriptions
            </span>
            <ChevronDown className={`pd-accordion-chevron ${accordionOpen ? 'open' : ''}`} />
          </button>
          <div className={`pd-accordion-content ${accordionOpen ? 'open' : ''}`}>
            <ul>
              <li><strong>RPE:</strong> Rate of Perceived Exertion from 1 (very light) to 10 (maximum effort).</li>
              <li><strong>Sleep:</strong> Hours rested (0-24 hours).</li>
              <li><strong>Soreness:</strong> Muscle soreness level from 1 (no soreness) to 10 (extremely sore).</li>
              <li><strong>Tiredness:</strong> Physical/Mental fatigue from 1 (fully energized) to 10 (completely exhausted).</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}







































