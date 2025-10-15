import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Subject } from 'rxjs';
import { Income } from '../shared/models/income.model';
import { Wish } from '../shared/models/wish.model';
import { Expense } from '../shared/models/expense.model';
import { DataTableComponent } from '../shared/data-table/data-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ErrorDisplayComponent } from '../shared/error-display/error-display.component';
import { MatIcon } from '@angular/material/icon';
import {
  DashboardDynamicTableComponent,
  TableColumn,
} from '../dashboard-dynamic-table/dashboard-dynamic-table.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    DataTableComponent,
    MatIcon,
    MatButtonModule,
    MatProgressSpinner,
    ErrorDisplayComponent,
    DashboardDynamicTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  expenseColumns: TableColumn[] = [
    { key: 'category', header: 'Category', align: 'left' },
    { key: 'amount', header: 'Amount', align: 'right' },
  ];
  incomeColumns: TableColumn[] = [
    { key: 'description', header: 'Description', align: 'left' },
    { key: 'amount', header: 'Amount', align: 'right' },
  ];
  wishColumns: TableColumn[] = [
    { key: 'description', header: 'Description', align: 'left' },
    { key: 'amount', header: 'Amount', align: 'right' },
  ];

  constructor(private dasboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadExpenses();
    this.loadIncome();
    this.loadWishes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private readonly allIncomes = signal<Income[]>([]);
  private readonly allWishes = signal<Wish[]>([]);
  private readonly allExpenses = signal<Expense[]>([]);

  incomes = signal<Income[]>([]);
  wishes = signal<Wish[]>([]);
  expenses = signal<Expense[]>([]);

  private loadExpenses() {
    this.dasboardService.reducedExpenses().subscribe({
      next: (expenses) => {
        this.allExpenses.set(expenses); //TODO: LOAD TABLE INSTEAD OF PRINTING DATA
        this.expenses.set(expenses);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  private loadIncome() {
    this.dasboardService.getIncomes().subscribe({
      next: (incomes) => {
        this.allIncomes.set(incomes);
        this.incomes.set(incomes);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private loadWishes() {
    this.dasboardService.getWishes().subscribe({
      next: (wishes) => {
        this.allWishes.set(wishes);
        this.wishes.set(wishes);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
