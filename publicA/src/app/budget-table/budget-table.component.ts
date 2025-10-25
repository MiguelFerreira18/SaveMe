import { CommonModule } from '@angular/common';
import { Component, computed, effect, Input, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

interface BudgetData {
  category: string;
  ideal: number;
  goal: number;
  actual: number;
  spent: number;
}
interface FooterData {
  category: string;
  spent: number;
}

@Component({
  selector: 'app-budget-table',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatInputModule, FormsModule],
  templateUrl: './budget-table.component.html',
  styleUrl: './budget-table.component.css',
})
export class BudgetTableComponent implements OnInit {
  @Input({ required: true }) totalIncome!: Signal<number>;
  @Input({ required: true }) totalWish!: Signal<number>;
  @Input({ required: true }) totalExpense!: Signal<number>;
  @Input({ required: true }) totalInvestment!: Signal<number>;

  totalSpent = computed(() => {
    return this.totalExpense() + this.totalWish() + this.totalInvestment();
  });

  displayedColumns: string[] = ['category', 'ideal', 'goal', 'actual', 'spent'];
  emptyColumns: string[] = ['category', 'spent'];

  data: BudgetData[] = [];
  footerData: FooterData[] = [];

  constructor() {
    effect(() => {
      this.updateTableData();
    });
  }
  ngOnInit(): void {
    this.updateTableData();
  }

  private updateTableData() {
    this.data = [
      {
        category: 'FUNDAMENTALS',
        ideal: 0,
        goal: 50,
        actual: Number((this.totalExpense() / this.totalIncome()) * 100),
        spent: this.totalExpense(),
      },
      {
        category: 'FUTURE YOU',
        ideal: 0,
        goal: 20,
        actual: Number((20 / this.totalInvestment()) * 100),
        spent: this.totalInvestment(),
      },
      {
        category: 'FUN',
        ideal: 0,
        goal: 30,
        actual: Number((this.totalWish() / this.totalIncome()) * 100),
        spent: this.totalWish(),
      },
    ];
    const difference = Math.abs(this.totalIncome() - this.totalSpent());
    const isEqual = difference < 0.01;
    this.footerData = [
      {
        category: isEqual
          ? "Great, you've allocated all of your income for the month"
          : this.totalSpent() > this.totalIncome()
            ? "Woops, you've allocated MORE than your income by"
            : "You haven't allocated all of your income, the amount left is:",
        spent: this.totalIncome() - this.totalSpent(),
      },
    ];
  }
}
``;
