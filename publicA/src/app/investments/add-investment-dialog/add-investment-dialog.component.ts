import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Currency } from '../../shared/models/currency.model';
import { StrategyType } from '../../shared/models/strategy-type.model';
import { StrategyTypeService } from '../../strategy-type/strategy-type.service';
import { CurrenciesService } from '../../currencies/currencies.service';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-add-investment-dialog',
  imports: [
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-investment-dialog.component.html',
  styleUrl: './add-investment-dialog.component.css',
  providers: [provideNativeDateAdapter()],
})
export class AddInvestmentDialogComponent implements OnInit {
  currencies = signal<Currency[]>([]);
  strategyTypes = signal<StrategyType[]>([]);
  todayOrFuture = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  };

  investment = new FormGroup({
    currencyId: new FormControl(-1),
    strategyTypeId: new FormControl(-1),
    amount: new FormControl(0),
    description: new FormControl(''),
    date: new FormControl(''),
  });

  constructor(
    private dialogRef: MatDialogRef<AddInvestmentDialogComponent>,
    private strategyTypeService: StrategyTypeService,
    private currencyService: CurrenciesService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadCurrencies();
  }

  submit() {
    const investmentValue = { ...this.investment.value };

    if (investmentValue.date) {
      const date = new Date(investmentValue.date);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      investmentValue.date = `${year}-${month}-${day}`;
    }

    this.dialogRef.close(investmentValue);
  }

  private loadCurrencies() {
    this.currencyService.getCurrencies().subscribe({
      next: (currencies) => {
        this.currencies.set(currencies);
      },
      error: (err) => console.log(err), //TODO: ADD A LOADING SPINNER LATER TO REQUEST THIS
    });
  }

  private loadCategories() {
    this.strategyTypeService.getStrategyTypes().subscribe({
      next: (strategyTypes) => {
        this.strategyTypes.set(strategyTypes);
      },
      error: (err) => console.log(err), //TODO: ADD A LOADING SPINNER LATER TO REQUEST THIS
    });
  }
}
