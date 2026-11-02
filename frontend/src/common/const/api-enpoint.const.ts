
const CATEGORIES = '/api/categories';
const AUTH = '/api/auth';
const BUDGET = '/api/budgets';
const USERS = '/api/users'; 
const RECURRING_PAYMENTS = '/api/recurring-payments';
export const API_ENDPOINTS = {
    LOGIN: `${AUTH}/login`,
    REGISTERATION: `${AUTH}/registration`,
    CHANGE_PASSWORD: `${AUTH}/change-password`,
    GET_CATEGORIES_WITHOUT_PAGINATION:`${CATEGORIES}/pagination/disabled`,
    MANAGE_CATEGORIES: CATEGORIES,
    MANAGE_ADMIN_CATEGORIES: `${CATEGORIES}/admin`,
    MANAGE_BUDGETS: BUDGET,
    MANAGE_ADMIN_USERS: `${USERS}/admin`,
    MANAGE_RECURRING_PAYMENTS: RECURRING_PAYMENTS
}