
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  AfterViewInit,
  OnDestroy,
  SimpleChanges,
  signal,
  Output,
  EventEmitter
} from '@angular/core';
import * as Highcharts from 'highcharts';

// Sub-interface for stages that contain an array of questions
export interface QuestionData {
  cns_name?: string;
  name: string;
  isCritical?: boolean;
}

interface StageData {
  cns_id?: number | null;
  cns_type?: string;
  cns_name: string;
  stage: number;
  type: string;
  total_users?: number;
  completed_users?: number;
  discarded_users?: number;
  terminated_users?: number;
  overquota_users?: number;
  error_terminated_users?: number;
  screen?: number;
  dropoff_users: number;
  median: number;
  questions?: QuestionData[]; // <-- Added optional questions array
}

interface ComputedScreenPoint {
  name: string;
  stageName: string;
  survivalRate: number;
  isCritical: boolean;
  baseCount: number;
  decayRate: number;
}

@Component({
  selector: 'app-waterfall',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waterfall.html',
  styleUrl: './waterfall.css',
})
export class Waterfall {
  @Input() metricCards: any[] = [];
  @Input() stageByData: StageData[] = [];

  stageHeaders = signal([
    'Stage',
    'Screens',
    'Entered',
    'Exited',
    'Decay',
    'Loss mix',
    'Passed on',
    'Survival',
    'Median time'
  ]);

  chart?: Highcharts.Chart;
  private viewInitialized = false;
  survivalChart?: Highcharts.Chart;

   private readonly colors = {
    dropoff: '#0788c9',
    terminated: '#e91e4d',
    overquota: '#9333ea',
    discarded: '#f4510b',
    retained: '#d9dee7',
    stageColors: [
      '#d9dee7',
      '#bce7f8',
      '#d6d7fb',
      '#e1d5ff',
      '#f1ccfa',
      '#f8c8e0',
      '#f9cbd5',
      '#ffd7bd',
      '#fae8b6',
      '#bcebd0'
    ]
  };

