import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Currency } from '../../shared/models/currency.model';
import { CurrenciesService } from '../../currencies.service';

@Component({
  selector: 'app-add-wish-dialog',
  imports: [
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-wish-dialog.component.html',
  styleUrl: './add-wish-dialog.component.css',
  providers: [provideNativeDateAdapter()],
})
export class AddWishDialogComponent implements OnInit {
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
  wish = new FormGroup({
    currencyId: new FormControl(-1),
    amount: new FormControl(0),
    description: new FormControl(''),
    date: new FormControl(''),
  });

  constructor(
    private dialogRef: MatDialogRef<AddWishDialogComponent>,
    private currencyService: CurrenciesService
  ) {}

  ngOnInit(): void {
    this.loadCurrencies();
  }

  submit() {
    const wishValue = { ...this.wish.value };

    if (wishValue.date) {
      const date = new Date(wishValue.date);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      wishValue.date = `${year}-${month}-${day}`;
    }
    this.dialogRef.close(wishValue);
  }

  private loadCurrencies() {
    this.currencyService.getCurrencies().subscribe({
      next: (currencies) => {
        this.currencies.set(currencies);
      },
      error: (err) => console.log(err), //TODO: ADD a LOADING SPINNER
    });
  }
}
