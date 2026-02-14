import React,{useEffect,useState} from "react";
import {getTeam,schedule,getSchedule} from "../services/trainerService";
import {Link} from "react-router-dom";

const Dashboard=()=>{
const trainerId=1;
const [team,setTeam]=useState([]);
const [sessions,setSessions]=useState([]);
const [form,setForm]=useState({trainer_id:1,session_date:"",session_time:"",description:""});

useEffect(()=>{
getTeam(trainerId).then(res=>setTeam(res.data));
getSchedule(trainerId).then(res=>setSessions(res.data));
},[]);

const handleSubmit=()=>{
schedule(form).then(()=>window.location.reload());
};

return(
<div className="dashboard">
<h1>Trainer Dashboard</h1>

<div className="grid">
<div className="card">
<h2>Team Members</h2>
{team.map(p=>(
<div key={p.id} className="player">
<Link to={`/player/${p.id}`}>{p.name}</Link>
</div>
))}
</div>

<div className="card">
<h2>Schedule Team Training</h2>
<input type="date" onChange={e=>setForm({...form,session_date:e.target.value})}/>
<input type="time" onChange={e=>setForm({...form,session_time:e.target.value})}/>
<textarea placeholder="Session Plan" onChange={e=>setForm({...form,description:e.target.value})}/>
<button onClick={handleSubmit}>Schedule</button>
</div>

<div className="card">
<h2>Scheduled Sessions</h2>
{sessions.map(s=>(
<div key={s.id} className="session">
{s.session_date} - {s.session_time}
</div>
))}
</div>
</div>
</div>
);
};

export default Dashboard;