import axios from "axios";
const API = "http://localhost:5000/api/trainer";

export const getTeam = (id)=>axios.get(`${API}/team/${id}`);
export const getPlayer = (id)=>axios.get(`${API}/player/${id}`);
export const schedule = (data)=>axios.post(`${API}/schedule`,data);
export const getSchedule = (id)=>axios.get(`${API}/schedule/${id}`);