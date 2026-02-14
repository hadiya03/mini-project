import React,{useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import {getPlayer} from "../services/trainerService";

const PlayerProfile=()=>{
const {id}=useParams();
const [player,setPlayer]=useState({});

useEffect(()=>{
getPlayer(id).then(res=>setPlayer(res.data));
},[]);

return(
<div className="dashboard">
<h1>Player Profile</h1>
<div className="card">
<h2>{player.name}</h2>
<p>Email: {player.email}</p>
<p>Readiness Score: {parseFloat(player.readiness_score||0).toFixed(2)}</p>
</div>
</div>
);
};

export default PlayerProfile;