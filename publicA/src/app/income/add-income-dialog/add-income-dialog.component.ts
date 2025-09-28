import { Component, signal } from '@angular/core';
import { Currency } from '../../shared/models/currency.model';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CurrenciesService } from '../../currencies.service';

@Component({
  selector: 'app-add-income-dialog',
  imports: [],
  templateUrl: './add-income-dialog.component.html',
  styleUrl: './add-income-dialog.component.css',
})
export class AddIncomeDialogComponent {
  currencies = signal<Currency[]>([]);

  todayOrFuture = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  };

  income = new FormGroup({
    currencyId: new FormControl(-1),
    amount: new FormControl(0),
    description: new FormControl(''),
    date: new FormControl(''),
  });

  constructor(
    private dialogRef: MatDialogRef<AddIncomeDialogComponent>,
    private currencyService: CurrenciesService
  ) {}
}
