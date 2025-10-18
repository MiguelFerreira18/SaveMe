import { Component, EventEmitter, Input, model, output, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Currency } from '../models/currency.model';

@Component({
  selector: 'app-generic-dropdown-filter',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './generic-dropdown-filter.component.html',
  styleUrl: './generic-dropdown-filter.component.css',
})
export class GenericDropdownFilterComponent<T> {
  @Input({ required: true }) data: T[] = [];
  @Input({ required: true }) displayFn!: (item: T) => string;

  selected = model<T>();
  valueChange = output<T>();
}
