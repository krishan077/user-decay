import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-waterfall',
  imports: [],
  templateUrl: './waterfall.html',
  styleUrl: './waterfall.css',
})
export class Waterfall {
  @Input() metricCards: any = signal([]);
  currentPage: number = 1;
  pageSize: number = 10;
  totalScreens: number = 69;
}
