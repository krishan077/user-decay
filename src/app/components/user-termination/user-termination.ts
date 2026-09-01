import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { Api } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/offline-exporting';
import 'highcharts/modules/funnel';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-termination',
  imports: [FormsModule, CommonModule],
  templateUrl: './user-termination.html',
  styleUrl: './user-termination.css',
})
export class UserTermination {
  allStudies: any = signal([]);
  studyData: any = signal([]);
  selectedSurveyId: any;
  selectedCell: any;
  isSurveyDropdownOpen = false;
  selectedSurvey: any = signal(null);
  usersData: any = signal([]);
  surveySearchTerm: string = '';
  userSearchTerm: string = '';
  loader: any = signal(false);
  userLoader: any = signal(false);
  @ViewChild('chartContainer') chartEl: any;
  @ViewChild('funnelContainer') funnelEl: any;
  chart: any;
  funnelChart: any;
  stageDownloadOpen = false;
  funnelDownloadOpen = false;
  selectedStage: string = '';
  company_name = localStorage.getItem('comp_name') || 'Company';
  comp_id = localStorage.getItem('comp_id');
  showLogoutDialog = false;

  constructor(private api: Api, private router: Router) {
    this.getStudies(this.comp_id);
  }

  getStudies(comp_id: any){
    this.loader.set(true);
    this.api.getApi(`get-studies/?comp_id=${comp_id}`).subscribe((response: any) => {
      // console.log(response);
      if(!response.error){
        if(response.data){
          this.studyData.set(response.data);
          this.allStudies.set([...response.data.live, ...response.data.complete].filter((s: any) => s.tech_used == 'NODE'));
          // console.log(this.allStudies());
          
          this.selectedSurvey.set(this.allStudies()[0]);
          this.selectedSurveyId = this.allStudies()[0].study_id;
          this.selectedCell = 'overall';
          this.getTerminationData(this.selectedSurveyId);
          // console.log(this.allStudies(), this.availableStages); 
        }
      }
      else{
        console.error('Error fetching studies:', response.message);
      }
    });
  }

  selectSurvey(survey: any): void {
    this.selectedSurvey.set(survey);
    this.selectedSurveyId = survey.study_id;
    this.selectedCell = 'overall';
    this.getTerminationData(this.selectedSurveyId);
    this.isSurveyDropdownOpen = false;
  }

  selectCell(cell: any): void {
    this.selectedCell = cell;
    // console.log(this.cellData);
    this.buildStageChart(this.cellData);
    
  }

  getTerminationData(studyId: any){
    this.userLoader.set(true);
    this.api.getApi(`studyUserStatus?study_id=${studyId}`).subscribe((response: any) => {
      console.log(response);
      if(!response.error){
        this.usersData.set(response.data.users);
        this.loader.set(false);
        this.selectedStage = '';
        this.userSearchTerm = '';
        this.userLoader.set(false);
        this.buildStageChart(this.usersData());
      }
    });
  }

    get filteredStudies() {
    return this.allStudies().filter((study: any) =>
      study.study_name.toLowerCase().includes(this.surveySearchTerm.toLowerCase()) || study.study_id.toString().includes(this.surveySearchTerm)
    );
  }

  get cellData() {
    if(this.selectedCell == 'overall'){
      // console.log(this.usersData());
      return this.usersData();
    }else{
      // console.log(this.usersData());
      return this.usersData().filter((user: any) => user.content.cnt_id == this.selectedCell.cnt_id);
    }
  }

