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
  @Input() minRows: number = 10;
  @Input() pageSizeOption?: number[];
  datasource = new MatTableDataSource<T>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly defaultPageSizeOption: number[] = [5, 10, 20, 50];

  ngAfterViewInit(): void {
    this.datasource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.datasource.data = this.getDataWithEmptyRows();
    }

    if (changes['minRows']) {
      this.datasource.data = this.getDataWithEmptyRows();
    }
  }

  private getDataWithEmptyRows(): T[] {
    if (!this.data) return [];

    const dataLength = this.data.length;
    const emptyRowsNeeded = Math.max(0, this.minRows - dataLength);

    const emptyRows: T[] = Array(emptyRowsNeeded)
      .fill(null)
      .map(() => {
        const emptyObj: any = {};
        this.columns.forEach((col) => {
          emptyObj[col.field] = ''; // Empty string for display
        });
        return emptyObj as T;
      });

    return [...this.data, ...emptyRows];
  }

  get displayedColumns(): string[] {
    return this.columns.map((c) => c.field as string);
  }
  get paginatorPageSizeOption(): number[] {
    return this.pageSizeOption || this.defaultPageSizeOption;
  }
}
