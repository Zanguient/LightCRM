import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Subscription} from "rxjs";
import {Chart} from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('revenue') revenueRef: ElementRef;
  @ViewChild('orders') ordersRef: ElementRef;

  aSub: Subscription;
  average: number;
  pending = true;

  constructor(private service: AnalyticsService) { }

  ngAfterViewInit(): void {

    const revenueConfig: any = {
      label: 'Revenue',
      color: 'rgb(255, 99, 132)'
    };

    const ordersConfig: any = {
      label: 'Orders',
      color: 'rgb(54, 162, 235)'
    };

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage)  => {
      this.average = data.average;

      revenueConfig.labels = data.chart.map(item => item.label);
      revenueConfig.data = data.chart.map(item => item.revenue);
      revenueConfig.yAxes = {};
      revenueConfig.xAxes = {};

      ordersConfig.labels = data.chart.map(item => item.label);
      ordersConfig.data = data.chart.map(item => item.order);
      ordersConfig.yAxes =
        [{
            ticks: {
              min: 0,
              stepSize: 1
            },
            scaleLabel: {
              display: true
            }
          }];
      ordersConfig.xAxes = {};

      // *** temp ***
      revenueConfig.labels.push('2018.07.23');
      revenueConfig.labels.push('2018.07.24');
      revenueConfig.labels.push('2018.07.25');
      revenueConfig.labels.push('2018.07.26');
      revenueConfig.labels.push('2018.07.27');
      revenueConfig.labels.push('2018.07.28');

      revenueConfig.data.push(1500);
      revenueConfig.data.push(1700);
      revenueConfig.data.push(1400);
      revenueConfig.data.push(12000);
      revenueConfig.data.push(3000);
      revenueConfig.data.push(2000);

      ordersConfig.labels.push('2018.07.23');
      ordersConfig.labels.push('2018.07.24');
      ordersConfig.labels.push('2018.07.25');
      ordersConfig.labels.push('2018.07.26');
      ordersConfig.labels.push('2018.07.27');
      ordersConfig.labels.push('2018.07.28');

      ordersConfig.data.push(3);
      ordersConfig.data.push(3);
      ordersConfig.data.push(2);
      ordersConfig.data.push(6);
      ordersConfig.data.push(3);
      ordersConfig.data.push(2);
      // *** temp ***

      const revenueCtx = this.revenueRef.nativeElement.getContext('2d');
      revenueCtx.canvas.height = '300px';

      const ordersCtx = this.ordersRef.nativeElement.getContext('2d');
      ordersCtx.canvas.height = '300px';

      new Chart(revenueCtx, createChartConfig(revenueConfig));
      new Chart(ordersCtx, createChartConfig(ordersConfig));

      this.pending = false;
    });
  }

  ngOnDestroy(): void {
    if (this.aSub)
      this.aSub.unsubscribe();
  }



}


function createChartConfig({labels, data, label, color, yAxes, xAxes}) {
  return {
    type: 'line',
    options: {
      responsive: true,
      scales: {
        yAxes,
        xAxes
      }
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
