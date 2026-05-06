const url = "http://localhost:8888";

export default {
    login: `${url}/api/login`,
    register: `${url}/api/register`,
    auth: `${url}/api/users/me`,
    websocket: `http://localhost:3000/ws`
} as const;