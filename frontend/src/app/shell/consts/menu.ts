import { SideMenu } from "../../../common/interface/app/side-menu";

export const MENUS:SideMenu[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      route: '',
      icon: '/icons/dashboard_fill.svg'
    },
    {
      id: 'transaction',
      name: 'Transaction',
      route: '/transactions',
      icon: '/icons/receipt_fill.svg'
    },
    {
      id: 'category',
      name: 'Category',
      route: '/categories',
      icon: '/icons/category_fill.svg'
    },
    {
      id: 'budget',
      name: 'Budget',
      route: '/budgets',
      icon: '/icons/account_balance_wallet_fill.svg'
    },
    {
      id: 'payment',
      name: 'Payment',
      route: '/payments',
      icon: '/icons/pending_actions.svg'
    },
    {
      id: 'settings',
      name: 'Setting',
      route: '/settings',
      icon: '/icons/settings_fill.svg'
    }
];

export const MENUS_BY_ROLE: Record<string, Set<string>> = {
    'ADMIN': new Set(['category', 'budget', 'settings']),
    'USER': new Set(['dashboard', 'transaction', 'category', 'budget', 'settings', 'payment']),
    'EMPLOYEE': new Set(['dashboard', 'transaction', 'category', 'budget', 'settings', 'payment'])
};