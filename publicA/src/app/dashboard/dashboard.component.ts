import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Subject } from 'rxjs';
import { err } from '../shared/Monads';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private dasboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadExpenses() {
    this.dasboardService.reducedExpenses().subscribe({
      next: (expenses) => {
        console.log(expenses); //TODO: LOAD TABLE INSTEAD OF PRINTING DATA
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
