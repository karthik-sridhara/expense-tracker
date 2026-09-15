
const CATEGORIES = '/api/categories';
const AUTH = '/api/auth';

export const API_ENDPOINTS = {
    LOGIN: `${AUTH}/login`,
    REGISTERATION: `${AUTH}/registration`,
    GET_CATEGORIES: CATEGORIES,
    GET_ADMIN_CATEGORIES: `${CATEGORIES}/admin`
}