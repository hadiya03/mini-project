import axios from "axios";
import { API_URL } from "../config";
const API = `${API_URL}/api/trainer`;

export const getTeam = (id)=>axios.get(`${API}/team/${id}`);
export const getPlayer = (id)=>axios.get(`${API}/player/${id}`);
export const schedule = (data)=>axios.post(`${API}/schedule`,data);
export const getSchedule = (id)=>axios.get(`${API}/schedule/${id}`);