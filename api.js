export const API_BASE_URL = "https://juristic-zain-unconvened.ngrok-free.dev";

let id;
export const ENDPOINTS = {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    PROFILE: `${API_BASE_URL}/auth/me`,
    GET_ORDERS: `${API_BASE_URL}/api/orders/all`,
    GET_ORDER_BY_ID: `${API_BASE_URL}/api/orders/`,
    GET_SHOPS: `${API_BASE_URL}/api/shops`,
};
