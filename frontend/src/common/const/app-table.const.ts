import { themeQuartz } from 'ag-grid-community';

export const appGridTheme = themeQuartz
  .withParams(
    {
      backgroundColor: '#ffffff',
      foregroundColor: '#0f172a', // slate-900
      browserColorScheme: 'light',
      accentColor: '#14b8a6', // primary-500
      borderColor: '#e2e8f0', // slate-200
      headerBackgroundColor: '#f8fafc', // slate-50
      headerTextColor: '#334155', // slate-700
      oddRowBackgroundColor: 'rgba(15, 23, 42, 0.02)',
    },
    'app-light',
  )
  .withParams(
    {
      backgroundColor: '#1e293b', // slate-800
      foregroundColor: '#f1f5f9', // slate-100
      browserColorScheme: 'dark',
      accentColor: '#2dd4bf', // primary-400 (brighter, readable on dark bg)
      borderColor: '#475569', // slate-600
      headerBackgroundColor: '#0f172a', // slate-900
      headerTextColor: '#e2e8f0', // slate-200
      oddRowBackgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    'app-dark',
  );