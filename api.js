export const API_BASE_URL = "https://exostotic-lineolate-shantel.ngrok-free.dev";

export const ENDPOINTS = {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    PROFILE: `${API_BASE_URL}/profile`,
    UPLOAD_PROFILE_PHOTO: `${API_BASE_URL}/profile/photo`,
    GET_ORDERS: `${API_BASE_URL}/api/orders/all`,
    GET_ORDER_BY_ID: `${API_BASE_URL}/api/orders/`,
    GET_SHOPS: `${API_BASE_URL}/api/shops`,
    GET_USERS: `${API_BASE_URL}/api/users`,
    GET_PRODUCTS: `${API_BASE_URL}/api/products`,
    GET_SETTLEMENTS: `${API_BASE_URL}/api/settlements`,
};
