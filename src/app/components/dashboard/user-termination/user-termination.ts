import { Component, signal } from '@angular/core';
import { Api } from '../../../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Waterfall } from './waterfall/waterfall';
import { QuestionDecay } from './question-decay/question-decay';
import { Respondents } from './respondents/respondents';

@Component({
  selector: 'app-user-termination',
  imports: [FormsModule, CommonModule, Waterfall, QuestionDecay, Respondents],
  templateUrl: './user-termination.html',
  styleUrl: './user-termination.css',
})
export class UserTermination {
  selectedSurveyId: any;
  selectedSurvey: any = signal(null);
  loader: any = signal(false);
  company_name = localStorage.getItem('comp_name') || 'Company';
  comp_id = localStorage.getItem('comp_id');
  selectedTab: any = signal('overview');
  decayTabs = [
    { name: 'overview', label: 'Overview' },
    { name: 'question-decay', label: 'Question decay' },
    { name: 'respondents', label: 'Respondents' }
  ];

  allCells: any = signal([]);
  selectedCell: any = signal(null);
  qoutaGroups: any = signal([]);
  selectedqoutaGroup: any = signal('all');

  metricCards = signal([
    { title: 'STARTS', value: '0', description: 'Total starts' },
    { title: 'COMPLETES', value: '0', description: 'Total completes', color: 'success' },
    { title: 'INCIDENCE', value: '0%', description: 'completes ÷ starts' },
    { title: 'TOTAL DECAY', value: '0%', description: 'Respondents lost', color: 'danger' },
    { title: 'POST-QUALIFY RETENTION', value: '0%', description: 'Retention rate' },
    { title: 'MEDIAN LOI', value: '22m 53s', description: 'abandons quit at 3m 50s' }
  ]);
  userLoader: any = signal(false);
  usersData: any = signal([]);
  surveyData: any[];
  
  categories: string[] = ['All stages', 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'];
  allQuestions: any = [];

  constructor(private api: Api, private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    let survey = localStorage.getItem("selectedSurvey");
    this.selectedSurvey.set(JSON.parse(survey ?? 'null'));
    this.route.queryParams.subscribe((param) => {
      this.selectedSurveyId = param['study_id'];
    });
    // this.getperContentStats(this.selectedSurveyId);
    this.getTerminationData(this.selectedSurveyId)
  }

  selectTab(tab: string): void {
    this.selectedTab.set(tab);
  }

getperContentStats(study_id: number, cnt_id?: number, cnq_id?: any) {
    this.loader.set(true);

    // Build query params dynamically depending on whether cnt_id or cnq_id are provided
    let endpoint = `perContentStats?study_id=${study_id}`;
    if (cnt_id) endpoint += `&cnt_id=${cnt_id}`;
    if (cnq_id && cnq_id !== 'all') endpoint += `&cnq_id=${cnq_id}`;

    this.api.getApi(endpoint).subscribe({
      next: (response: any) => {
        this.loader.set(false);
        if (!cnt_id) {
          this.allCells.set([...response.data]);
          if (this.allCells().length > 0) {
            this.selectedCell.set(this.allCells()[0]);
            this.qoutaGroups.set(this.selectedCell().quotas);
            this.selectedqoutaGroup.set('all');
            this.updateMetrics(this.selectedCell());
          }
        } else {
          // Use the data returned from the API response for the filtered cell/quota
          const metricData = Array.isArray(response.data) ? response.data[0] : response.data;
          if (metricData) {
            this.updateMetrics(metricData);
          }
        }
      },
      error: (err) => {
        this.loader.set(false);
        console.error('Error fetching stats:', err);
      }
    });
  }

  selectCell(cell: any) {
    console.log('Selected Cell:', cell);
    this.selectedCell.set(cell);
    this.qoutaGroups.set(cell.quotas);
    this.selectedqoutaGroup.set('all');
    
    // Call API with new cell ID if required on cell change
    this.getperContentStats(this.selectedSurveyId, cell.cnt_id);
  }

  selectQoutaGroup(cnq_id: any) {
    console.log('Selected Quota Group ID:', cnq_id);
    this.selectedqoutaGroup.set(cnq_id);

    const cell = this.selectedCell();
    if (!cell) return;

    // Call the same API function passing both cell ID and quota ID
    this.getperContentStats(this.selectedSurveyId, cell.cnt_id, cnq_id);
  }

  updateMetrics(data: any) {
    const starts = data.total_users || 0;
    const completes = data.completed_users || 0;
    const terminated = data.terminated_users || 0;
    const discarded = data.discarded_users || 0;
    
    const incidence = starts > 0 ? ((completes / starts) * 100).toFixed(1) + '%' : '0%';
    const totalLost = terminated + discarded;
    const totalDecay = starts > 0 ? ((totalLost / starts) * 100).toFixed(1) + '%' : '0%';
    const retention = starts > 0 ? ((completes / (starts - terminated)) * 100).toFixed(1) + '%' : '0%';

    this.metricCards.set([
      {
        title: 'STARTS',
        value: starts.toLocaleString(),
        description: `${completes.toLocaleString()} qualified past screener`
      },
      {
        title: 'COMPLETES',
        value: completes.toLocaleString(),
        description: `100% of target`,
        color: 'success'
      },
      {
        title: 'INCIDENCE',
        value: incidence,
        description: 'completes ÷ starts'
      },
      {
        title: 'TOTAL DECAY',
        value: totalDecay,
        description: `${totalLost.toLocaleString()} respondents lost`,
        color: 'danger'
      },
      {
        title: 'POST-QUALIFY RETENTION',
        value: retention,
        description: 'of those who cleared screening'
      },
      {
        title: 'MEDIAN LOI',
        value: '22m 53s',
        description: 'abandons quit at 3m 50s'
      }
    ]);
  }

    getTerminationData(studyId: any){
    this.userLoader.set(true);
    this.api.getApi(`studyUserStatus?study_id=${studyId}`).subscribe((response: any) => {
      // console.log(response);
      if(!response.error){
        this.usersData.set(response.data.users);
        console.log(this.usersData());
        
        this.surveyData = [...response.data.surveys];
        console.log(this.surveyData);
        this.categories = this.surveyData.map(c => c.cns_name);
        console.log(this.categories);

    
    this.surveyData.forEach(category => {
      category.questions.forEach(q => {
        this.allQuestions.push({
          category: category.cns_name,
          question: q.qs_question,
          spss: q.SPSS,
          type: q.qs_type
        });
      });
    });
        
        this.userLoader.set(false);
      }
    });
  }

}
