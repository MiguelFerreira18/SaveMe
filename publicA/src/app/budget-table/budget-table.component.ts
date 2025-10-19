import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

interface BudgetData {
  category: string;
  ideal: string;
  goal: string;
  actual: string;
  spent: number;
}

@Component({
  selector: 'app-budget-table',
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './budget-table.component.html',
  styleUrl: './budget-table.component.css',
})
export class BudgetTableComponent {
  displayedColumns: string[] = ['category', 'ideal', 'goal', 'actual', 'spent'];

  data: BudgetData[] = [
    { category: 'FUNDAMENTALS', ideal: '$1,400.00', goal: '50%', actual: '59%', spent: 1640 },
    { category: 'FUTURE YOU', ideal: '$560.00', goal: '20%', actual: '11%', spent: 320 },
    { category: 'FUN', ideal: '$840.00', goal: '30%', actual: '30%', spent: 840 },
  ];
}
