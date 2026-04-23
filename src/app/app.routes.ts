import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'backoffice',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/components/main-page/main-page').then((m) => m.MainPage),
      children: [
        {
          path: 'dashboard',
          loadComponent: () =>
            import(
              './pages/components/main-page/main-page-dashboard/main-page-dashboard'
            ).then((m) => m.MainPageDashboard),
        },
        {
          path: 'warehouse',
          loadComponent: () =>
            import(
              './pages/components/main-page/main-page-insert-order/main-page-insert-order'
            ).then((m) => m.MainPageInsertOrder),
        },
        {
          path: 'warehouse-summary',
          loadComponent: () =>
            import(
              './pages/components/main-page/main-page-insert-order-summary/main-page-insert-order-summary'
            ).then((m) => m.MainPageInsertOrderSummary),
        },
        {
          path: 'pickup',
          loadComponent: () =>
            import(
              './pages/components/main-page/main-page-receiver-order/main-page-receiver-order'
            ).then((m) => m.MainPageReceiverOrder),
        },
        {
          path: 'product',
          loadComponent: () =>
            import(
              './pages/components/main-page/main-page-product/main-page-product'
            ).then((m) => m.MainPageProduct),
        },
        {
          path: 'orders/prep',
          loadComponent: () =>
            import(
              './pages/components/main-page/main-page-order-prep/main-page-order-prep'
            ).then((m) => m.MainPageOrderPrep),
        },
      ],
  },
];
