import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthComponent } from './auth/auth/auth.component';
import { MainComponent } from './main/main.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { IncomeComponent } from './income/income.component';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
    title: 'Auth Page',
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'category',
        component: CategoriesComponent,
        title: 'Categories Page',
        canActivate: [AuthGuardService],
      },
      {
        path: 'currency',
        component: CurrenciesComponent,
        title: 'Currency Page',
        canActivate: [AuthGuardService],
      },
      {
        path: 'expense',
        component: ExpensesComponent,
        title: 'Expense Page',
        canActivate: [AuthGuardService],
      },
      {
        path: 'income',
        component: IncomeComponent,
        title: 'Income Page',
        canActivate: [AuthGuardService],
      },
    ],
  },
];