  get statsCards() {
  return [
    {
      title: 'Total Users',
      count: this.cellData.length,
      type: 'all',
      valueClass: ''
    },
    {
      title: 'Terminated',
      count: this.cellData.filter((u: any) => u.wh_flag === 1).length,
      type: 'terminated',
      valueClass: 'text-red-600'
    },
    {
      title: 'Drop off',
      count: this.cellData.filter((u: any) => u.wh_flag == null).length,
      type: 'na',
      valueClass: 'text-red-600'
    },
    {
      title: 'Over Quota',
      count: this.cellData.filter((u: any) => u.wh_flag === 2).length,
      type: 'overquota',
      valueClass: 'text-red-600'
    },
    {
      title: 'Completed',
      count: this.cellData.filter((u: any) => u.wh_flag === 3).length,
      type: 'completed',
      valueClass: 'text-green-600'
    },
        {
      title: 'Discarded',
      count: this.cellData.filter((u: any) => u.wh_flag === 0).length,
      type: 'discarded',
      valueClass: 'text-red-600'
    },
    {
      title: 'Completion Rate',
      count: this.cellData.length
        ? (
            this.cellData.filter((u: any) => u.wh_flag === 3).length /
            this.cellData.length *
            100
          ).toFixed(1) + '%'
        : '0%',
      type: null,
      valueClass: 'text-blue-600'
    }
  ];
}


buildStageChart(data: any[]) {
  console.log(data);
  

  this.buildFunnelChart(data);

  const stageMap: { [key: number]: number } = {};

  data.forEach(row => {

    if (
      row.wh_page_stage === null ||
      row.wh_page_stage === undefined
    ) {
      return;
    }

    const stage = Number(row.wh_page_stage);

    if (Number.isNaN(stage)) {
      return;
    }

    if (!stageMap[stage]) {
      stageMap[stage] = 0;
    }

    stageMap[stage]++;
  });

  const stages = Object.keys(stageMap)
    .map(Number)
    .sort((a, b) => a - b);

  const options: Highcharts.Options = {

    chart: {
      type: 'column',
      marginTop: 40
    },

    title: {
      text: ''
    },

    xAxis: {
      categories: stages.map(s => `Stage ${s}`)
    },

    yAxis: {
      title: {
        text: 'User Count'
      }
    },

    legend: {
      enabled: false
    },

    plotOptions: {
      column: {
        cursor: 'pointer',
      }
    },

    series: [{
      type: 'column',
      name: 'Users',
      data: stages.map(s => stageMap[s])
    }],

    credits: {
      enabled: false
    },

    exporting: {
      enabled: false
    }
  };

  if (this.chart) {
    this.chart.destroy();
  }

  setTimeout(() => {

    if (this.chartEl?.nativeElement) {
      this.chart = Highcharts.chart(
        this.chartEl.nativeElement,
        options
      );
    }

  }, 100);
}

get availableStages(): any[] {
  return Array.from(
    new Map(
      this.cellData
        .filter((u: any) =>
          u.wh_page_stage !== null &&
          u.wh_page_stage !== undefined
        )
        .map((u: any) => [
          u.wh_page_stage,
          {
            wh_page_stage: u.wh_page_stage,
            wh_track: u.wh_track
          }
        ])
    ).values()
  ).sort(
    (a: any, b: any) =>
      Number(a.wh_page_stage) - Number(b.wh_page_stage)
  );
}
get filteredUsers() {
  const search = this.userSearchTerm.toLowerCase().trim();

  return [...this.cellData].filter((user: any) => {

    const userId = String(user.wh_mo_id ?? '').toLowerCase();
    const reason = String(user.user_termination?.reason ?? '').toLowerCase();
    const track = String(user.wh_track ?? '').toLowerCase();

    const matchesSearch =
      !search ||
      userId.includes(search) ||
      reason.includes(search) ||
      track.includes(search);

      const matchesStage =
      !this.selectedStage ||
      String(user.wh_page_stage) === this.selectedStage;

      console.log('User:', user, 'Matches Search:', matchesSearch, 'Matches Stage:', matchesStage);

    return matchesSearch && matchesStage;
  });
}

downloadCsv(type: string) {
  let data: any[] = [];

  switch (type) {
    case 'all':
      data = this.cellData;
      break;

    case 'discarded':
      data = this.cellData.filter((u: any) => u.wh_flag === 0);
      break;

    case 'terminated':
      data = this.cellData.filter((u: any) => u.wh_flag === 1);
      break;

    case 'overquota':
      data = this.cellData.filter((u: any) => u.wh_flag === 2);
      break;

    case 'na':
      data = this.cellData.filter((u: any) => u.wh_flag == null);
      break;

    case 'completed':
      data = this.cellData.filter((u: any) => u.wh_flag === 3);
      break;
  }

  if (!data.length) {
    return;
  }

  const csvRows = [];

  const headers = [
    'User ID',
    'Timestamp',
    'Stage',
    'Flag',
    'Last Track',
    'Reason',
    'Question SPSS',
    'Response'
  ];

  csvRows.push(headers.join(','));

  data.forEach((user: any) => {
    csvRows.push([
      `"${user.wh_mo_id ?? ''}"`,
      `"${user.created_at ?? ''}"`,
      `"${user.wh_page_stage ?? ''}"`,
      `"${user.wh_flag ?? ''}"`,
      `"${user.wh_track ?? ''}"`,
      `"${user.user_termination?.reason ?? ''}"`,
      `"${user.user_termination?.qs_spss ?? ''}"`,
      `"${this.formatResponse(user.user_termination?.response)?? ''}"`
    ].join(','));
  });

  const blob = new Blob([csvRows.join('\n')], {
    type: 'text/csv;charset=utf-8;'
  });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = `${type}_${this.selectedSurveyId + '_' + (this.selectedCell == 'overall' ? 'overall' : this.selectedCell.cell_name)}.csv`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

get keyInsights(): string[] {
  const data = this.cellData;

  if (!data.length) {
    return [];
  }

  const insights: string[] = [];

  // Completion Rate
  const completed = data.filter((u: any) => u.wh_flag === 3).length;
  const completionRate = ((completed / data.length) * 100).toFixed(1);

  insights.push(
    `${completionRate}% of users completed the survey.`
  );

  // Stage distribution
  const stageCounts: Record<number, number> = {};

  data.forEach((u: any) => {
    const stage = u.wh_page_stage ?? 0;
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
  });

  const highestStage = Object.entries(stageCounts)
    .sort((a, b) => Number(b[1]) - Number(a[1]))[0];

  if (highestStage) {
    insights.push(
      `Stage ${highestStage[0]} has the highest drop-off with ${highestStage[1]} users.`
    );
  }

  // Early stage drop-off
  const earlyDropoffs = data.filter(
    (u: any) =>
      u.wh_page_stage <= 2 &&
      [0, 1, 2].includes(u.wh_flag)
  ).length;

  if (earlyDropoffs > 0) {
    const pct = ((earlyDropoffs / data.length) * 100).toFixed(1);

    insights.push(
      `${pct}% of users exited during the first three stages.`
    );
  }

  // Terminated
  const terminated = data.filter((u: any) => u.wh_flag === 1).length;

  if (terminated > 0) {
    insights.push(
      `${terminated} users were terminated during the survey.`
    );
  }

  // Over quota
  const overQuota = data.filter((u: any) => u.wh_flag === 2).length;

  if (overQuota > 0) {
    insights.push(
      `${overQuota} users were rejected due to quota limits.`
    );
  }

  return insights;
}

confirmLogout() {
  this.showLogoutDialog = false;
  localStorage.removeItem('token');
  localStorage.removeItem('comp_id');
  localStorage.removeItem('comp_name');
  this.router.navigate(['/']);
}

formatResponse(response: any): string {
  if (response == null) {
    return '-';
  }

  // Array
  if (Array.isArray(response)) {
    return response.join(' | ');
  }

  // Object
  if (typeof response === 'object') {
    return Object.entries(response)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ');
  }

  // String / Number
  return String(response);
}

buildFunnelChart(data: any[]) {

  const stageMap: Record<number, {
    count: number;
    track: string;
  }> = {};

  // Count users at every stage
  data.forEach(row => {

    if (
      row.wh_page_stage === null ||
      row.wh_page_stage === undefined
    ) {
      return;
    }

    const stage = Number(row.wh_page_stage);

    if (Number.isNaN(stage)) {
      return;
    }

    if (!stageMap[stage]) {
      stageMap[stage] = {
        count: 0,
        track: row.wh_track || 'No Track'
      };
    }

    stageMap[stage].count++;

    if (
      (!stageMap[stage].track ||
        stageMap[stage].track === 'No Track') &&
      row.wh_track
    ) {
      stageMap[stage].track = row.wh_track;
    }
  });

  const stages = Object.keys(stageMap)
    .map(Number)
    .sort((a, b) => a - b);

  // ------------------------------------
  // Build cumulative remaining users
  // ------------------------------------

  const totalUsers = data.length;

  let remainingUsers = totalUsers;

  const funnelData: any[] = [];

  // First stage = Total Users
  funnelData.push({
    name: 'Total Users',
    y: totalUsers,
    custom: {
      stage: 'total',
      track: 'All Users',
      deducted: 0
    }
  });

  // Deduct each stage from the remaining users
  stages.forEach(stage => {

    const stageCount = stageMap[stage].count;

    remainingUsers = Math.max(
      0,
      remainingUsers - stageCount
    );

    funnelData.push({
      name: `After Stage ${stage}`,
      y: remainingUsers,
      custom: {
        stage,
        track: stageMap[stage].track,
        deducted: stageCount
      }
    });
  });

  console.log('Funnel Data:', funnelData);

  const options: Highcharts.Options = {

    chart: {
      type: 'funnel',
      marginTop: 20,
      marginBottom: 20
    },

    title: {
      text: ''
    },

    legend: {
      enabled: false
    },

    tooltip: {
      useHTML: true,

      formatter: function () {

        const point: any = this;

        const custom = point.custom || {};

        if (custom.stage === 'total') {
          return `
            <div style="padding: 4px;">
              <b>Total Users</b><br>
              Users: <b>${point.y}</b>
            </div>
          `;
        }

        return `
          <div style="padding: 4px;">
            <b>Stage ${custom.stage}</b><br>
            Users Terminated: <b>${custom.deducted}</b><br>
            Users Remaining: <b>${point.y}</b><br>
            Track: ${custom.track || 'No Track'}
          </div>
        `;
      }
    },

    plotOptions: {
      funnel: {

        neckWidth: '30%',
        neckHeight: '20%',
        width: '70%',

        dataLabels: {
          enabled: true,
          distance: 20,

          formatter: function () {

            const point: any = this;

            if (point.custom?.stage === 'total') {
              return `Total Users - ${point.y}`;
            }

            return `After Stage ${point.custom?.stage} - ${point.y}`;
          }
        }
      }
    },

    series: [{
      type: 'funnel',
      name: 'Users Remaining',
      data: funnelData
    }],

    credits: {
      enabled: false
    },

    exporting: {
      enabled: false
    }
  };

  if (this.funnelChart) {
    this.funnelChart.destroy();
  }

  setTimeout(() => {

    if (this.funnelEl?.nativeElement) {

      this.funnelChart = Highcharts.chart(
        this.funnelEl.nativeElement,
        options
      );

    }

  }, 100);
}

downloadChartPNG(chartType: 'stage' | 'funnel'): void {

  const chart =
    chartType === 'stage'
      ? this.chart
      : this.funnelChart;

  if (!chart) {
    return;
  }

  let filename =
    chartType === 'stage'
      ? `termination-by-stage-${this.selectedSurvey().study_id}`
      : `user-funnel-${this.selectedSurvey().study_id}`;

  if (this.selectedCell !== 'overall') {
    filename += `-${this.selectedCell.cell_name}`;
  }

  filename = filename.replace(/[^a-zA-Z0-9-_]/g, '_');

  chart.exportChartLocal({
    type: 'image/png',
    filename
  });
}
}