  @Output() stageSelected = new EventEmitter<string>();

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stageByData'] && this.viewInitialized) {
      this.processAndRenderCharts();
    }
  }

  private processAndRenderCharts(): void {
    this.renderChart(this.stageByData);
    
    const computedScreens = this.generateScreenData(this.stageByData);
    this.renderSurvivalChart(computedScreens);
  }

  private generateScreenData(stages: StageData[]): ComputedScreenPoint[] {
    if (!stages || stages.length === 0) return [];

    // Global starting base cohort size (entered users of the first stage)
    console.log(stages);
    const globalInitialBase = stages[0].total_users ?? 1;
    console.log(globalInitialBase);
    
    const screenPoints: ComputedScreenPoint[] = [];

    stages.forEach((stage) => {
      const stageEntered = stage.total_users ?? 0;
      const stagePassed = stage.completed_users ?? 0;
      const totalStageLoss = stageEntered - stagePassed;

      // Determine screens: Use questions array if available, otherwise default to 1 screen representing the stage
      const targetScreens = (stage.questions && stage.questions.length > 0)
        ? stage.questions
        : [{ name: stage.cns_name, isCritical: false }];

      const totalScreensCount = targetScreens.length;

      targetScreens.forEach((screen, index) => {
        // Linearly distribute user losses across all screens within this stage
        const previousScreenRemaining = stageEntered - ((index) / totalScreensCount) * totalStageLoss;
        const currentScreenRemaining = stageEntered - ((index + 1) / totalScreensCount) * totalStageLoss;

        // Calculate screen properties
        const survivalRate = (currentScreenRemaining / globalInitialBase) * 100;
        const decayRate = previousScreenRemaining > 0 
          ? ((previousScreenRemaining - currentScreenRemaining) / previousScreenRemaining) * 100 
          : 0;

        screenPoints.push({
          name: screen.name || screen.cns_name || `Screen ${index + 1}`,
          stageName: stage.cns_name || `Stage ${stage.stage}`,
          survivalRate: Math.max(0, Math.min(100, survivalRate)), // clamp between 0-100%
          isCritical: !!screen.isCritical,
          baseCount: Math.round(previousScreenRemaining),
          decayRate: decayRate
        });
      });
    });

    return screenPoints;
  }

  private renderSurvivalChart(screens: ComputedScreenPoint[]): void {
    if (!screens?.length) {
      this.survivalChart?.destroy();
      this.survivalChart = undefined;
      return;
    }

    // Generate solid block shading regions on the X-axis for each unique stage group
    const plotBands: Highcharts.XAxisPlotBandsOptions[] = [];
    let currentStage = '';
    let startIdx = 0;
    let bandColorCounter = 0;

    screens.forEach((screen, index) => {
      if (index === 0) {
        currentStage = screen.stageName;
        return;
      }
      if (screen.stageName !== currentStage || index === screens.length - 1) {
        const endIdx = index === screens.length - 1 ? index : index - 1;
        plotBands.push({
          from: startIdx - 0.5,
          to: endIdx + 0.5,
          color: this.colors.stageColors[bandColorCounter % this.colors.stageColors.length],
          label: {
            text: currentStage,
            align: 'center',
            verticalAlign: 'top',
            y: -12,
            style: { color: '#475569', fontWeight: '600', fontSize: '11px' }
          }
        });
        startIdx = index;
        currentStage = screen.stageName;
        bandColorCounter++;
      }
    });

    const chartData = screens.map((s, idx) => ({
      x: idx,
      y: s.survivalRate,
      name: s.name,
      marker: {
        radius: s.isCritical ? 5 : 2.5,
        fillColor: s.isCritical ? '#e91e4d' : '#0788c9',
        states: {
          hover: {
            radius: s.isCritical ? 7 : 4.5
          }
        }
      },
      custom: { ...s }
    }));

    this.survivalChart?.destroy();
    this.survivalChart = Highcharts.chart('questionSurvivalChart', {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        height: 380,
              spacing: [64, 16, 10, 12],

        style: { fontFamily: 'Inter, Arial, sans-serif' }
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories: screens.map(s => s.name),
        labels: { enabled: false },
        tickWidth: 0,
        plotBands: plotBands.map(band => {
          // Deep-merge positioning tweaks into each generated plot band label
          if (band.label) {
            band.label.verticalAlign = 'top'; // Force placement at the bottom boundary
            band.label.y = -32; // Shift labels 45 pixels downwards into the margin space
          }
          return band;
        })
      },
      yAxis: {
        min: 0,
        max: 100,
        title: { text: undefined },
        gridLineColor: '#e2e8f0',
        labels: {
          formatter: function() { return this.value + '%'; }
        }
      },
      legend: { enabled: false },
      tooltip: {
        shared: false,
        useHTML: true,
        borderColor: '#dbe4f0',
        borderRadius: 10,
        // Add (this: any) to correctly type the context inside the formatter function
        formatter: function(this: any) {
          const point = this.point;
          const details = point?.custom;
          
          if (!details) return '';

          return `
            <div style="padding:6px; min-width:190px;">
              <strong>${details.name}</strong><br/>
              <span style="color:#64748b; font-size:11px;">Stage: ${details.stageName}</span>
              <hr style="border:0; border-top:1px solid #e2e8f0; margin:6px 0;"/>
              Survival Rate: <b>${this.y.toFixed(1)}%</b><br/>
              Screen Base: <b>${details.baseCount.toLocaleString()}</b><br/>
              Screen Decay: <b>${details.decayRate.toFixed(1)}%</b>
              ${details.isCritical ? '<br/><span style="color:#e91e4d; font-weight:bold;">⚠️ Critical Screen</span>' : ''}
            </div>
          `;
        }
      },
      plotOptions: {
        line: {
          color: '#0788c9',
          lineWidth: 2,
          states: { hover: { lineWidth: 2 } }
        }
      },
      series: [{
        type: 'line',
        data: chartData
      }]
    });
  }

  
  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.processAndRenderCharts();
  }

  getEntered(stage: StageData): number {
    return (
      stage.total_users
    );
  }

  getExited(stage: StageData): number {
    return (
      (stage.discarded_users ?? 0) +
      (stage.terminated_users ?? 0) +
      (stage.overquota_users ?? 0) + 
      (stage.dropoff_users ?? 0) +
      (stage.error_terminated_users ?? 0)
    );
  }

  getDecay(stage: StageData): number {
    const entered = this.getEntered(stage);

    return entered > 0
      ? (this.getExited(stage) / entered) * 100
      : 0;
  }

  getSurvival(stage: StageData): number {
    const entered = this.getEntered(stage);

    return entered > 0
      ? ((stage.completed_users ?? 0) / entered) * 100
      : 0;
  }

  getLossWidth(
  stage: StageData,
  type: 'dropoff' | 'discarded' | 'terminated' | 'overquota'
): number {
  const entered = this.getEntered(stage);

  if (entered <= 0) {
    return 0;
  }

  return (this.getLossCount(stage, type) / entered) * 100;
  }

  getLossCount(
  stage: StageData,
  type: 'dropoff' | 'discarded' | 'terminated' | 'overquota'
): number {
  return {
    dropoff: stage.dropoff_users ?? 0,
    discarded: stage.discarded_users ?? 0,
    terminated: stage.terminated_users ?? 0,
    overquota: stage.overquota_users ?? 0
  }[type];
  }

  getStageType(stage: StageData): string {
    return stage.type || stage.cns_type || '—';
  }


  private renderChart(stageData: StageData[]): void {
  if (!stageData?.length) {
    this.chart?.destroy();
    this.chart = undefined;
    return;
  }

  const stages = stageData;

  const series: Highcharts.SeriesColumnOptions[] = [
    {
      type: 'column',
      name: 'Drop-off',
      color: this.colors.dropoff,
      data: stages.map(s => s.dropoff_users ?? 0)
    },
    {
      type: 'column',
      name: 'Terminated',
      color: this.colors.terminated,
      data: stages.map(s => s.terminated_users ?? 0)
    },
    {
      type: 'column',
      name: 'Over quota',
      color: this.colors.overquota,
      data: stages.map(s => s.overquota_users ?? 0)
    },
    {
      type: 'column',
      name: 'Discarded',
      color: this.colors.discarded,
      data: stages.map(s => s.discarded_users ?? 0)
    },
    {
      type: 'column',
      name: 'Passed on',
      color: '#c8e8d5',
      data: stages.map(s => s.completed_users ?? 0)
    }
  ];

  this.chart?.destroy();

  this.chart = Highcharts.chart('respondentDecayChart', {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      height: 490,
      spacing: [35, 12, 10, 12],
      style: {
        fontFamily: 'Inter, Arial, sans-serif'
      }
    },

    title: {
      text: undefined
    },

    credits: {
      enabled: false
    },

    exporting: {
      enabled: true
    },

    xAxis: {
      categories: stages.map(s => s.cns_name || `Stage ${s.stage}`),
      lineColor: '#e1e7f0',
      tickLength: 0,
      labels: {
        rotation: -25,
        style: {
          color: '#162c4f',
          fontSize: '11px',
          fontWeight: '600'
        }
      }
    },

    yAxis: {
      min: 0,
      title: {
        text: undefined
      },
      gridLineColor: '#e2e8f2',
      labels: {
        formatter: function () {
          const value = Number(this.value);
          return value >= 1000
            ? `${Number((value / 1000).toFixed(1))}k`
            : String(value);
        }
      }
    },

    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'top',
      itemStyle: {
        color: '#183153',
        fontSize: '11px',
        fontWeight: '500'
      },
      symbolRadius: 5
    },

    tooltip: {
      shared: true,
      useHTML: true,
      borderColor: '#dbe4f0',
      borderRadius: 10,

      formatter: function (this: Highcharts.Point) {
        const stage = stages[this.x as number];

        if (!stage) {
          return false;
        }

        return `
          <div style="min-width:210px;padding:5px">
            <strong>${stage.cns_name || `Stage ${stage.stage}`}</strong>
            <div style="margin:8px 0">
              Total respondents:
              <b>${(stage.total_users ?? 0).toLocaleString()}</b>
            </div>
            <div style="color:#0788c9">
              ● Drop-off: ${(stage.dropoff_users ?? 0).toLocaleString()}
            </div>
            <div style="color:#e91e4d">
              ● Terminated: ${(stage.terminated_users ?? 0).toLocaleString()}
            </div>
            <div style="color:#9333ea">
              ● Over quota: ${(stage.overquota_users ?? 0).toLocaleString()}
            </div>
            <div style="color:#f4510b">
              ● Discarded: ${(stage.discarded_users ?? 0).toLocaleString()}
            </div>
            <div style="color:#39865b">
              ● Passed on: ${(stage.completed_users ?? 0).toLocaleString()}
            </div>
          </div>
        `;
      }
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        borderRadius: 3,
        groupPadding: 0.12,
        pointPadding: 0.02
      },
      series: {
        animation: {
          duration: 500
        }
      }
    },

    series
  });
  }



  selectStage(stage: StageData): void {
    this.stageSelected.emit(stage.cns_name);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = undefined;
  }
}
