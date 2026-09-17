
const CATEGORIES = '/api/categories';
const AUTH = '/api/auth';

export const API_ENDPOINTS = {
    LOGIN: `${AUTH}/login`,
    REGISTERATION: `${AUTH}/registration`,
    MANAGE_CATEGORIES: CATEGORIES,
    MANAGE_ADMIN_CATEGORIES: `${CATEGORIES}/admin`
}