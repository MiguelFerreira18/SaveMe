import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

export interface TableColumn<T> {
  header: string;
  field: keyof T & string;
}

@Component({
  selector: 'app-data-table',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent<T> implements AfterViewInit, OnChanges {
  @Input() columns!: TableColumn<T>[];
  @Input() data!: T[];
  datasource = new MatTableDataSource<T>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.datasource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.datasource.data = this.data;
    }
  }

  get displayedColumns(): string[] {
    return this.columns.map((c) => c.field as string);
  }
}
