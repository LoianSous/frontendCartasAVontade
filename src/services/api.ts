import axios from "axios";

export const api = axios.create({
    baseURL: "http://10.34.143.137:8080",
    timeout: 5000,
});