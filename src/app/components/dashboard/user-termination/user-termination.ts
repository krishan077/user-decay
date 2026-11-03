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

  responseOverview = {
  "code": 200,
  "error": false,
  "message": "Data operation successful",
  "data": [
    {
      "total_users": 4594,
      "completed_users": 401,
      "discarded_users": 45,
      "terminated_users": 3045,
      "overquota_users": 21,
      "cnt_id": 20247,
      "cell_name": "RainbowV",
      "cell": "Cell1",
      "quotas": [
        {
          "cnq_id": 71431,
          "cnq_quota_name": "Boy 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71432,
          "cnq_quota_name": "Girl 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71433,
          "cnq_quota_name": "Male 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71434,
          "cnq_quota_name": "Female 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71435,
          "cnq_quota_name": "Parents of Boys 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71436,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71437,
          "cnq_quota_name": "Male 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71438,
          "cnq_quota_name": "Female 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71439,
          "cnq_quota_name": "Male 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71440,
          "cnq_quota_name": "Female 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71441,
          "cnq_quota_name": "White/Caucasian",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71442,
          "cnq_quota_name": "African American/Black",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71443,
          "cnq_quota_name": "Hispanic",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71444,
          "cnq_quota_name": "Asian/Other",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71445,
          "cnq_quota_name": "Older M-F for 8-12",
          "cnq_age_from": 55,
          "cnq_age_to": 69,
          "cnq_gender": "Male_Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71506,
          "cnq_quota_name": "Male 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71514,
          "cnq_quota_name": "Female 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71522,
          "cnq_quota_name": "Boy 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71530,
          "cnq_quota_name": "Girl 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71538,
          "cnq_quota_name": "Parents of Boys 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71546,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71554,
          "cnq_quota_name": "Parents of Girls 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71561,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        }
      ]
    },
    {
      "total_users": 825,
      "completed_users": 402,
      "discarded_users": 55,
      "terminated_users": 172,
      "overquota_users": 31,
      "cnt_id": 20248,
      "cell_name": "Team Walking",
      "cell": "Cell2",
      "quotas": [
        {
          "cnq_id": 71386,
          "cnq_quota_name": "Boy 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71387,
          "cnq_quota_name": "Girl 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71388,
          "cnq_quota_name": "Male 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71389,
          "cnq_quota_name": "Female 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71390,
          "cnq_quota_name": "Parents of Boys 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71391,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71392,
          "cnq_quota_name": "Male 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71393,
          "cnq_quota_name": "Female 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71394,
          "cnq_quota_name": "Male 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71395,
          "cnq_quota_name": "Female 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71396,
          "cnq_quota_name": "White/Caucasian",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71397,
          "cnq_quota_name": "African American/Black",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71398,
          "cnq_quota_name": "Hispanic",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71399,
          "cnq_quota_name": "Asian/Other",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71400,
          "cnq_quota_name": "Older M-F for 8-12",
          "cnq_age_from": 55,
          "cnq_age_to": 69,
          "cnq_gender": "Male_Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71507,
          "cnq_quota_name": "Male 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71515,
          "cnq_quota_name": "Female 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71523,
          "cnq_quota_name": "Boy 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71531,
          "cnq_quota_name": "Girl 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71539,
          "cnq_quota_name": "Parents of Boys 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71547,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71555,
          "cnq_quota_name": "Parents of Girls 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71562,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        }
      ]
    },
    {
      "total_users": 1873,
      "completed_users": 403,
      "discarded_users": 45,
      "terminated_users": 1001,
      "overquota_users": 47,
      "cnt_id": 20249,
      "cell_name": "Head",
      "cell": "Cell3",
      "quotas": [
        {
          "cnq_id": 71401,
          "cnq_quota_name": "Boy 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71402,
          "cnq_quota_name": "Girl 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71403,
          "cnq_quota_name": "Male 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71404,
          "cnq_quota_name": "Female 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71405,
          "cnq_quota_name": "Parents of Boys 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71406,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71407,
          "cnq_quota_name": "Male 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71408,
          "cnq_quota_name": "Female 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71409,
          "cnq_quota_name": "Male 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71410,
          "cnq_quota_name": "Female 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71411,
          "cnq_quota_name": "White/Caucasian",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71412,
          "cnq_quota_name": "African American/Black",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71413,
          "cnq_quota_name": "Hispanic",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71414,
          "cnq_quota_name": "Asian/Other",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71415,
          "cnq_quota_name": "Older M-F for 8-12",
          "cnq_age_from": 55,
          "cnq_age_to": 69,
          "cnq_gender": "Male_Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71508,
          "cnq_quota_name": "Male 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71516,
          "cnq_quota_name": "Female 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71524,
          "cnq_quota_name": "Boy 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71532,
          "cnq_quota_name": "Girl 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71540,
          "cnq_quota_name": "Parents of Boys 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71548,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71556,
          "cnq_quota_name": "Parents of Girls 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71563,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        }
      ]
    },
    {
      "total_users": 758,
      "completed_users": 403,
      "discarded_users": 49,
      "terminated_users": 151,
      "overquota_users": 6,
      "cnt_id": 20250,
      "cell_name": "Face To Face",
      "cell": "Cell4",
      "quotas": [
        {
          "cnq_id": 71461,
          "cnq_quota_name": "Boy 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71462,
          "cnq_quota_name": "Girl 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71463,
          "cnq_quota_name": "Male 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71464,
          "cnq_quota_name": "Female 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71465,
          "cnq_quota_name": "Parents of Boys 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71466,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71467,
          "cnq_quota_name": "Male 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71468,
          "cnq_quota_name": "Female 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71469,
          "cnq_quota_name": "Male 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71470,
          "cnq_quota_name": "Female 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71471,
          "cnq_quota_name": "White/Caucasian",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71472,
          "cnq_quota_name": "African American/Black",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71473,
          "cnq_quota_name": "Hispanic",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71474,
          "cnq_quota_name": "Asian/Other",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71475,
          "cnq_quota_name": "Older M-F for 8-12",
          "cnq_age_from": 55,
          "cnq_age_to": 69,
          "cnq_gender": "Male_Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71509,
          "cnq_quota_name": "Male 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71517,
          "cnq_quota_name": "Female 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71525,
          "cnq_quota_name": "Boy 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71533,
          "cnq_quota_name": "Girl 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71541,
          "cnq_quota_name": "Parents of Boys 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71549,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71557,
          "cnq_quota_name": "Parents of Girls 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71564,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        }
      ]
    },
    {
      "total_users": 779,
      "completed_users": 400,
      "discarded_users": 55,
      "terminated_users": 164,
      "overquota_users": 9,
      "cnt_id": 20251,
      "cell_name": "Ensemble Bright",
      "cell": "Cell5",
      "quotas": [
        {
          "cnq_id": 71491,
          "cnq_quota_name": "Boy 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71492,
          "cnq_quota_name": "Girl 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71493,
          "cnq_quota_name": "Male 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71494,
          "cnq_quota_name": "Female 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71495,
          "cnq_quota_name": "Parents of Boys 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71496,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71497,
          "cnq_quota_name": "Male 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71498,
          "cnq_quota_name": "Female 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71499,
          "cnq_quota_name": "Male 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71500,
          "cnq_quota_name": "Female 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71501,
          "cnq_quota_name": "White/Caucasian",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71502,
          "cnq_quota_name": "African American/Black",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71503,
          "cnq_quota_name": "Hispanic",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71504,
          "cnq_quota_name": "Asian/Other",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71505,
          "cnq_quota_name": "Older M-F for 8-12",
          "cnq_age_from": 55,
          "cnq_age_to": 69,
          "cnq_gender": "Male_Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71510,
          "cnq_quota_name": "Male 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71518,
          "cnq_quota_name": "Female 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71526,
          "cnq_quota_name": "Boy 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71534,
          "cnq_quota_name": "Girl 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71542,
          "cnq_quota_name": "Parents of Boys 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71550,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71558,
          "cnq_quota_name": "Parents of Girls 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71565,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        }
      ]
    },
    {
      "total_users": 816,
      "completed_users": 408,
      "discarded_users": 79,
      "terminated_users": 167,
      "overquota_users": 5,
      "cnt_id": 20252,
      "cell_name": "Ensemble Space",
      "cell": "Cell6",
      "quotas": [
        {
          "cnq_id": 71446,
          "cnq_quota_name": "Boy 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71447,
          "cnq_quota_name": "Girl 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71448,
          "cnq_quota_name": "Male 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71449,
          "cnq_quota_name": "Female 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71450,
          "cnq_quota_name": "Parents of Boys 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71451,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71452,
          "cnq_quota_name": "Male 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71453,
          "cnq_quota_name": "Female 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71454,
          "cnq_quota_name": "Male 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71455,
          "cnq_quota_name": "Female 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71456,
          "cnq_quota_name": "White/Caucasian",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71457,
          "cnq_quota_name": "African American/Black",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71458,
          "cnq_quota_name": "Hispanic",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71459,
          "cnq_quota_name": "Asian/Other",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71460,
          "cnq_quota_name": "Older M-F for 8-12",
          "cnq_age_from": 55,
          "cnq_age_to": 69,
          "cnq_gender": "Male_Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71511,
          "cnq_quota_name": "Male 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71519,
          "cnq_quota_name": "Female 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71527,
          "cnq_quota_name": "Boy 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71535,
          "cnq_quota_name": "Girl 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71543,
          "cnq_quota_name": "Parents of Boys 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71551,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71559,
          "cnq_quota_name": "Parents of Girls 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71566,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        }
      ]
    },
    {
      "total_users": 831,
      "completed_users": 402,
      "discarded_users": 64,
      "terminated_users": 156,
      "overquota_users": 24,
      "cnt_id": 20253,
      "cell_name": "Ensemble Geometric",
      "cell": "Cell7",
      "quotas": [
        {
          "cnq_id": 71416,
          "cnq_quota_name": "Boy 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71417,
          "cnq_quota_name": "Girl 8-9",
          "cnq_age_from": 8,
          "cnq_age_to": 9,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71418,
          "cnq_quota_name": "Male 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71419,
          "cnq_quota_name": "Female 18-24",
          "cnq_age_from": 18,
          "cnq_age_to": 24,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71420,
          "cnq_quota_name": "Parents of Boys 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71421,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71422,
          "cnq_quota_name": "Male 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71423,
          "cnq_quota_name": "Female 35-44",
          "cnq_age_from": 35,
          "cnq_age_to": 44,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71424,
          "cnq_quota_name": "Male 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71425,
          "cnq_quota_name": "Female 45-54",
          "cnq_age_from": 45,
          "cnq_age_to": 54,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71426,
          "cnq_quota_name": "White/Caucasian",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71427,
          "cnq_quota_name": "African American/Black",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71428,
          "cnq_quota_name": "Hispanic",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71429,
          "cnq_quota_name": "Asian/Other",
          "cnq_age_from": null,
          "cnq_age_to": null,
          "cnq_gender": "Empty",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71430,
          "cnq_quota_name": "Older M-F for 8-12",
          "cnq_age_from": 55,
          "cnq_age_to": 69,
          "cnq_gender": "Male_Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71512,
          "cnq_quota_name": "Male 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71520,
          "cnq_quota_name": "Female 30-75",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71528,
          "cnq_quota_name": "Boy 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71536,
          "cnq_quota_name": "Girl 10-12",
          "cnq_age_from": 10,
          "cnq_age_to": 12,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71544,
          "cnq_quota_name": "Parents of Boys 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Male",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71552,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 25,
          "cnq_age_to": 69,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71560,
          "cnq_quota_name": "Parents of Girls 10-12",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        },
        {
          "cnq_id": 71567,
          "cnq_quota_name": "Parents of Girls 8-9 ",
          "cnq_age_from": 30,
          "cnq_age_to": 75,
          "cnq_gender": "Female",
          "cnq_question_quota": null
        }
      ]
    }
  ]
}

responseStages = {
  "code": 200,
  "error": false,
  "message": "Data operation successful",
  "data": [
    {
      "cns_id": null,
      "cns_type": "Take Survey",
      "cns_name": "Terms Conditions Page",
      "stage": 1,
      "type": "instruction",
      "total_users": 6409,
      "completed_users": 5854,
      "terminated_users": 115,
      "error_terminated_users": 0,
      "dropoff_users": 440
    },
    {
      "cns_id": null,
      "cns_type": "firstSurvey",
      "cns_name": "Pre Screen Survey Instruction",
      "stage": 2,
      "type": "instruction",
      "total_users": 5852,
      "completed_users": 5829,
      "terminated_users": 0,
      "error_terminated_users": 0,
      "dropoff_users": 23
    },
    {
      "cns_id": 23314,
      "cns_type": "pre-screen",
      "cns_stage": 3,
      "cns_name": "Pre Screen Survey",
      "questions": [
        {
          "qs_id": 112990,
          "qs_question": "[SET DISTRIBUTION PLATFORM, DO NOT ASK]",
          "SPSS": "DISTRO",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473518,
              "opt_option": "Theatrical",
              "SPSS": "1"
            },
            {
              "opt_id": 473519,
              "opt_option": "Streaming/TV",
              "SPSS": "2"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 5829,
          "answered_users": 5829,
          "completed_users": 5829,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 112991,
          "qs_question": "[PLATFORM CODE – CODE ONLY BASED ON SURVEY SPEC, RESPONDENT WILL NOT SEE THIS]",
          "SPSS": "CODEPLATFORM",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473520,
              "opt_option": "Facebook",
              "SPSS": "1"
            },
            {
              "opt_id": 473521,
              "opt_option": "InstagramReels",
              "SPSS": "2"
            },
            {
              "opt_id": 473522,
              "opt_option": "Instagram Stories",
              "SPSS": "3"
            },
            {
              "opt_id": 473523,
              "opt_option": "Instagram In-Feed",
              "SPSS": "4"
            },
            {
              "opt_id": 473524,
              "opt_option": "Snapchat",
              "SPSS": "5"
            },
            {
              "opt_id": 473525,
              "opt_option": "TikTok",
              "SPSS": "6"
            },
            {
              "opt_id": 473526,
              "opt_option": "YouTube",
              "SPSS": "7"
            },
            {
              "opt_id": 473527,
              "opt_option": "YouTube Shorts",
              "SPSS": "8"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 5829,
          "answered_users": 5828,
          "completed_users": 5827,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 112992,
          "qs_question": "Please indicate your gender.",
          "SPSS": "S1",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473528,
              "opt_option": "Male",
              "SPSS": "1"
            },
            {
              "opt_id": 473529,
              "opt_option": "Female",
              "SPSS": "2"
            },
            {
              "opt_id": 473530,
              "opt_option": "Non-binary",
              "SPSS": "3"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 5827,
          "answered_users": 5701,
          "completed_users": 5704,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 122,
          "mean": 23.477659574468085,
          "median": 2,
          "mode": 2
        },
        {
          "qs_id": 112993,
          "qs_question": "How old are you?",
          "SPSS": "S2",
          "qs_type": "freetext_numeric",
          "options": [],
          "numerics": [],
          "grids": [],
          "total_users": 5701,
          "answered_users": 5646,
          "completed_users": 5646,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 54,
          "mean": 2.8861702127659576,
          "median": 1,
          "mode": 1
        },
        {
          "qs_id": 112994,
          "qs_question": "What country do you live in?",
          "SPSS": "S3",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473531,
              "opt_option": "Australia",
              "SPSS": "1"
            },
            {
              "opt_id": 473532,
              "opt_option": "Brazil",
              "SPSS": "2"
            },
            {
              "opt_id": 473533,
              "opt_option": "Canada",
              "SPSS": "3"
            },
            {
              "opt_id": 473534,
              "opt_option": "China",
              "SPSS": "4"
            },
            {
              "opt_id": 473535,
              "opt_option": "France",
              "SPSS": "5"
            },
            {
              "opt_id": 473536,
              "opt_option": "Germany",
              "SPSS": "6"
            },
            {
              "opt_id": 473537,
              "opt_option": "India",
              "SPSS": "7"
            },
            {
              "opt_id": 473538,
              "opt_option": "Indonesia",
              "SPSS": "8"
            },
            {
              "opt_id": 473539,
              "opt_option": "Japan",
              "SPSS": "9"
            },
            {
              "opt_id": 473540,
              "opt_option": "Mexico",
              "SPSS": "10"
            },
            {
              "opt_id": 473541,
              "opt_option": "South Korea",
              "SPSS": "11"
            },
            {
              "opt_id": 473542,
              "opt_option": "United Kingdom",
              "SPSS": "12"
            },
            {
              "opt_id": 473543,
              "opt_option": "United States",
              "SPSS": "13"
            },
            {
              "opt_id": 473544,
              "opt_option": "None of these",
              "SPSS": "99"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 5646,
          "answered_users": 5600,
          "completed_users": 5601,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 44,
          "mean": 3.867021276595745,
          "median": 3,
          "mode": 2
        },
        {
          "qs_id": 112995,
          "qs_question": "CODE LANGUAGE",
          "SPSS": "S4",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473545,
              "opt_option": "cinema",
              "SPSS": "1"
            },
            {
              "opt_id": 473546,
              "opt_option": "theater",
              "SPSS": "2"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 5600,
          "answered_users": 5596,
          "completed_users": 5596,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 4,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 112377,
          "qs_question": "What is your zip code?",
          "SPSS": "S5",
          "qs_type": "freetext_numeric",
          "options": [],
          "numerics": [],
          "grids": [],
          "total_users": 5596,
          "answered_users": 5572,
          "completed_users": 5573,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 23,
          "mean": 3.217021276595745,
          "median": 1,
          "mode": 1
        },
        {
          "qs_id": 112378,
          "qs_question": "CENSUS REGION ",
          "SPSS": "S6",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 468410,
              "opt_option": "New England",
              "SPSS": "1"
            },
            {
              "opt_id": 468411,
              "opt_option": "Middle Atlantic",
              "SPSS": "2"
            },
            {
              "opt_id": 468412,
              "opt_option": "South Atlantic",
              "SPSS": "3"
            },
            {
              "opt_id": 468413,
              "opt_option": "East South Central",
              "SPSS": "4"
            },
            {
              "opt_id": 468414,
              "opt_option": "East North Central",
              "SPSS": "5"
            },
            {
              "opt_id": 468415,
              "opt_option": "West South Central",
              "SPSS": "6"
            },
            {
              "opt_id": 468416,
              "opt_option": "West North Central",
              "SPSS": "7"
            },
            {
              "opt_id": 468417,
              "opt_option": "Mountain",
              "SPSS": "8"
            },
            {
              "opt_id": 468418,
              "opt_option": "Pacific",
              "SPSS": "9"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 5572,
          "answered_users": 5566,
          "completed_users": 5566,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 5,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 112379,
          "qs_question": "COASTAL AREAS VS. HEARTLAND",
          "SPSS": "S6_1",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 468419,
              "opt_option": "Coastal",
              "SPSS": "1"
            },
            {
              "opt_id": 468420,
              "opt_option": "Heartland",
              "SPSS": "2"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 5567,
          "answered_users": 5560,
          "completed_users": 5559,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 7,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 112380,
          "qs_question": "Are you of Hispanic or Latino descent?",
          "SPSS": "S7",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 468421,
              "opt_option": "Yes",
              "SPSS": "1"
            },
            {
              "opt_id": 468422,
              "opt_option": "No",
              "SPSS": "2"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 5560,
          "answered_users": 5548,
          "completed_users": 5550,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 10,
          "mean": 3.048936170212766,
          "median": 2,
          "mode": 2
        },
        {
          "qs_id": 112381,
          "qs_question": "Which of these options best describes your race or ethnic background?  <i>Please select all that apply. </i>",
          "SPSS": "S8",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 468423,
              "opt_option": "White or Caucasian",
              "SPSS": "1"
            },
            {
              "opt_id": 468424,
              "opt_option": "African American or Black",
              "SPSS": "2"
            },
            {
              "opt_id": 468425,
              "opt_option": "Asian or Asian American",
              "SPSS": "3"
            },
            {
              "opt_id": 468426,
              "opt_option": "Native, Native American, Indigenous, or Alaska Native",
              "SPSS": "4"
            },
            {
              "opt_id": 468427,
              "opt_option": "Native Hawaiian or Pacific Islander",
              "SPSS": "5"
            },
            {
              "opt_id": 468428,
              "opt_option": "Middle Eastern or Northern African",
              "SPSS": "6"
            },
            {
              "opt_id": 468429,
              "opt_option": "Prefer to self-describe",
              "SPSS": "7"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 5550,
          "answered_users": 4726,
          "completed_users": 5536,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 12,
          "mean": 4.623015873015873,
          "median": 3,
          "mode": 2
        },
        {
          "qs_id": 112382,
          "qs_question": "CODE ETHNICITY",
          "SPSS": "S9",
          "qs_type": "custom_single",
          "options": [
            {
              "opt_id": 468430,
              "opt_option": "White or Caucasian",
              "SPSS": "1"
            },
            {
              "opt_id": 468431,
              "opt_option": "African American or Black",
              "SPSS": "2"
            },
            {
              "opt_id": 468432,
              "opt_option": "Hispanic",
              "SPSS": "3"
            },
            {
              "opt_id": 468433,
              "opt_option": "Asian or Asian American",
              "SPSS": "4"
            },
            {
              "opt_id": 468434,
              "opt_option": "Other",
              "SPSS": "5"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 5538,
          "answered_users": 5538,
          "completed_users": 5531,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 112996,
          "qs_question": "Do you or does any member of your immediate family (spouse, child, or parent) have any current or past employment history with any of the following industries?<i>Please select all that apply</i>.",
          "SPSS": "S10",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473547,
              "opt_option": "Advertising",
              "SPSS": "1"
            },
            {
              "opt_id": 473548,
              "opt_option": "Market research",
              "SPSS": "2"
            },
            {
              "opt_id": 473549,
              "opt_option": "Entertainment industry",
              "SPSS": "3"
            },
            {
              "opt_id": 473550,
              "opt_option": "Radio or television (including cable)",
              "SPSS": "4"
            },
            {
              "opt_id": 473551,
              "opt_option": "Retail",
              "SPSS": "5"
            },
            {
              "opt_id": 473552,
              "opt_option": "Insurance",
              "SPSS": "6"
            },
            {
              "opt_id": 473553,
              "opt_option": "Teaching",
              "SPSS": "7"
            },
            {
              "opt_id": 473554,
              "opt_option": "Construction",
              "SPSS": "8"
            },
            {
              "opt_id": 473555,
              "opt_option": "None of these",
              "SPSS": "99"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 5539,
          "answered_users": 5502,
          "completed_users": 4626,
          "terminated_users": 891,
          "error_terminated_users": 0,
          "dropoff_users": 37,
          "mean": 10.159574468085106,
          "median": 5,
          "mode": 3
        },
        {
          "qs_id": 112997,
          "qs_question": "In the past 6 months, how many times have you engaged in each of the following activities? <i>Please enter the number below.</i>",
          "SPSS": "S11",
          "qs_type": "grid_freetext",
          "options": [
            {
              "opt_id": 473556,
              "opt_option": "Total",
              "SPSS": "Z"
            },
            {
              "opt_id": 473557,
              "opt_option": "Saw a movie at the [THEATER]",
              "SPSS": "A"
            },
            {
              "opt_id": 473558,
              "opt_option": "Visited a theme park / amusement park",
              "SPSS": "B"
            },
            {
              "opt_id": 473559,
              "opt_option": "Attended a live sports event",
              "SPSS": "C"
            },
            {
              "opt_id": 473560,
              "opt_option": "Traveled on an airplane",
              "SPSS": "D"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 4616,
          "answered_users": 4337,
          "completed_users": 2948,
          "terminated_users": 1394,
          "error_terminated_users": 0,
          "dropoff_users": 276,
          "mean": 28.4468085106383,
          "median": 16,
          "mode": 11
        },
        {
          "qs_id": 112998,
          "qs_question": "Do you have children under 18 years old?",
          "SPSS": "S15",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473561,
              "opt_option": "Yes",
              "SPSS": "1"
            },
            {
              "opt_id": 473562,
              "opt_option": "No",
              "SPSS": "2"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2948,
          "answered_users": 2169,
          "completed_users": 2945,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 2,
          "mean": 5.706814580031696,
          "median": 3,
          "mode": 2
        },
        {
          "qs_id": 112999,
          "qs_question": "What are the age(s) and gender(s) of your children? <i>Please select all that apply.</i>",
          "SPSS": "S16",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473563,
              "opt_option": "Younger than 4-year-old boy",
              "SPSS": "1"
            },
            {
              "opt_id": 473564,
              "opt_option": "4-year-old boy",
              "SPSS": "2"
            },
            {
              "opt_id": 473565,
              "opt_option": "5-year-old boy",
              "SPSS": "3"
            },
            {
              "opt_id": 473566,
              "opt_option": "6-year-old boy",
              "SPSS": "4"
            },
            {
              "opt_id": 473567,
              "opt_option": "7-year-old boy",
              "SPSS": "5"
            },
            {
              "opt_id": 473568,
              "opt_option": "8-year-old boy",
              "SPSS": "6"
            },
            {
              "opt_id": 473569,
              "opt_option": "9-year-old boy",
              "SPSS": "7"
            },
            {
              "opt_id": 473570,
              "opt_option": "10-year-old boy",
              "SPSS": "8"
            },
            {
              "opt_id": 473571,
              "opt_option": "11-year-old boy",
              "SPSS": "9"
            },
            {
              "opt_id": 473572,
              "opt_option": "12-year-old boy",
              "SPSS": "10"
            },
            {
              "opt_id": 473573,
              "opt_option": "13-year-old boy",
              "SPSS": "11"
            },
            {
              "opt_id": 473574,
              "opt_option": "14-year-old boy",
              "SPSS": "12"
            },
            {
              "opt_id": 473575,
              "opt_option": "15-year-old boy",
              "SPSS": "13"
            },
            {
              "opt_id": 473576,
              "opt_option": "16-year-old boy",
              "SPSS": "14"
            },
            {
              "opt_id": 473577,
              "opt_option": "17-year-old boy",
              "SPSS": "15"
            },
            {
              "opt_id": 473578,
              "opt_option": "Younger than 4-year-old girl",
              "SPSS": "16"
            },
            {
              "opt_id": 473579,
              "opt_option": "4-year-old girl",
              "SPSS": "17"
            },
            {
              "opt_id": 473580,
              "opt_option": "5-year-old girl",
              "SPSS": "18"
            },
            {
              "opt_id": 473581,
              "opt_option": "6-year-old girl",
              "SPSS": "19"
            },
            {
              "opt_id": 473582,
              "opt_option": "7-year-old girl",
              "SPSS": "20"
            },
            {
              "opt_id": 473583,
              "opt_option": "8-year-old girl",
              "SPSS": "21"
            },
            {
              "opt_id": 473584,
              "opt_option": "9-year-old girl",
              "SPSS": "22"
            },
            {
              "opt_id": 473585,
              "opt_option": "10-year-old girl",
              "SPSS": "23"
            },
            {
              "opt_id": 473586,
              "opt_option": "11-year-old girl",
              "SPSS": "24"
            },
            {
              "opt_id": 473587,
              "opt_option": "12-year-old girl",
              "SPSS": "25"
            },
            {
              "opt_id": 473588,
              "opt_option": "13-year-old girl",
              "SPSS": "26"
            },
            {
              "opt_id": 473589,
              "opt_option": "14-year-old girl",
              "SPSS": "27"
            },
            {
              "opt_id": 473590,
              "opt_option": "15-year-old girl",
              "SPSS": "28"
            },
            {
              "opt_id": 473591,
              "opt_option": "16-year-old girl",
              "SPSS": "29"
            },
            {
              "opt_id": 473592,
              "opt_option": "17-year-old girl",
              "SPSS": "30"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2945,
          "answered_users": 1327,
          "completed_users": 2937,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 7,
          "mean": 15.396396396396396,
          "median": 8,
          "mode": 6
        },
        {
          "qs_id": 113000,
          "qs_question": "CODE HIDDEN VARIABLE FOR PARENT OF CHILD 13-17",
          "SPSS": "S17",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473593,
              "opt_option": "Parent of 13-17",
              "SPSS": "1"
            },
            {
              "opt_id": 473594,
              "opt_option": "Else",
              "SPSS": "99"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2938,
          "answered_users": 2938,
          "completed_users": 2937,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 113001,
          "qs_question": "CODE HIDDEN VARIABLE TO SELECT CHILD 13-17",
          "SPSS": "S18",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473595,
              "opt_option": "13-year-old boy",
              "SPSS": "1"
            },
            {
              "opt_id": 473596,
              "opt_option": "14-year-old boy",
              "SPSS": "2"
            },
            {
              "opt_id": 473597,
              "opt_option": "15-year-old boy",
              "SPSS": "3"
            },
            {
              "opt_id": 473598,
              "opt_option": "16-year-old boy",
              "SPSS": "4"
            },
            {
              "opt_id": 473599,
              "opt_option": "17-year-old boy",
              "SPSS": "5"
            },
            {
              "opt_id": 473600,
              "opt_option": "13-year-old girl",
              "SPSS": "6"
            },
            {
              "opt_id": 473601,
              "opt_option": "14-year-old girl",
              "SPSS": "7"
            },
            {
              "opt_id": 473602,
              "opt_option": "15-year-old girl",
              "SPSS": "8"
            },
            {
              "opt_id": 473603,
              "opt_option": "16-year-old girl",
              "SPSS": "9"
            },
            {
              "opt_id": 473604,
              "opt_option": "17-year-old girl",
              "SPSS": "10"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2937,
          "answered_users": 623,
          "completed_users": 2933,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 4,
          "mean": 0.6721991701244814,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 113002,
          "qs_question": "If your YYYYYYY is available, we would like them to complete the rest of the survey, which should only take 15 minutes to complete. You are welcome to be present and assist as needed. If your YYYYYYY is unavailable at this time, you may be able to complete the survey yourself.",
          "SPSS": "S19",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473605,
              "opt_option": "I will allow my XXXXXXX to participate in this survey",
              "SPSS": "1"
            },
            {
              "opt_id": 473606,
              "opt_option": "I will not allow or my XXXXXXX is not available to participate but I can continue myself",
              "SPSS": "2"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2936,
          "answered_users": 378,
          "completed_users": 2882,
          "terminated_users": 4,
          "error_terminated_users": 0,
          "dropoff_users": 41,
          "mean": 10.282722513089006,
          "median": 4,
          "mode": 2
        },
        {
          "qs_id": 113003,
          "qs_question": "Please hand over the phone to your YYYYYYY to continue with the rest of the survey.",
          "SPSS": "DISPLAY",
          "qs_type": "card",
          "options": [],
          "numerics": [],
          "grids": [],
          "total_users": 0,
          "answered_users": 0,
          "completed_users": 0,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 113004,
          "qs_question": "SAMPLE TYPE\n",
          "SPSS": "SURVEYPATH",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473607,
              "opt_option": "Generals 13-44",
              "SPSS": "1"
            },
            {
              "opt_id": 473608,
              "opt_option": "Else",
              "SPSS": "2"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2917,
          "answered_users": 2629,
          "completed_users": 2624,
          "terminated_users": 49,
          "error_terminated_users": 0,
          "dropoff_users": 239,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 113005,
          "qs_question": " child Full",
          "SPSS": " child ",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473609,
              "opt_option": "Child Available or Underage",
              "SPSS": "1"
            },
            {
              "opt_id": 473610,
              "opt_option": "Child  not Available or Underage",
              "SPSS": "2"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2580,
          "answered_users": 2580,
          "completed_users": 2574,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 113006,
          "qs_question": "AGEGROUP1",
          "SPSS": "AGEGROUP1_GENERALS",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473611,
              "opt_option": "13-17",
              "SPSS": "1"
            },
            {
              "opt_id": 473612,
              "opt_option": "18-24",
              "SPSS": "2"
            },
            {
              "opt_id": 473613,
              "opt_option": "25-34",
              "SPSS": "3"
            },
            {
              "opt_id": 473614,
              "opt_option": "35-44",
              "SPSS": "4"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2580,
          "answered_users": 2580,
          "completed_users": 2568,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 113007,
          "qs_question": "AGEGROUP2",
          "SPSS": "AGEGROUP2_GENERALS",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473615,
              "opt_option": "<25",
              "SPSS": "1"
            },
            {
              "opt_id": 473616,
              "opt_option": "25+",
              "SPSS": "2"
            },
            {
              "opt_id": 473617,
              "opt_option": "<30",
              "SPSS": "3"
            },
            {
              "opt_id": 473618,
              "opt_option": "30+",
              "SPSS": "4"
            },
            {
              "opt_id": 473619,
              "opt_option": "<35",
              "SPSS": "5"
            },
            {
              "opt_id": 473620,
              "opt_option": "35+",
              "SPSS": "6"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2580,
          "answered_users": 2580,
          "completed_users": 2574,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 113008,
          "qs_question": "AGE-GENDER CATEGORIES",
          "SPSS": "AGEGENDER_GENERALS",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473623,
              "opt_option": "Male 13-17",
              "SPSS": "1"
            },
            {
              "opt_id": 473624,
              "opt_option": "Female 13-17",
              "SPSS": "2"
            },
            {
              "opt_id": 473625,
              "opt_option": "Male 18-24",
              "SPSS": "3"
            },
            {
              "opt_id": 473626,
              "opt_option": "Female 18-24",
              "SPSS": "4"
            },
            {
              "opt_id": 473627,
              "opt_option": "Male 25-34",
              "SPSS": "5"
            },
            {
              "opt_id": 473628,
              "opt_option": "Female 25-34",
              "SPSS": "6"
            },
            {
              "opt_id": 473629,
              "opt_option": "Male 35-44",
              "SPSS": "7"
            },
            {
              "opt_id": 473630,
              "opt_option": "Female 35-44",
              "SPSS": "8"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2581,
          "answered_users": 2580,
          "completed_users": 2568,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 1,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 113009,
          "qs_question": "AGE-GENDER BINARY SPLIT AT 25 [SINGLE RESPONSE]",
          "SPSS": "AGEGENDER25_GENERALS",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473631,
              "opt_option": "Male <25",
              "SPSS": "1"
            },
            {
              "opt_id": 473632,
              "opt_option": "Male 25+",
              "SPSS": "2"
            },
            {
              "opt_id": 473633,
              "opt_option": "Female <25",
              "SPSS": "3"
            },
            {
              "opt_id": 473634,
              "opt_option": "Female 25+",
              "SPSS": "4"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2580,
          "answered_users": 2580,
          "completed_users": 2573,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 113010,
          "qs_question": "AGE-GENDER BINARY SPLIT AT 30 [SINGLE RESPONSE]",
          "SPSS": "AGEGENDER30_GENERALS",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473635,
              "opt_option": "Male <30",
              "SPSS": "1"
            },
            {
              "opt_id": 473636,
              "opt_option": "Male 30+",
              "SPSS": "2"
            },
            {
              "opt_id": 473637,
              "opt_option": "Female <30",
              "SPSS": "3"
            },
            {
              "opt_id": 473638,
              "opt_option": "Female 30+",
              "SPSS": "4"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2580,
          "answered_users": 2580,
          "completed_users": 2574,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 113011,
          "qs_question": "AGE-GENDER BINARY SPLIT AT 35 [SINGLE RESPONSE]",
          "SPSS": "AGEGENDER35_GENERALS",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473639,
              "opt_option": "Male <35",
              "SPSS": "1"
            },
            {
              "opt_id": 473640,
              "opt_option": "Male 35+",
              "SPSS": "2"
            },
            {
              "opt_id": 473641,
              "opt_option": "Female <35",
              "SPSS": "3"
            },
            {
              "opt_id": 473642,
              "opt_option": "Female 35+",
              "SPSS": "4"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2580,
          "answered_users": 2580,
          "completed_users": 2572,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 113012,
          "qs_question": "AGE-GENDER BINARY SPLIT AT 40 [SINGLE RESPONSE]",
          "SPSS": "AGEGENDER40_GENERALS",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473643,
              "opt_option": "Male <40",
              "SPSS": "1"
            },
            {
              "opt_id": 473644,
              "opt_option": "Male 40+",
              "SPSS": "2"
            },
            {
              "opt_id": 473645,
              "opt_option": "Female <40",
              "SPSS": "3"
            },
            {
              "opt_id": 473646,
              "opt_option": "Female 40+",
              "SPSS": "4"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 2580,
          "answered_users": 2580,
          "completed_users": 2570,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 0,
          "median": 0,
          "mode": 0
        },
        {
          "qs_id": 113013,
          "qs_question": "How often do you visit each of the following social media platforms?",
          "SPSS": "S20",
          "qs_type": "grid",
          "options": [
            {
              "opt_id": 473647,
              "opt_option": "Facebook",
              "SPSS": "A"
            },
            {
              "opt_id": 473648,
              "opt_option": "Instagram",
              "SPSS": "B"
            },
            {
              "opt_id": 473649,
              "opt_option": "Snapchat",
              "SPSS": "C"
            },
            {
              "opt_id": 473650,
              "opt_option": "TikTok",
              "SPSS": "D"
            },
            {
              "opt_id": 473651,
              "opt_option": "Twitter/X",
              "SPSS": "E"
            },
            {
              "opt_id": 473652,
              "opt_option": "YouTube",
              "SPSS": "F"
            }
          ],
          "numerics": [],
          "grids": [
            {
              "gr_id": 90885,
              "gr_value": "Daily",
              "SPSS": "1"
            },
            {
              "gr_id": 90886,
              "gr_value": "4-6 times a week",
              "SPSS": "2"
            },
            {
              "gr_id": 90887,
              "gr_value": "1-3 times a week",
              "SPSS": "3"
            },
            {
              "gr_id": 90888,
              "gr_value": "1-3 times a month",
              "SPSS": "4"
            },
            {
              "gr_id": 90889,
              "gr_value": "A few times a year",
              "SPSS": "5"
            },
            {
              "gr_id": 90890,
              "gr_value": "I don't visit this platform",
              "SPSS": "6"
            }
          ],
          "total_users": 2582,
          "answered_users": 2554,
          "completed_users": 1937,
          "terminated_users": 689,
          "error_terminated_users": 0,
          "dropoff_users": 21,
          "mean": 18.727078891257996,
          "median": 13,
          "mode": 12
        },
        {
          "qs_id": 113014,
          "qs_question": "GENERALS QUOTA",
          "SPSS": "QUOTA_GENERALS",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473653,
              "opt_option": "Male 13-17",
              "SPSS": "1"
            },
            {
              "opt_id": 473654,
              "opt_option": "Female 13-17",
              "SPSS": "2"
            },
            {
              "opt_id": 473655,
              "opt_option": "Male 18-24",
              "SPSS": "3"
            },
            {
              "opt_id": 473656,
              "opt_option": "Female 18-24",
              "SPSS": "4"
            },
            {
              "opt_id": 473657,
              "opt_option": "Male 25-34",
              "SPSS": "5"
            },
            {
              "opt_id": 473658,
              "opt_option": "Female 25-34",
              "SPSS": "6"
            },
            {
              "opt_id": 473659,
              "opt_option": "Male 35-44",
              "SPSS": "7"
            },
            {
              "opt_id": 473660,
              "opt_option": "Female 35-44",
              "SPSS": "8"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 1868,
          "answered_users": 1868,
          "completed_users": 1858,
          "terminated_users": 0,
          "error_terminated_users": 1,
          "dropoff_users": 0,
          "mean": 0,
          "median": 0,
          "mode": 0
        }
      ],
      "stage": 3,
      "type": "survey",
      "total_users": 5829,
      "completed_users": 944,
      "terminated_users": 3235,
      "error_terminated_users": 714,
      "dropoff_users": 936,
      "mean": 4.045375150409502,
      "median": 0,
      "mode": 0
    },
    {
      "cns_id": null,
      "cns_type": "Play",
      "cns_name": "Audio Instructions",
      "stage": 4,
      "type": "instruction",
      "total_users": 939,
      "completed_users": 938,
      "terminated_users": 0,
      "error_terminated_users": 0,
      "dropoff_users": 1
    },
    {
      "cns_id": null,
      "cns_type": "Sound Intro",
      "cns_name": "Audio Testing",
      "stage": 5,
      "type": "instruction",
      "total_users": 943,
      "completed_users": 937,
      "terminated_users": 0,
      "error_terminated_users": 0,
      "dropoff_users": 6
    },
    {
      "cns_id": null,
      "cns_name": "First Exposure",
      "stage": 7,
      "type": "exposure",
      "total_users": 938,
      "completed_users": 788,
      "terminated_users": 73,
      "error_terminated_users": 0,
      "dropoff_users": 77
    },
    {
      "cns_id": 23315,
      "cns_type": "pre",
      "cns_stage": 9,
      "cns_name": "Pre Survey",
      "questions": [
        {
          "qs_id": 112983,
          "qs_question": "Thinking back to the [CODEPLATFORM] experience you just navigated, do you recall seeing any videos/advertisements for <u><b>upcoming movies or TV series</b></u>? If yes, please list as many titles as you can remember below.",
          "SPSS": "UNAIDED_RECALL",
          "qs_type": "multiple_freetext",
          "options": [],
          "numerics": [],
          "grids": [],
          "total_users": 787,
          "answered_users": 780,
          "completed_users": 780,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 7,
          "mean": 31.32582322357019,
          "median": 22,
          "mode": 17
        },
        {
          "qs_id": 112984,
          "qs_question": "Thinking back to the [CODEPLATFORM] experience you just navigated, do you recall seeing any videos/advertisements for any food or beverage brands?  <i>If yes, please list as many as you can remember below.</i>",
          "SPSS": "UNAIDED_DUMMY_AD_RECALL",
          "qs_type": "multiple_freetext",
          "options": [],
          "numerics": [],
          "grids": [],
          "total_users": 780,
          "answered_users": 776,
          "completed_users": 777,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 3,
          "mean": 15.785095320623917,
          "median": 11,
          "mode": 8
        },
        {
          "qs_id": 112985,
          "qs_question": "Below are some possible titles for videos or advertisements that you may have seen for <b><u>upcoming movies or TV series</b></u> during the [CODEPLATFORM] experience. Please select whether you remember seeing a video for this <b><u>movie or TV series</b></u>.",
          "SPSS": "AIDED_RECALL",
          "qs_type": "grid",
          "options": [
            {
              "opt_id": 473494,
              "opt_option": "[TGT]",
              "SPSS": "A"
            },
            {
              "opt_id": 473495,
              "opt_option": "[COMP1]",
              "SPSS": "B"
            },
            {
              "opt_id": 473496,
              "opt_option": "[COMP2]",
              "SPSS": "C"
            },
            {
              "opt_id": 473497,
              "opt_option": "[COMP3]",
              "SPSS": "D"
            },
            {
              "opt_id": 473498,
              "opt_option": "Echoes of Tomorrow",
              "SPSS": "E"
            },
            {
              "opt_id": 473499,
              "opt_option": "Beneath the Surface",
              "SPSS": "F"
            }
          ],
          "numerics": [],
          "grids": [
            {
              "gr_id": 90868,
              "gr_value": "Yes, definitely",
              "SPSS": "1"
            },
            {
              "gr_id": 90869,
              "gr_value": "Maybe",
              "SPSS": "2"
            },
            {
              "gr_id": 90870,
              "gr_value": "No",
              "SPSS": "3"
            }
          ],
          "total_users": 777,
          "answered_users": 777,
          "completed_users": 681,
          "terminated_users": 96,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 18.56152512998267,
          "median": 14,
          "mode": 11
        },
        {
          "qs_id": 112986,
          "qs_question": "Below are some possible titles for videos or advertisements that you may have seen for any food or beverage brands during the [CODEPLATFORM] experience. Please select whether you remember seeing a video for this food or beverage brand.",
          "SPSS": "AIDED_DUMMY_RECALL",
          "qs_type": "grid",
          "options": [
            {
              "opt_id": 473500,
              "opt_option": "Coca-Cola",
              "SPSS": "A"
            },
            {
              "opt_id": 473501,
              "opt_option": "Oreos",
              "SPSS": "B"
            },
            {
              "opt_id": 473502,
              "opt_option": "Crumbies",
              "SPSS": "C"
            },
            {
              "opt_id": 473503,
              "opt_option": "Pringles",
              "SPSS": "D"
            }
          ],
          "numerics": [],
          "grids": [
            {
              "gr_id": 90871,
              "gr_value": "Yes, definitely",
              "SPSS": "1"
            },
            {
              "gr_id": 90872,
              "gr_value": "Maybe",
              "SPSS": "2"
            },
            {
              "gr_id": 90873,
              "gr_value": "No",
              "SPSS": "3"
            }
          ],
          "total_users": 681,
          "answered_users": 681,
          "completed_users": 630,
          "terminated_users": 51,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 8.984402079722704,
          "median": 7,
          "mode": 6
        },
        {
          "qs_id": 112987,
          "qs_question": "Before today, had you heard of any of the following upcoming movies or TV series that are coming soon?",
          "SPSS": "AWARE_NEW",
          "qs_type": "grid",
          "options": [
            {
              "opt_id": 473504,
              "opt_option": "[TGT]",
              "SPSS": "A"
            },
            {
              "opt_id": 473505,
              "opt_option": "[COMP1]",
              "SPSS": "B"
            },
            {
              "opt_id": 473506,
              "opt_option": "[COMP2]",
              "SPSS": "C"
            },
            {
              "opt_id": 473507,
              "opt_option": "[COMP3]",
              "SPSS": "D"
            },
            {
              "opt_id": 473508,
              "opt_option": "Echoes of Tomorrow",
              "SPSS": "E"
            },
            {
              "opt_id": 473509,
              "opt_option": "Beneath the Surface",
              "SPSS": "F"
            }
          ],
          "numerics": [],
          "grids": [
            {
              "gr_id": 90874,
              "gr_value": "Yes",
              "SPSS": "1"
            },
            {
              "gr_id": 90875,
              "gr_value": "No",
              "SPSS": "2"
            },
            {
              "gr_id": 90876,
              "gr_value": "Not sure",
              "SPSS": "3"
            }
          ],
          "total_users": 630,
          "answered_users": 624,
          "completed_users": 578,
          "terminated_users": 46,
          "error_terminated_users": 0,
          "dropoff_users": 6,
          "mean": 14.623916811091854,
          "median": 11,
          "mode": 10
        },
        {
          "qs_id": 112988,
          "qs_question": "For each movie you recall from the videos watched, were you able to identify where the content will be first available for viewing? <i>Please specify.</i>",
          "SPSS": "DISTRO_LINKAGE",
          "qs_type": "grid",
          "options": [
            {
              "opt_id": 473510,
              "opt_option": "[TGT]",
              "SPSS": "A"
            },
            {
              "opt_id": 473511,
              "opt_option": "[COMP1]",
              "SPSS": "B"
            },
            {
              "opt_id": 473512,
              "opt_option": "[COMP2]",
              "SPSS": "C"
            },
            {
              "opt_id": 473513,
              "opt_option": "[COMP3]",
              "SPSS": "D"
            }
          ],
          "numerics": [],
          "grids": [
            {
              "gr_id": 90877,
              "gr_value": "Yes, in the [S4]",
              "SPSS": "1"
            },
            {
              "gr_id": 90878,
              "gr_value": "Yes, on a streaming platform",
              "SPSS": "2"
            },
            {
              "gr_id": 90879,
              "gr_value": "No, I’m not sure",
              "SPSS": "3"
            }
          ],
          "total_users": 578,
          "answered_users": 577,
          "completed_users": 577,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 1,
          "mean": 12.734579439252336,
          "median": 10,
          "mode": 5
        },
        {
          "qs_id": 112989,
          "qs_question": "How interested are you in seeing each of the following movies in the [S4] when they are released?",
          "SPSS": "INTEREST1A",
          "qs_type": "grid",
          "options": [
            {
              "opt_id": 473514,
              "opt_option": "[TGT]",
              "SPSS": "A"
            },
            {
              "opt_id": 473515,
              "opt_option": "[COMP1]",
              "SPSS": "B"
            },
            {
              "opt_id": 473516,
              "opt_option": "[COMP2]",
              "SPSS": "C"
            },
            {
              "opt_id": 473517,
              "opt_option": "[COMP3]",
              "SPSS": "D"
            }
          ],
          "numerics": [],
          "grids": [
            {
              "gr_id": 90880,
              "gr_value": "Definitely will go see it",
              "SPSS": "1"
            },
            {
              "gr_id": 90881,
              "gr_value": "Probably will go see it",
              "SPSS": "2"
            },
            {
              "gr_id": 90882,
              "gr_value": "Might or might not go see it",
              "SPSS": "3"
            },
            {
              "gr_id": 90883,
              "gr_value": "Probably will not go see it",
              "SPSS": "4"
            },
            {
              "gr_id": 90884,
              "gr_value": "Definitely will not go see it",
              "SPSS": "5"
            }
          ],
          "total_users": 577,
          "answered_users": 577,
          "completed_users": 574,
          "terminated_users": 0,
          "error_terminated_users": 3,
          "dropoff_users": 0,
          "mean": 11.487001733102254,
          "median": 8,
          "mode": 7
        }
      ],
      "stage": 9,
      "type": "survey",
      "total_users": 788,
      "completed_users": 574,
      "terminated_users": 193,
      "error_terminated_users": 3,
      "dropoff_users": 18,
      "mean": 16.25118839129347,
      "median": 11,
      "mode": 7
    },
    {
      "cns_id": 23317,
      "cns_type": "forced",
      "cns_stage": 10,
      "cns_name": "Forced Exposure",
      "questions": [
        {
          "qs_id": 112979,
          "qs_question": "Based solely on the video you just viewed for <b>[TGT]</b>, how interested are you in seeing <b>[TGT]</b> in the [S4] when it is released?",
          "SPSS": "INTEREST2A_A",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473464,
              "opt_option": "Definitely will go see it",
              "SPSS": "1"
            },
            {
              "opt_id": 473465,
              "opt_option": "Probably will go see it",
              "SPSS": "2"
            },
            {
              "opt_id": 473466,
              "opt_option": "Might or might not go see it",
              "SPSS": "3"
            },
            {
              "opt_id": 473467,
              "opt_option": "Probably will not go see it",
              "SPSS": "4"
            },
            {
              "opt_id": 473468,
              "opt_option": "Definitely will not go see it",
              "SPSS": "5"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 515,
          "answered_users": 515,
          "completed_users": 515,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 8.936475409836065,
          "median": 4,
          "mode": 3
        },
        {
          "qs_id": 112980,
          "qs_question": "Where do you think you are most likely to watch <b>[TGT]</b>?",
          "SPSS": "LOCATION_A",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473469,
              "opt_option": "In a [S4]",
              "SPSS": "1"
            },
            {
              "opt_id": 473470,
              "opt_option": "At home on a streaming service or digital rental",
              "SPSS": "2"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 515,
          "answered_users": 370,
          "completed_users": 513,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 3.8916666666666666,
          "median": 3,
          "mode": 2
        },
        {
          "qs_id": 112981,
          "qs_question": "Which of the following actions, if any, would you take after watching this video for <b>[TGT]</b>? <i>Please select all that apply</i>.",
          "SPSS": "ACTION_A",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473471,
              "opt_option": "Share the video with friends or family",
              "SPSS": "1"
            },
            {
              "opt_id": 473472,
              "opt_option": "Go watch the full trailer online",
              "SPSS": "2"
            },
            {
              "opt_id": 473473,
              "opt_option": "Buy tickets or make plans to see [TGT] in [S4]",
              "SPSS": "3"
            },
            {
              "opt_id": 473474,
              "opt_option": "Watch the video again",
              "SPSS": "5"
            },
            {
              "opt_id": 473475,
              "opt_option": "Comment on the video",
              "SPSS": "6"
            },
            {
              "opt_id": 473476,
              "opt_option": "I have not engaged with any of these videos",
              "SPSS": "7"
            },
            {
              "opt_id": 473477,
              "opt_option": "Read the comments",
              "SPSS": "8"
            },
            {
              "opt_id": 473478,
              "opt_option": "Repost the video on my feed ",
              "SPSS": "9"
            },
            {
              "opt_id": 473479,
              "opt_option": "None of these",
              "SPSS": "99"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 515,
          "answered_users": 515,
          "completed_users": 489,
          "terminated_users": 27,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 65.31967213114754,
          "median": 6,
          "mode": 3
        },
        {
          "qs_id": 112976,
          "qs_question": "Based solely on the video you just viewed for <b>[COMP1]</b>, how interested are you in seeing <b>[COMP1]</b> in the [S4] when it is released?",
          "SPSS": "INTEREST2A_B",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473448,
              "opt_option": "Definitely will go see it",
              "SPSS": "1"
            },
            {
              "opt_id": 473449,
              "opt_option": "Probably will go see it",
              "SPSS": "2"
            },
            {
              "opt_id": 473450,
              "opt_option": "Might or might not go see it",
              "SPSS": "3"
            },
            {
              "opt_id": 473451,
              "opt_option": "Probably will not go see it",
              "SPSS": "4"
            },
            {
              "opt_id": 473452,
              "opt_option": "Definitely will not go see it",
              "SPSS": "5"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 515,
          "answered_users": 514,
          "completed_users": 514,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 1,
          "mean": 10.331975560081466,
          "median": 4,
          "mode": 3
        },
        {
          "qs_id": 112977,
          "qs_question": "Where do you think you are most likely to watch <b>[COMP1]</b>?",
          "SPSS": "LOCATION_B",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473453,
              "opt_option": "In a [S4]",
              "SPSS": "1"
            },
            {
              "opt_id": 473454,
              "opt_option": "At home on a streaming service or digital rental",
              "SPSS": "2"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 514,
          "answered_users": 317,
          "completed_users": 513,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 6.397394136807818,
          "median": 2,
          "mode": 2
        },
        {
          "qs_id": 112978,
          "qs_question": "Which of the following actions, if any, would you take after watching this video for <b>[COMP1]</b>? <i>Please select all that apply</i>.",
          "SPSS": "ACTION_B",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473455,
              "opt_option": "Share the video with friends or family",
              "SPSS": "1"
            },
            {
              "opt_id": 473456,
              "opt_option": "Go watch the full trailer online",
              "SPSS": "2"
            },
            {
              "opt_id": 473457,
              "opt_option": "Buy tickets or make plans to see [COMP1] in [S4]",
              "SPSS": "3"
            },
            {
              "opt_id": 473458,
              "opt_option": "Watch the video again",
              "SPSS": "5"
            },
            {
              "opt_id": 473459,
              "opt_option": "Comment on the video",
              "SPSS": "6"
            },
            {
              "opt_id": 473460,
              "opt_option": "I have not engaged with any of these videos",
              "SPSS": "7"
            },
            {
              "opt_id": 473461,
              "opt_option": "Read the comments",
              "SPSS": "8"
            },
            {
              "opt_id": 473462,
              "opt_option": "Repost the video on my feed ",
              "SPSS": "9"
            },
            {
              "opt_id": 473463,
              "opt_option": "None of these",
              "SPSS": "99"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 514,
          "answered_users": 514,
          "completed_users": 491,
          "terminated_users": 23,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 8.918533604887983,
          "median": 6,
          "mode": 4
        },
        {
          "qs_id": 112973,
          "qs_question": "Based solely on the video you just viewed for <b>[COMP2]</b>, how interested are you in seeing <b>[COMP2]</b> in the [S4] when it is released?",
          "SPSS": "INTEREST2A_C",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473432,
              "opt_option": "Definitely will go see it",
              "SPSS": "1"
            },
            {
              "opt_id": 473433,
              "opt_option": "Probably will go see it",
              "SPSS": "2"
            },
            {
              "opt_id": 473434,
              "opt_option": "Might or might not go see it",
              "SPSS": "3"
            },
            {
              "opt_id": 473435,
              "opt_option": "Probably will not go see it",
              "SPSS": "4"
            },
            {
              "opt_id": 473436,
              "opt_option": "Definitely will not go see it",
              "SPSS": "5"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 517,
          "answered_users": 516,
          "completed_users": 517,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 10.2880658436214,
          "median": 4,
          "mode": 3
        },
        {
          "qs_id": 112974,
          "qs_question": "Where do you think you are most likely to watch <b>[COMP2]</b>?",
          "SPSS": "LOCATION_C",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473437,
              "opt_option": "In a [S4]",
              "SPSS": "1"
            },
            {
              "opt_id": 473438,
              "opt_option": "At home on a streaming service or digital rental",
              "SPSS": "2"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 516,
          "answered_users": 341,
          "completed_users": 514,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 6.108433734939759,
          "median": 2,
          "mode": 2
        },
        {
          "qs_id": 112975,
          "qs_question": "Which of the following actions, if any, would you take after watching this video for <b>[COMP2]</b>? <i>Please select all that apply</i>.",
          "SPSS": "ACTION_C",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473439,
              "opt_option": "Share the video with friends or family",
              "SPSS": "1"
            },
            {
              "opt_id": 473440,
              "opt_option": "Go watch the full trailer online",
              "SPSS": "2"
            },
            {
              "opt_id": 473441,
              "opt_option": "Buy tickets or make plans to see [COMP2] in [S4]",
              "SPSS": "3"
            },
            {
              "opt_id": 473442,
              "opt_option": "Watch the video again",
              "SPSS": "5"
            },
            {
              "opt_id": 473443,
              "opt_option": "Comment on the video",
              "SPSS": "6"
            },
            {
              "opt_id": 473444,
              "opt_option": "I have not engaged with any of these videos",
              "SPSS": "7"
            },
            {
              "opt_id": 473445,
              "opt_option": "Read the comments",
              "SPSS": "8"
            },
            {
              "opt_id": 473446,
              "opt_option": "Repost the video on my feed ",
              "SPSS": "9"
            },
            {
              "opt_id": 473447,
              "opt_option": "None of these",
              "SPSS": "99"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 517,
          "answered_users": 515,
          "completed_users": 486,
          "terminated_users": 29,
          "error_terminated_users": 1,
          "dropoff_users": 1,
          "mean": 9.012345679012345,
          "median": 6,
          "mode": 4
        },
        {
          "qs_id": 112970,
          "qs_question": "Based solely on the video you just viewed for <b>[COMP3]</b>, how interested are you in seeing <b>[COMP3]</b> in the [THEATER] when it is released?",
          "SPSS": "INTEREST2A_D",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473416,
              "opt_option": "Definitely will go see it",
              "SPSS": "1"
            },
            {
              "opt_id": 473417,
              "opt_option": "Probably will go see it",
              "SPSS": "2"
            },
            {
              "opt_id": 473418,
              "opt_option": "Might or might not go see it",
              "SPSS": "3"
            },
            {
              "opt_id": 473419,
              "opt_option": "Probably will not go see it",
              "SPSS": "4"
            },
            {
              "opt_id": 473420,
              "opt_option": "Definitely will not go see it",
              "SPSS": "5"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 521,
          "answered_users": 521,
          "completed_users": 520,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 13.341414141414141,
          "median": 3,
          "mode": 3
        },
        {
          "qs_id": 112971,
          "qs_question": "Where do you think you are most likely to watch <b>[COMP3]</b>?",
          "SPSS": "LOCATION_D",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473421,
              "opt_option": "In a [S4]",
              "SPSS": "1"
            },
            {
              "opt_id": 473422,
              "opt_option": "At home on a streaming service or digital rental",
              "SPSS": "2"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 520,
          "answered_users": 374,
          "completed_users": 518,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 4.506887052341598,
          "median": 2,
          "mode": 2
        },
        {
          "qs_id": 112972,
          "qs_question": "Which of the following actions, if any, would you take after watching this video for <b>[COMP3]</b>? <i>Please select all that apply</i>.",
          "SPSS": "ACTION_D",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473423,
              "opt_option": "Share the video with friends or family",
              "SPSS": "1"
            },
            {
              "opt_id": 473424,
              "opt_option": "Go watch the full trailer online",
              "SPSS": "2"
            },
            {
              "opt_id": 473425,
              "opt_option": "Buy tickets or make plans to see [COMP3] in [S4]",
              "SPSS": "3"
            },
            {
              "opt_id": 473426,
              "opt_option": "Watch the video again",
              "SPSS": "5"
            },
            {
              "opt_id": 473427,
              "opt_option": "Comment on the video",
              "SPSS": "6"
            },
            {
              "opt_id": 473428,
              "opt_option": "I have not engaged with any of these videos",
              "SPSS": "7"
            },
            {
              "opt_id": 473429,
              "opt_option": "Read the comments",
              "SPSS": "8"
            },
            {
              "opt_id": 473430,
              "opt_option": "Repost the video on my feed ",
              "SPSS": "9"
            },
            {
              "opt_id": 473431,
              "opt_option": "None of these",
              "SPSS": "99"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 520,
          "answered_users": 520,
          "completed_users": 496,
          "terminated_users": 25,
          "error_terminated_users": 1,
          "dropoff_users": 0,
          "mean": 10.567676767676767,
          "median": 5,
          "mode": 3
        }
      ],
      "stage": 10,
      "type": "exposure",
      "total_users": 574,
      "completed_users": 457,
      "terminated_users": 104,
      "error_terminated_users": 2,
      "dropoff_users": 11,
      "mean": 13.997160166603559,
      "median": 4,
      "mode": 2
    },
    {
      "cns_id": 23316,
      "cns_type": "post",
      "cns_stage": 12,
      "cns_name": "Post Survey",
      "questions": [
        {
          "qs_id": 112969,
          "qs_question": "If the following movies are released around the same time in theaters, which would be your first choice to watch?",
          "SPSS": "FIRSTCHOICE",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473411,
              "opt_option": "[TGT]",
              "SPSS": "1"
            },
            {
              "opt_id": 473412,
              "opt_option": "[COMP1]",
              "SPSS": "2"
            },
            {
              "opt_id": 473413,
              "opt_option": "[COMP2]",
              "SPSS": "3"
            },
            {
              "opt_id": 473414,
              "opt_option": "[COMP3]",
              "SPSS": "4"
            },
            {
              "opt_id": 473415,
              "opt_option": "I would probably not watch any of these",
              "SPSS": "5"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 457,
          "answered_users": 457,
          "completed_users": 457,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 7.964523281596453,
          "median": 5,
          "mode": 5
        }
      ],
      "stage": 12,
      "type": "survey",
      "total_users": 457,
      "completed_users": 451,
      "terminated_users": 4,
      "error_terminated_users": 0,
      "dropoff_users": 2,
      "mean": 7.964523281596453,
      "median": 5,
      "mode": 5
    },
    {
      "cns_id": 23321,
      "cns_type": "third",
      "cns_stage": 13,
      "cns_name": "Third Exposure",
      "questions": [
        {
          "qs_id": 112946,
          "qs_question": "Based on the video you watched for <b>[TGT]</b>, what do you think <b>[TGT]</b> is about? <i>Please be as specific as possible to describe the overall story.</i>",
          "SPSS": "ABOUT",
          "qs_type": "freetext",
          "options": [],
          "numerics": [],
          "grids": [],
          "total_users": 452,
          "answered_users": 452,
          "completed_users": 452,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 46.30310262529833,
          "median": 29,
          "mode": 22
        },
        {
          "qs_id": 112947,
          "qs_question": "Below are some statements that could be used to describe the video you just watched for <b>[TGT]</b>. Please tell us how much you agree with each of the following statements:",
          "SPSS": "ADDESCRIPTIONS",
          "qs_type": "grid",
          "options": [
            {
              "opt_id": 473219,
              "opt_option": "The video taught me something new about [TGT]",
              "SPSS": "A"
            },
            {
              "opt_id": 473220,
              "opt_option": "The video entertained me",
              "SPSS": "B"
            },
            {
              "opt_id": 473221,
              "opt_option": "The video made me more excited to see [TGT]",
              "SPSS": "C"
            },
            {
              "opt_id": 473222,
              "opt_option": "The video was easy to understand",
              "SPSS": "D"
            }
          ],
          "numerics": [],
          "grids": [
            {
              "gr_id": 90847,
              "gr_value": "Strongly Agree",
              "SPSS": "1"
            },
            {
              "gr_id": 90848,
              "gr_value": "Somewhat Agree",
              "SPSS": "2"
            },
            {
              "gr_id": 90849,
              "gr_value": "Disagree",
              "SPSS": "3"
            }
          ],
          "total_users": 452,
          "answered_users": 451,
          "completed_users": 451,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 1,
          "mean": 12.252983293556087,
          "median": 9,
          "mode": 8
        },
        {
          "qs_id": 112948,
          "qs_question": "What did you <u>like most</u> about this video for <b>[TGT]</b>? <i>Please be as specific as possible. </i>",
          "SPSS": "LIKEMOST",
          "qs_type": "freetext",
          "options": [],
          "numerics": [],
          "grids": [],
          "total_users": 451,
          "answered_users": 442,
          "completed_users": 442,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 9,
          "mean": 61.23150357995227,
          "median": 47,
          "mode": 37
        },
        {
          "qs_id": 112949,
          "qs_question": "Was there anything you disliked or found confusing about this video for <b>[TGT]</b>? <i>Please be as specific as possible. </i>",
          "SPSS": "DISLIKE",
          "qs_type": "freetext",
          "options": [],
          "numerics": [],
          "grids": [],
          "total_users": 442,
          "answered_users": 437,
          "completed_users": 437,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 5,
          "mean": 50.618138424821005,
          "median": 39,
          "mode": 29
        },
        {
          "qs_id": 112950,
          "qs_question": "Based on this video, which of the following words or phrases do you think best describe <b>[TGT]</b>? <i>Please select all that apply.</i>",
          "SPSS": "ATTRIBUTES",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473661,
              "opt_option": "A big event",
              "SPSS": "1"
            },
            {
              "opt_id": 473662,
              "opt_option": "Cheesy",
              "SPSS": "2"
            },
            {
              "opt_id": 473663,
              "opt_option": "Cool",
              "SPSS": "3"
            },
            {
              "opt_id": 473664,
              "opt_option": "Entertaining",
              "SPSS": "4"
            },
            {
              "opt_id": 473665,
              "opt_option": "For the whole family",
              "SPSS": "5"
            },
            {
              "opt_id": 473666,
              "opt_option": "Fun",
              "SPSS": "6"
            },
            {
              "opt_id": 473667,
              "opt_option": "Funny",
              "SPSS": "7"
            },
            {
              "opt_id": 473668,
              "opt_option": "Has a good cast",
              "SPSS": "8"
            },
            {
              "opt_id": 473669,
              "opt_option": "Characters I care about",
              "SPSS": "9"
            },
            {
              "opt_id": 473670,
              "opt_option": "Has a good story",
              "SPSS": "10"
            },
            {
              "opt_id": 473671,
              "opt_option": "Heartwarming",
              "SPSS": "11"
            },
            {
              "opt_id": 473672,
              "opt_option": "Nostalgic",
              "SPSS": "12"
            },
            {
              "opt_id": 473673,
              "opt_option": "Awkward, in a good way",
              "SPSS": "13"
            },
            {
              "opt_id": 473674,
              "opt_option": "Witty",
              "SPSS": "14"
            },
            {
              "opt_id": 473675,
              "opt_option": "Unexpected, in a good way",
              "SPSS": "15"
            },
            {
              "opt_id": 473676,
              "opt_option": "Relatable",
              "SPSS": "16"
            },
            {
              "opt_id": 473677,
              "opt_option": "Predictable",
              "SPSS": "17"
            },
            {
              "opt_id": 473678,
              "opt_option": "Edgy",
              "SPSS": "18"
            },
            {
              "opt_id": 473679,
              "opt_option": "Over-the-top",
              "SPSS": "19"
            },
            {
              "opt_id": 473680,
              "opt_option": "Hilarious",
              "SPSS": "20"
            },
            {
              "opt_id": 473681,
              "opt_option": "Not funny enough",
              "SPSS": "21"
            },
            {
              "opt_id": 473682,
              "opt_option": "Out-dated",
              "SPSS": "22"
            },
            {
              "opt_id": 473683,
              "opt_option": "A must-see in theaters",
              "SPSS": "23"
            },
            {
              "opt_id": 473684,
              "opt_option": "Perfect for Thanksgiving / the holidays",
              "SPSS": "24"
            },
            {
              "opt_id": 473685,
              "opt_option": "None of these",
              "SPSS": "25"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 436,
          "answered_users": 436,
          "completed_users": 436,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 16.404306220095695,
          "median": 13,
          "mode": 6
        },
        {
          "qs_id": 112951,
          "qs_question": "Based on this video, who do you think <b>[TGT]</b> is for? <i>Please select all that apply.</i>",
          "SPSS": "AGEPERCEP",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473686,
              "opt_option": "People younger than me",
              "SPSS": "1"
            },
            {
              "opt_id": 473687,
              "opt_option": "People my age",
              "SPSS": "2"
            },
            {
              "opt_id": 473688,
              "opt_option": "People older than me",
              "SPSS": "3"
            },
            {
              "opt_id": 473689,
              "opt_option": "All ages",
              "SPSS": "4"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 437,
          "answered_users": 436,
          "completed_users": 436,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 1,
          "mean": 6.501193317422435,
          "median": 4,
          "mode": 3
        },
        {
          "qs_id": 112952,
          "qs_question": "Based on this video, who do you think <b>[TGT]</b> is for?",
          "SPSS": "GENDERPERCEP",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473690,
              "opt_option": "Mostly for men",
              "SPSS": "1"
            },
            {
              "opt_id": 473691,
              "opt_option": "Mostly for women",
              "SPSS": "2"
            },
            {
              "opt_id": 473692,
              "opt_option": "Both men and women equally",
              "SPSS": "3"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 436,
          "answered_users": 436,
          "completed_users": 436,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 4.109785202863962,
          "median": 3,
          "mode": 2
        },
        {
          "qs_id": 112953,
          "qs_question": "Based solely on this video, what made you most interested in seeing <b>[TGT]</b>? <i>Please select all that apply.</i>",
          "SPSS": "MOSTINT",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473693,
              "opt_option": "I am a fan of Robert De Niro",
              "SPSS": "1"
            },
            {
              "opt_id": 473694,
              "opt_option": "I am a fan of Ariana Grande",
              "SPSS": "2"
            },
            {
              "opt_id": 473695,
              "opt_option": "I like the previous Meet the Parents films and want to see what happens next",
              "SPSS": "3"
            },
            {
              "opt_id": 473696,
              "opt_option": "I like the rivalry between Ariana Grande and Ben Stiller",
              "SPSS": "4"
            },
            {
              "opt_id": 473697,
              "opt_option": "I like the rivalry between Robert De Niro and Ben Stiller",
              "SPSS": "5"
            },
            {
              "opt_id": 473698,
              "opt_option": "I like that Ben Stiller is now the overprotective father",
              "SPSS": "6"
            },
            {
              "opt_id": 473699,
              "opt_option": "The humor",
              "SPSS": "7"
            },
            {
              "opt_id": 473700,
              "opt_option": "It looks like a good movie to watch with family over the holidays",
              "SPSS": "8"
            },
            {
              "opt_id": 473701,
              "opt_option": "I am a fan of Ben Stiller",
              "SPSS": "9"
            },
            {
              "opt_id": 473702,
              "opt_option": "I like the relatable family dynamics",
              "SPSS": "10"
            },
            {
              "opt_id": 473703,
              "opt_option": "I like the exaggerated / over-the-top humor",
              "SPSS": "11"
            },
            {
              "opt_id": 473704,
              "opt_option": "I like the new, younger cast members",
              "SPSS": "12"
            },
            {
              "opt_id": 473705,
              "opt_option": "Other",
              "SPSS": "98"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 436,
          "answered_users": 321,
          "completed_users": 436,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 13.096774193548388,
          "median": 10,
          "mode": 5
        },
        {
          "qs_id": 112954,
          "qs_question": "Based only on this video, what made you say you <u>were not definitely interested</u> in seeing <b>[TGT]</b>? <i>Please select all that apply.</i>",
          "SPSS": "HOLDBACKS",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473706,
              "opt_option": "It might not be funny enough",
              "SPSS": "1"
            },
            {
              "opt_id": 473707,
              "opt_option": "I’m not sure I will like the story",
              "SPSS": "2"
            },
            {
              "opt_id": 473708,
              "opt_option": "I am not a fan of the Meet the Parents franchise",
              "SPSS": "3"
            },
            {
              "opt_id": 473709,
              "opt_option": "I have not seen the earlier films and feel lost",
              "SPSS": "4"
            },
            {
              "opt_id": 473710,
              "opt_option": "I don’t know enough about the characters",
              "SPSS": "5"
            },
            {
              "opt_id": 473711,
              "opt_option": "It looks too focused on cringe humor, which I do not enjoy",
              "SPSS": "6"
            },
            {
              "opt_id": 473712,
              "opt_option": "It looks too similar to the previous films in the franchise",
              "SPSS": "7"
            },
            {
              "opt_id": 473713,
              "opt_option": "It doesn’t look as good as the previous films in the franchise",
              "SPSS": "8"
            },
            {
              "opt_id": 473714,
              "opt_option": "I prefer to wait and watch this at home rather than in theaters",
              "SPSS": "9"
            },
            {
              "opt_id": 473715,
              "opt_option": "The humor feels too safe or mild",
              "SPSS": "10"
            },
            {
              "opt_id": 473716,
              "opt_option": "I don't know who I would see this with",
              "SPSS": "11"
            },
            {
              "opt_id": 473717,
              "opt_option": "The humor feels too exaggerated / over-the-top",
              "SPSS": "12"
            },
            {
              "opt_id": 473718,
              "opt_option": "It looks too cheesy",
              "SPSS": "13"
            },
            {
              "opt_id": 473719,
              "opt_option": "I’m not a fan of the cast",
              "SPSS": "14"
            },
            {
              "opt_id": 473720,
              "opt_option": "Other",
              "SPSS": "98"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 436,
          "answered_users": 252,
          "completed_users": 436,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 17.933609958506224,
          "median": 14,
          "mode": 5
        },
        {
          "qs_id": 112956,
          "qs_question": "Did you notice the music in the video for <b>[TGT]</b>?",
          "SPSS": "MUSIC1",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473287,
              "opt_option": "Yes",
              "SPSS": "1"
            },
            {
              "opt_id": 473288,
              "opt_option": "No",
              "SPSS": "2"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 436,
          "answered_users": 436,
          "completed_users": 436,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 4.928400954653938,
          "median": 4,
          "mode": 3
        },
        {
          "qs_id": 112957,
          "qs_question": "How would you rate the music in the video for <b>[TGT]</b>?",
          "SPSS": "MUSIC2",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473289,
              "opt_option": "Very appealing",
              "SPSS": "1"
            },
            {
              "opt_id": 473290,
              "opt_option": "Somewhat appealing",
              "SPSS": "2"
            },
            {
              "opt_id": 473291,
              "opt_option": "Neutral / no effect",
              "SPSS": "3"
            },
            {
              "opt_id": 473292,
              "opt_option": "Somewhat unappealing",
              "SPSS": "4"
            },
            {
              "opt_id": 473293,
              "opt_option": "Very unappealing",
              "SPSS": "5"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 436,
          "answered_users": 215,
          "completed_users": 436,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 2.9134615384615383,
          "median": 2,
          "mode": 2
        },
        {
          "qs_id": 112958,
          "qs_question": "What moment did you think was the funniest in this video for <b>[TGT]</b>? <i>Please be as specific as possible.</i>",
          "SPSS": "MOMENT",
          "qs_type": "freetext",
          "options": [],
          "numerics": [],
          "grids": [],
          "total_users": 436,
          "answered_users": 431,
          "completed_users": 432,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 4,
          "mean": 57.443914081145586,
          "median": 42,
          "mode": 51
        },
        {
          "qs_id": 112959,
          "qs_question": "How would you rate the following scene from the video for <b>[TGT]</b>?<br/>Click on the image to enlarge.<br/>",
          "SPSS": "SCENEAPPEAL",
          "qs_type": "grid",
          "options": [
            {
              "opt_id": 473975,
              "opt_option": "Cell1_Scene1",
              "SPSS": "Cell1_r1"
            },
            {
              "opt_id": 473976,
              "opt_option": "Cell1_Scene2",
              "SPSS": "Cell1_r2"
            },
            {
              "opt_id": 473977,
              "opt_option": "Cell1_Scene3",
              "SPSS": "Cell1_r3"
            },
            {
              "opt_id": 473978,
              "opt_option": "Cell1_Scene4",
              "SPSS": "Cell1_r4"
            },
            {
              "opt_id": 473979,
              "opt_option": "Cell2_Scene1",
              "SPSS": "Cell2_r1"
            },
            {
              "opt_id": 473980,
              "opt_option": "Cell2_Scene2",
              "SPSS": "Cell2_r2"
            },
            {
              "opt_id": 473981,
              "opt_option": "Cell2_Scene3",
              "SPSS": "Cell2_r3"
            },
            {
              "opt_id": 473982,
              "opt_option": "Cell2_Scene4",
              "SPSS": "Cell2_r4"
            },
            {
              "opt_id": 473983,
              "opt_option": "Cell2_Scene5",
              "SPSS": "Cell2_r5"
            },
            {
              "opt_id": 473984,
              "opt_option": "Cell2_Scene6",
              "SPSS": "Cell2_r6"
            },
            {
              "opt_id": 473985,
              "opt_option": "Cell2_Scene7",
              "SPSS": "Cell2_r7"
            },
            {
              "opt_id": 473986,
              "opt_option": "Cell2_Scene8",
              "SPSS": "Cell2_r8"
            },
            {
              "opt_id": 473987,
              "opt_option": "Cell2_Scene9",
              "SPSS": "Cell2_r9"
            },
            {
              "opt_id": 473988,
              "opt_option": "Cell3_Scene1",
              "SPSS": "Cell3_r1"
            },
            {
              "opt_id": 473989,
              "opt_option": "Cell3_Scene2",
              "SPSS": "Cell3_r2"
            },
            {
              "opt_id": 473990,
              "opt_option": "Cell3_Scene3",
              "SPSS": "Cell3_r3"
            },
            {
              "opt_id": 473991,
              "opt_option": "Cell3_Scene4",
              "SPSS": "Cell3_r4"
            },
            {
              "opt_id": 473992,
              "opt_option": "Cell3_Scene5",
              "SPSS": "Cell3_r5"
            },
            {
              "opt_id": 473993,
              "opt_option": "Cell3_Scene6",
              "SPSS": "Cell3_r6"
            },
            {
              "opt_id": 473994,
              "opt_option": "Cell3_Scene7",
              "SPSS": "Cell3_r7"
            },
            {
              "opt_id": 473995,
              "opt_option": "Cell3_Scene8",
              "SPSS": "Cell3_r8"
            },
            {
              "opt_id": 474001,
              "opt_option": "Cell5_Scene1",
              "SPSS": "Cell5_r1"
            },
            {
              "opt_id": 474002,
              "opt_option": "Cell5_Scene2",
              "SPSS": "Cell5_r2"
            },
            {
              "opt_id": 474003,
              "opt_option": "Cell5_Scene3",
              "SPSS": "Cell5_r3"
            },
            {
              "opt_id": 474004,
              "opt_option": "Cell5_Scene4",
              "SPSS": "Cell5_r4"
            },
            {
              "opt_id": 474005,
              "opt_option": "Cell6_Scene1",
              "SPSS": "Cell6_r1"
            },
            {
              "opt_id": 474006,
              "opt_option": "Cell6_Scene2",
              "SPSS": "Cell6_r2"
            },
            {
              "opt_id": 474007,
              "opt_option": "Cell6_Scene3",
              "SPSS": "Cell6_r3"
            },
            {
              "opt_id": 474008,
              "opt_option": "Cell7_Scene1",
              "SPSS": "Cell7_r1"
            },
            {
              "opt_id": 474009,
              "opt_option": "Cell7_Scene2",
              "SPSS": "Cell7_r2"
            },
            {
              "opt_id": 474010,
              "opt_option": "Cell7_Scene3",
              "SPSS": "Cell7_r3"
            },
            {
              "opt_id": 474011,
              "opt_option": "Cell7_Scene4",
              "SPSS": "Cell7_r4"
            },
            {
              "opt_id": 474012,
              "opt_option": "Cell7_Scene5",
              "SPSS": "Cell7_r5"
            },
            {
              "opt_id": 474717,
              "opt_option": "Cell4_Scene1",
              "SPSS": "Cell4_r1"
            },
            {
              "opt_id": 474718,
              "opt_option": "Cell4_Scene2",
              "SPSS": "Cell4_r2"
            },
            {
              "opt_id": 474719,
              "opt_option": "Cell4_Scene3",
              "SPSS": "Cell4_r3"
            }
          ],
          "numerics": [],
          "grids": [
            {
              "gr_id": 90850,
              "gr_value": "Love it",
              "SPSS": "1"
            },
            {
              "gr_id": 90851,
              "gr_value": "Like it",
              "SPSS": "2"
            },
            {
              "gr_id": 90852,
              "gr_value": "It’s ok",
              "SPSS": "3"
            },
            {
              "gr_id": 90853,
              "gr_value": "I dislike it",
              "SPSS": "4"
            }
          ],
          "total_users": 432,
          "answered_users": 431,
          "completed_users": 431,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 1,
          "mean": 16.305489260143197,
          "median": 12,
          "mode": 6
        },
        {
          "qs_id": 112960,
          "qs_question": "Which of the following is your <u>favorite scene</u> in the video for <b>[TGT]</b>?<br/>Click on the image to enlarge.<br/>",
          "SPSS": "FAVSCENE",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 474013,
              "opt_option": "Cell1_Scene1",
              "SPSS": "1"
            },
            {
              "opt_id": 474014,
              "opt_option": "Cell1_Scene2",
              "SPSS": "2"
            },
            {
              "opt_id": 474015,
              "opt_option": "Cell1_Scene3",
              "SPSS": "3"
            },
            {
              "opt_id": 474016,
              "opt_option": "Cell1_Scene4",
              "SPSS": "4"
            },
            {
              "opt_id": 474017,
              "opt_option": "Cell2_Scene1",
              "SPSS": "5"
            },
            {
              "opt_id": 474018,
              "opt_option": "Cell2_Scene2",
              "SPSS": "6"
            },
            {
              "opt_id": 474019,
              "opt_option": "Cell2_Scene3",
              "SPSS": "7"
            },
            {
              "opt_id": 474020,
              "opt_option": "Cell2_Scene4",
              "SPSS": "8"
            },
            {
              "opt_id": 474021,
              "opt_option": "Cell2_Scene5",
              "SPSS": "9"
            },
            {
              "opt_id": 474022,
              "opt_option": "Cell2_Scene6",
              "SPSS": "10"
            },
            {
              "opt_id": 474023,
              "opt_option": "Cell2_Scene7",
              "SPSS": "11"
            },
            {
              "opt_id": 474024,
              "opt_option": "Cell2_Scene8",
              "SPSS": "12"
            },
            {
              "opt_id": 474025,
              "opt_option": "Cell2_Scene9",
              "SPSS": "13"
            },
            {
              "opt_id": 474026,
              "opt_option": "Cell3_Scene1",
              "SPSS": "14"
            },
            {
              "opt_id": 474027,
              "opt_option": "Cell3_Scene2",
              "SPSS": "15"
            },
            {
              "opt_id": 474028,
              "opt_option": "Cell3_Scene3",
              "SPSS": "16"
            },
            {
              "opt_id": 474029,
              "opt_option": "Cell3_Scene4",
              "SPSS": "17"
            },
            {
              "opt_id": 474030,
              "opt_option": "Cell3_Scene5",
              "SPSS": "18"
            },
            {
              "opt_id": 474031,
              "opt_option": "Cell3_Scene6",
              "SPSS": "19"
            },
            {
              "opt_id": 474032,
              "opt_option": "Cell3_Scene7",
              "SPSS": "20"
            },
            {
              "opt_id": 474033,
              "opt_option": "Cell3_Scene8",
              "SPSS": "21"
            },
            {
              "opt_id": 474039,
              "opt_option": "Cell5_Scene1",
              "SPSS": "27"
            },
            {
              "opt_id": 474040,
              "opt_option": "Cell5_Scene2",
              "SPSS": "28"
            },
            {
              "opt_id": 474041,
              "opt_option": "Cell5_Scene3",
              "SPSS": "29"
            },
            {
              "opt_id": 474042,
              "opt_option": "Cell5_Scene4",
              "SPSS": "30"
            },
            {
              "opt_id": 474043,
              "opt_option": "Cell6_Scene1",
              "SPSS": "31"
            },
            {
              "opt_id": 474044,
              "opt_option": "Cell6_Scene2",
              "SPSS": "32"
            },
            {
              "opt_id": 474045,
              "opt_option": "Cell6_Scene3",
              "SPSS": "33"
            },
            {
              "opt_id": 474046,
              "opt_option": "Cell7_Scene1",
              "SPSS": "34"
            },
            {
              "opt_id": 474047,
              "opt_option": "Cell7_Scene2",
              "SPSS": "35"
            },
            {
              "opt_id": 474048,
              "opt_option": "Cell7_Scene3",
              "SPSS": "36"
            },
            {
              "opt_id": 474049,
              "opt_option": "Cell7_Scene4",
              "SPSS": "37"
            },
            {
              "opt_id": 474050,
              "opt_option": "Cell7_Scene5",
              "SPSS": "38"
            },
            {
              "opt_id": 474720,
              "opt_option": "Cell4_Scene1",
              "SPSS": "22"
            },
            {
              "opt_id": 474721,
              "opt_option": "Cell4_Scene2",
              "SPSS": "23"
            },
            {
              "opt_id": 474722,
              "opt_option": "Cell4_Scene3",
              "SPSS": "24"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 431,
          "answered_users": 431,
          "completed_users": 431,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 7.775401069518717,
          "median": 6,
          "mode": 6
        },
        {
          "qs_id": 113015,
          "qs_question": "Based on this video, how do each of the following characters impact your interest in watching [TGT] in a theater? ",
          "SPSS": "CHARACTERS",
          "qs_type": "grid",
          "options": [
            {
              "opt_id": 473721,
              "opt_option": "Greg Focker (Ben Stiller)",
              "SPSS": "A"
            },
            {
              "opt_id": 473722,
              "opt_option": "Jack Byrnes (Robert De Niro)",
              "SPSS": "B"
            },
            {
              "opt_id": 473723,
              "opt_option": "Olivia Jones (Ariana Grande)",
              "SPSS": "C"
            },
            {
              "opt_id": 473724,
              "opt_option": "Henry Focker (Skyler Gisondo)",
              "SPSS": "D"
            },
            {
              "opt_id": 473725,
              "opt_option": "Samantha Focker (Beanie Feldstein)",
              "SPSS": "E"
            },
            {
              "opt_id": 473726,
              "opt_option": "Eduardo Villalobos (Eduardo Franco)",
              "SPSS": "F"
            }
          ],
          "numerics": [],
          "grids": [
            {
              "gr_id": 90891,
              "gr_value": "More interested",
              "SPSS": "1"
            },
            {
              "gr_id": 90892,
              "gr_value": "No impact",
              "SPSS": "2"
            },
            {
              "gr_id": 90893,
              "gr_value": "Less interested",
              "SPSS": "3"
            }
          ],
          "total_users": 433,
          "answered_users": 431,
          "completed_users": 432,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 1,
          "mean": 15.35799522673031,
          "median": 13,
          "mode": 13
        },
        {
          "qs_id": 112961,
          "qs_question": "Based on this video, which of the following words or phrases do you think best describe Greg Focker (Ben Stiller)? <i>Please select all that apply</i>.",
          "SPSS": "CHARACTER_1_ADJ",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473324,
              "opt_option": "Relatable",
              "SPSS": "1"
            },
            {
              "opt_id": 473325,
              "opt_option": "A character I can root for",
              "SPSS": "2"
            },
            {
              "opt_id": 473326,
              "opt_option": "Fun to watch",
              "SPSS": "3"
            },
            {
              "opt_id": 473327,
              "opt_option": "Likeable",
              "SPSS": "4"
            },
            {
              "opt_id": 473328,
              "opt_option": "A character I want to know more about",
              "SPSS": "5"
            },
            {
              "opt_id": 473329,
              "opt_option": "Annoying",
              "SPSS": "6"
            },
            {
              "opt_id": 473330,
              "opt_option": "Cool",
              "SPSS": "7"
            },
            {
              "opt_id": 473331,
              "opt_option": "Funny",
              "SPSS": "8"
            },
            {
              "opt_id": 473332,
              "opt_option": "Determined",
              "SPSS": "9"
            },
            {
              "opt_id": 473333,
              "opt_option": "Not funny enough",
              "SPSS": "10"
            },
            {
              "opt_id": 473334,
              "opt_option": "Boring",
              "SPSS": "11"
            },
            {
              "opt_id": 473335,
              "opt_option": "Cringeworthy",
              "SPSS": "12"
            },
            {
              "opt_id": 473336,
              "opt_option": "Overbearing",
              "SPSS": "13"
            },
            {
              "opt_id": 473337,
              "opt_option": "Awkward, in a funny way",
              "SPSS": "14"
            },
            {
              "opt_id": 473338,
              "opt_option": "Hilarious",
              "SPSS": "15"
            },
            {
              "opt_id": 473855,
              "opt_option": "Mean",
              "SPSS": "16"
            },
            {
              "opt_id": 473856,
              "opt_option": "Weird",
              "SPSS": "17"
            },
            {
              "opt_id": 473857,
              "opt_option": "None of these",
              "SPSS": "18"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 429,
          "answered_users": 429,
          "completed_users": 429,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 19.3444976076555,
          "median": 9,
          "mode": 5
        },
        {
          "qs_id": 112962,
          "qs_question": "Based on this video, which of the following words or phrases do you think best describe Jack Byrnes (Robert De Niro)? <i>Please select all that apply</i>.",
          "SPSS": "CHARACTER_2_ADJ",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473340,
              "opt_option": "Relatable",
              "SPSS": "1"
            },
            {
              "opt_id": 473341,
              "opt_option": "A character I can root for",
              "SPSS": "2"
            },
            {
              "opt_id": 473342,
              "opt_option": "Fun to watch",
              "SPSS": "3"
            },
            {
              "opt_id": 473343,
              "opt_option": "Likeable",
              "SPSS": "4"
            },
            {
              "opt_id": 473344,
              "opt_option": "A character I want to know more about",
              "SPSS": "5"
            },
            {
              "opt_id": 473345,
              "opt_option": "Annoying",
              "SPSS": "6"
            },
            {
              "opt_id": 473346,
              "opt_option": "Cool",
              "SPSS": "7"
            },
            {
              "opt_id": 473347,
              "opt_option": "Funny",
              "SPSS": "8"
            },
            {
              "opt_id": 473348,
              "opt_option": "Confident",
              "SPSS": "9"
            },
            {
              "opt_id": 473349,
              "opt_option": "Not funny enough",
              "SPSS": "10"
            },
            {
              "opt_id": 473350,
              "opt_option": "Too serious",
              "SPSS": "11"
            },
            {
              "opt_id": 473351,
              "opt_option": "Boring",
              "SPSS": "12"
            },
            {
              "opt_id": 473352,
              "opt_option": "Overbearing",
              "SPSS": "13"
            },
            {
              "opt_id": 473353,
              "opt_option": "Hilarious",
              "SPSS": "14"
            },
            {
              "opt_id": 473908,
              "opt_option": "None of these",
              "SPSS": "15"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 429,
          "answered_users": 429,
          "completed_users": 429,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 8.717703349282298,
          "median": 7,
          "mode": 3
        },
        {
          "qs_id": 112963,
          "qs_question": "Based on this video, which of the following words or phrases do you think best describe Olivia Jones (Ariana Grande)? <i>Please select all that apply</i>.",
          "SPSS": "CHARACTER_3_ADJ",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473355,
              "opt_option": "Relatable",
              "SPSS": "1"
            },
            {
              "opt_id": 473356,
              "opt_option": "A character I can root for",
              "SPSS": "2"
            },
            {
              "opt_id": 473357,
              "opt_option": "Fun to watch",
              "SPSS": "3"
            },
            {
              "opt_id": 473358,
              "opt_option": "Likeable",
              "SPSS": "4"
            },
            {
              "opt_id": 473359,
              "opt_option": "A character I want to know more about",
              "SPSS": "5"
            },
            {
              "opt_id": 473360,
              "opt_option": "Annoying",
              "SPSS": "6"
            },
            {
              "opt_id": 473361,
              "opt_option": "Cool",
              "SPSS": "7"
            },
            {
              "opt_id": 473362,
              "opt_option": "Funny",
              "SPSS": "8"
            },
            {
              "opt_id": 473363,
              "opt_option": "Confident",
              "SPSS": "9"
            },
            {
              "opt_id": 473364,
              "opt_option": "Determined",
              "SPSS": "10"
            },
            {
              "opt_id": 473365,
              "opt_option": "Not funny enough",
              "SPSS": "11"
            },
            {
              "opt_id": 473366,
              "opt_option": "Too serious",
              "SPSS": "12"
            },
            {
              "opt_id": 473367,
              "opt_option": "Boring",
              "SPSS": "13"
            },
            {
              "opt_id": 473368,
              "opt_option": "Hilarious",
              "SPSS": "14"
            },
            {
              "opt_id": 473369,
              "opt_option": "Mean",
              "SPSS": "15"
            },
            {
              "opt_id": 473370,
              "opt_option": "A good role for Ariana Grande",
              "SPSS": "16"
            },
            {
              "opt_id": 473858,
              "opt_option": "Strong / able to hold her own",
              "SPSS": "17"
            },
            {
              "opt_id": 473859,
              "opt_option": "None of these",
              "SPSS": "18"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 429,
          "answered_users": 429,
          "completed_users": 429,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 8.916267942583731,
          "median": 7,
          "mode": 4
        },
        {
          "qs_id": 113016,
          "qs_question": "Which of the following character relationships makes you most interested in watching <b>[TGT]</b>? ",
          "SPSS": "RELATIONSHIPS",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473732,
              "opt_option": "Greg (Ben Stiller) and Jack (Robert De Niro)",
              "SPSS": "1"
            },
            {
              "opt_id": 473733,
              "opt_option": "Greg (Ben Stiller) and Olivia (Ariana Grande)",
              "SPSS": "2"
            },
            {
              "opt_id": 473734,
              "opt_option": "Jack (Robert De Niro) and Olivia (Ariana Grande)",
              "SPSS": "3"
            },
            {
              "opt_id": 473735,
              "opt_option": "Greg (Ben Stiller), Jack (Robert De Niro), and Olivia (Ariana Grande)",
              "SPSS": "4"
            },
            {
              "opt_id": 473736,
              "opt_option": "None of these interest me ",
              "SPSS": "5"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 430,
          "answered_users": 429,
          "completed_users": 430,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 7.744630071599046,
          "median": 6,
          "mode": 5
        },
        {
          "qs_id": 113017,
          "qs_question": "Before today, did you know that <b>[TGT]</b> is the next movie in the <i>Meet the Parents</i> series (<i>Meet the Parents, Meet the Fockers, Little Fockers</i>)?",
          "SPSS": "FRANCHISE_LINK",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473740,
              "opt_option": "Yes",
              "SPSS": "1"
            },
            {
              "opt_id": 473741,
              "opt_option": "No",
              "SPSS": "2"
            },
            {
              "opt_id": 473742,
              "opt_option": "I wasn’t sure",
              "SPSS": "3"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 430,
          "answered_users": 430,
          "completed_users": 430,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 7.4677804295942725,
          "median": 5,
          "mode": 4
        },
        {
          "qs_id": 112964,
          "qs_question": "Does knowing <b>[TGT]</b> is part of the <i>Meet the Parents</i> series make you more or less interested in seeing it in theaters? ",
          "SPSS": "FRANCHISE_IMPACT",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473743,
              "opt_option": "Much more",
              "SPSS": "1"
            },
            {
              "opt_id": 473744,
              "opt_option": "Somewhat more",
              "SPSS": "2"
            },
            {
              "opt_id": 473745,
              "opt_option": "No difference",
              "SPSS": "3"
            },
            {
              "opt_id": 473746,
              "opt_option": "Somewhat less",
              "SPSS": "4"
            },
            {
              "opt_id": 473747,
              "opt_option": "Much less",
              "SPSS": "5"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 430,
          "answered_users": 430,
          "completed_users": 430,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 5.059665871121719,
          "median": 4,
          "mode": 2
        },
        {
          "qs_id": 113018,
          "qs_question": "The new GTA video game – Grand Theft Auto VI – comes out right around the same time that <b>[TGT]</b> comes out in theaters. If you could only pick one, which would you choose to do?",
          "SPSS": "GTA",
          "qs_type": "single",
          "options": [
            {
              "opt_id": 473748,
              "opt_option": "Play Grand Theft Auto VI",
              "SPSS": "1"
            },
            {
              "opt_id": 473749,
              "opt_option": "See [TGT] in a theater",
              "SPSS": "2"
            },
            {
              "opt_id": 473750,
              "opt_option": "Neither of these",
              "SPSS": "3"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 430,
          "answered_users": 429,
          "completed_users": 429,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 1,
          "mean": 7.4749403341288785,
          "median": 6,
          "mode": 2
        },
        {
          "qs_id": 112965,
          "qs_question": "How do you feel about the following types of movies?",
          "SPSS": "MOVGENRE",
          "qs_type": "grid",
          "options": [
            {
              "opt_id": 473751,
              "opt_option": "Action",
              "SPSS": "A"
            },
            {
              "opt_id": 473752,
              "opt_option": "Animation",
              "SPSS": "B"
            },
            {
              "opt_id": 473753,
              "opt_option": "Comedy",
              "SPSS": "C"
            },
            {
              "opt_id": 473754,
              "opt_option": "Drama",
              "SPSS": "D"
            },
            {
              "opt_id": 473755,
              "opt_option": "Sci-Fi",
              "SPSS": "E"
            }
          ],
          "numerics": [],
          "grids": [
            {
              "gr_id": 90854,
              "gr_value": "One of my favorite genres",
              "SPSS": "1"
            },
            {
              "gr_id": 90855,
              "gr_value": "I like this genre",
              "SPSS": "2"
            },
            {
              "gr_id": 90856,
              "gr_value": "I do not like this genre that much",
              "SPSS": "3"
            },
            {
              "gr_id": 90857,
              "gr_value": "I do not like this genre at all",
              "SPSS": "4"
            }
          ],
          "total_users": 419,
          "answered_users": 419,
          "completed_users": 419,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 11.522673031026253,
          "median": 10,
          "mode": 10
        },
        {
          "qs_id": 112967,
          "qs_question": "Which of the following, if any, have you seen? Please select all that apply.",
          "SPSS": "SEEN",
          "qs_type": "multiple",
          "options": [
            {
              "opt_id": 473756,
              "opt_option": "Meet the Parents",
              "SPSS": "1"
            },
            {
              "opt_id": 473757,
              "opt_option": "Meet the Fockers",
              "SPSS": "2"
            },
            {
              "opt_id": 473758,
              "opt_option": "Little Fockers",
              "SPSS": "3"
            },
            {
              "opt_id": 473759,
              "opt_option": "The Hunger Games",
              "SPSS": "4"
            },
            {
              "opt_id": 473760,
              "opt_option": "The Hunger Games: The Ballad of Songbirds & Snakes",
              "SPSS": "5"
            },
            {
              "opt_id": 473761,
              "opt_option": "Inside Out 2",
              "SPSS": "6"
            },
            {
              "opt_id": 473762,
              "opt_option": "Moana 2",
              "SPSS": "7"
            },
            {
              "opt_id": 473763,
              "opt_option": "Zootopia 2",
              "SPSS": "8"
            },
            {
              "opt_id": 473764,
              "opt_option": "None of these",
              "SPSS": "9"
            }
          ],
          "numerics": [],
          "grids": [],
          "total_users": 419,
          "answered_users": 419,
          "completed_users": 419,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 12.279236276849643,
          "median": 10,
          "mode": 9
        },
        {
          "qs_id": 112966,
          "qs_question": "How do you feel about each of the following franchises?",
          "SPSS": "FRANCHISE",
          "qs_type": "grid",
          "options": [
            {
              "opt_id": 473382,
              "opt_option": "Meet the Parents",
              "SPSS": "A"
            },
            {
              "opt_id": 473383,
              "opt_option": "The Hunger Games",
              "SPSS": "B"
            },
            {
              "opt_id": 473384,
              "opt_option": "A Christmas Carol",
              "SPSS": "C"
            }
          ],
          "numerics": [],
          "grids": [
            {
              "gr_id": 90858,
              "gr_value": "I'm a big fan",
              "SPSS": "1"
            },
            {
              "gr_id": 90859,
              "gr_value": "I am somewhat of a fan",
              "SPSS": "2"
            },
            {
              "gr_id": 90860,
              "gr_value": "I am not much of a fan",
              "SPSS": "3"
            },
            {
              "gr_id": 90861,
              "gr_value": "I dislike it",
              "SPSS": "4"
            },
            {
              "gr_id": 90862,
              "gr_value": "I've never heard of it",
              "SPSS": "5"
            }
          ],
          "total_users": 419,
          "answered_users": 419,
          "completed_users": 419,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 0,
          "mean": 9.732696897374701,
          "median": 7,
          "mode": 7
        },
        {
          "qs_id": 112968,
          "qs_question": "How do you feel about each of the following actors?",
          "SPSS": "ACTORS",
          "qs_type": "grid",
          "options": [
            {
              "opt_id": 473773,
              "opt_option": "Robert De Niro",
              "SPSS": "A"
            },
            {
              "opt_id": 473774,
              "opt_option": "Ben Stiller",
              "SPSS": "B"
            },
            {
              "opt_id": 473775,
              "opt_option": "Ariana Grande",
              "SPSS": "C"
            },
            {
              "opt_id": 473776,
              "opt_option": "Owen Wilson",
              "SPSS": "D"
            },
            {
              "opt_id": 473777,
              "opt_option": "Skyler Gisondo",
              "SPSS": "E"
            },
            {
              "opt_id": 473778,
              "opt_option": "Beanie Feldstein",
              "SPSS": "F"
            },
            {
              "opt_id": 473779,
              "opt_option": "Eduardo Villalobos (Eduardo Franco)",
              "SPSS": "G"
            },
            {
              "opt_id": 473780,
              "opt_option": "Johnny Depp",
              "SPSS": "H"
            }
          ],
          "numerics": [],
          "grids": [
            {
              "gr_id": 90863,
              "gr_value": "I'm a big fan",
              "SPSS": "1"
            },
            {
              "gr_id": 90864,
              "gr_value": "I am somewhat of a fan",
              "SPSS": "2"
            },
            {
              "gr_id": 90865,
              "gr_value": "I am not much of a fan",
              "SPSS": "3"
            },
            {
              "gr_id": 90866,
              "gr_value": "I dislike them",
              "SPSS": "4"
            },
            {
              "gr_id": 90867,
              "gr_value": "I am not familiar with them",
              "SPSS": "5"
            }
          ],
          "total_users": 421,
          "answered_users": 419,
          "completed_users": 419,
          "terminated_users": 0,
          "error_terminated_users": 0,
          "dropoff_users": 2,
          "mean": 17.7708830548926,
          "median": 16,
          "mode": 13
        }
      ],
      "stage": 13,
      "type": "exposure",
      "total_users": 454,
      "completed_users": 419,
      "terminated_users": 10,
      "error_terminated_users": 0,
      "dropoff_users": 25,
      "mean": 17.645694404175124,
      "median": 9,
      "mode": 3
    },
    {
      "cns_id": null,
      "cns_name": "Thankyou Page",
      "stage": 14,
      "type": "thankyou",
      "total_users": 419,
      "completed_users": 303,
      "terminated_users": 2,
      "error_terminated_users": 0,
      "dropoff_users": 0
    }
  ]
}

stageByData: any = signal([]);
  selectedStage: any;


constructor(
  private api: Api,
  private router: Router,
  private route: ActivatedRoute,
  private http: HttpClient
) {
  const survey = localStorage.getItem('selectedSurvey');

  this.selectedSurvey.set(JSON.parse(survey ?? 'null'));

  this.route.queryParams.subscribe(params => {
    this.selectedSurveyId = Number(params['study_id']);

    if (this.selectedSurveyId) {
      this.getperContentStats(this.selectedSurveyId);
    }
  });
}

  selectTab(tab: string): void {
    this.selectedTab.set(tab);
  }

getperContentStats(
  studyId: number,
  cntId?: number,
  cnqId?: number | string
): void {

  this.loader.set(true);

  const params = new URLSearchParams({
    study_id: String(studyId)
  });

  if (cntId != null) {
    params.set('cnt_id', String(cntId));
  }

  if (cnqId != null && cnqId !== 'all') {
    params.set('cnq_id', String(cnqId));
  }

  this.api.getApi(`perContentStats?${params.toString()}`).subscribe({
    next: (response: any) => {
      if (response.error) return;

      // Initial request: load available cells.
      if (cntId == null) {
        const cells = response.data ?? [];

        this.allCells.set(cells);

        if (cells.length > 0) {
          this.selectedCell.set(cells[0]);
          this.qoutaGroups.set(cells[0].quotas ?? []);
          this.selectedqoutaGroup.set('all');
          console.log(cells[0]);
          

          this.updateMetrics(cells[0]);
          this.loadCellData(cells[0].cnt_id);
        }

        return;
      }

      // Cell/quota request: update metrics only.
      const metricData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      if (metricData) {
        this.updateMetrics(metricData);
      }
    },
    error: (error: any) => {
      console.error('Error fetching content stats:', error);
    }
  });
}
getStageByData(
  studyId: number,
  cntId: number,
  cnqId?: number | string
): void {
  const params = new URLSearchParams({
    study_id: String(studyId),
    cnt_id: String(cntId)
  });

  if (cnqId != null && cnqId !== 'all') {
    params.set('cnq_id', String(cnqId));
  }

  this.api.getApi(`perStageStats?${params.toString()}`).subscribe({
    next: (response: any) => {
      if (response.error) return;

      //       const stages = (this.responseStages.data ?? []).map((stage: any) => ({
      //   ...stage,
      //   screen: stage.questions?.length ?? 1
      // }));

      const stages = (response.data ?? []).map((stage: any) => ({
        ...stage,
        screen: stage.questions?.length ?? 1
      }));

      this.stageByData.set(stages);
      this.loader.set(false);
    },
    error: (error: any) => {
      console.error('Error fetching stage stats:', error);
      this.loader.set(false);
      
    }
  });
}

selectCell(cell: any): void {
  if (!cell) return;

  this.selectedCell.set(cell);
  this.qoutaGroups.set(cell.quotas ?? []);
  this.selectedqoutaGroup.set('all');

  this.loadCellData(cell.cnt_id);
}

selectQoutaGroup(cnqId: number | string): void {
  this.selectedqoutaGroup.set(cnqId);

  const cell = this.selectedCell();
  if (!cell) return;

  this.loadCellData(
    cell.cnt_id,
    cnqId === 'all' ? undefined : cnqId
  );
}

private loadCellData(
  cntId: number,
  cnqId?: number | string
): void {
  if (!this.selectedSurveyId || !cntId) return;

  this.getperContentStats(
    this.selectedSurveyId,
    cntId,
    cnqId
  );

  this.getStageByData(
    this.selectedSurveyId,
    cntId,
    cnqId
  );

  this.getTerminationData(
    this.selectedSurveyId,
    cntId,
    cnqId
  );
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

getTerminationData(
  studyId: number,
  cntId?: number,
  cnqId?: number | string
): void {
  const params = new URLSearchParams({
    study_id: String(studyId)
  });

  if (cntId != null) {
    params.set('cnt_id', String(cntId));
  }

  if (cnqId != null && cnqId !== 'all') {
    params.set('cnq_id', String(cnqId));
  }

  // this.userLoader.set(true);

  this.api.getApi(`studyUserStatus?${params.toString()}`).subscribe({
    next: (response: any) => {
      if (!response.error) {
        this.usersData.set(response.data.users ?? []);

        this.surveyData = [...(response.data.surveys ?? [])];

        this.categories = this.surveyData.map(
          (category: any) => category.cns_name
        );

        this.allQuestions = this.surveyData.flatMap(
          (category: any) =>
            (category.questions ?? []).map((question: any) => ({
              category: category.cns_name,
              question: question.qs_question,
              ...question
            }))
        );
      }

      this.userLoader.set(false);
    },
    error: (error: any) => {
      console.error('Error fetching respondent data:', error);
      this.userLoader.set(false);
    }
  });
}

onStageSelected(stage: any): void {
  this.selectedStage = stage;
  // this.showQuestionDecay = true;
  this.selectedTab.set('question-decay')
}

}
