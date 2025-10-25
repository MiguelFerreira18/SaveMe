import { Component, Input, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

export interface PieChartData {
  labels: string[];
  data: number[];
}

@Component({
  selector: 'app-pie-chart',
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
})
export class PieChartComponent {
  @Input({ required: true }) pieChartData!: PieChartData;

  public pieChartType: ChartType = 'pie';

  get pieChartDataConfig(): ChartData<'pie'> {
    return {
      labels: this.pieChartData.labels,
      datasets: [
        {
          data: this.pieChartData.data,
        },
      ],
    };
  }

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            const data = tooltipItem.chart.data.datasets[tooltipItem.datasetIndex].data as number[];
            const total = data.reduce((acc, value) => acc + value, 0);
            const currentValue = data[tooltipItem.dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(2);
            const label = tooltipItem.chart.data.labels?.[tooltipItem.dataIndex] || '';
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };
}
