
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface QuestionOption {
  opt_id: number;
  opt_option: string;
  SPSS: string;
}

interface QuestionData {
  qs_id: number;
  qs_question: string;
  SPSS: string;
  qs_type: string;
  options: QuestionOption[];
  numerics: unknown[];
  grids: unknown[];
  total_users: number;
  completed_users: number;
  discarded_users: number;
  terminated_users: number;
  overquota_users: number;
  dropoff_users: number;
  median: number;
  p90?: number | string;
  breakdowns?: QuestionBreakdown[];
}

interface FlatQuestion extends QuestionData {
  stage: string;
}

interface QuestionBreakdownItem {
  label: string;
  decay: number;
  count: number;
}

interface QuestionBreakdown {
  title: string;
  color?: 'blue' | 'orange';
  items: QuestionBreakdownItem[];
}

@Component({
  selector: 'app-question-decay',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './question-decay.html',
  styleUrl: './question-decay.css',
})
export class QuestionDecay implements OnChanges {
  searchQuery = '';
  allQuestions: FlatQuestion[] = [];

  @Input() stageByData: any[] = [];

  selectedCategory = 'All stages';
  activeTab: 'served' | 'loss' = 'served';

  currentPage = 1;
  pageSize = 10;
  @Input() selectedStage: any | null = null;

  selectedQuestion = signal<FlatQuestion | null>(null);
  showQuestionDetail = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stageByData']) {
      this.allQuestions = (this.stageByData ?? []).flatMap(stage =>
        (stage.questions ?? []).map((q: QuestionData) => ({
          ...q,
          stage: stage.cns_name
        }))
      );

      const previousId = this.selectedQuestion()?.qs_id;

      this.selectedQuestion.set(
        this.allQuestions.find(q => q.qs_id === previousId)
        ?? this.allQuestions[0]
        ?? null
      );

      this.currentPage = 1;
    }

    if (changes['selectedStage']) {
      this.selectedCategory = this.selectedStage ?? 'All stages';
      this.currentPage = 1;
    }
  }
  get filteredQuestions(): FlatQuestion[] {
    const term = this.searchQuery.toLowerCase().trim();

    return this.allQuestions.filter(q => {
      const matchCategory =
        this.selectedCategory === 'All stages' ||
        q.stage === this.selectedCategory;

      const matchSearch =
        !term ||
        (q.qs_question ?? '').toLowerCase().includes(term) ||
        (q.SPSS ?? '').toLowerCase().includes(term) ||
        (q.stage ?? '').toLowerCase().includes(term);

      // Served = all questions with a reported base.
      // Loss only = questions where at least one respondent was lost.
      const lost = this.getLost(q);
      const matchTab =
        this.activeTab === 'served'
          ? q.total_users > 0
          : lost > 0;

      return matchCategory && matchSearch && matchTab;
    });
  }

  getLost(question: FlatQuestion): number {
    return (
      (question.dropoff_users ?? 0) +
      (question.discarded_users ?? 0) +
      (question.terminated_users ?? 0) +
      (question.overquota_users ?? 0)
    );
  }

  getCoverage(question: FlatQuestion): number {
    // Coverage relative to this question's own reported base.
    return question.total_users > 0 ? 100 : 0;
  }

  getDecay(question: FlatQuestion): number {
    const base = question.total_users ?? 0;

    return base > 0
      ? (this.getLost(question) / base) * 100
      : 0;
  }

  getLossMix(question: FlatQuestion): {
    dropoff: number;
    discarded: number;
    terminated: number;
    overquota: number;
  } {
    return {
      dropoff: question.dropoff_users ?? 0,
      discarded: question.discarded_users ?? 0,
      terminated: question.terminated_users ?? 0,
      overquota: question.overquota_users ?? 0
    };
  }

  getLossMixWidth(
    question: FlatQuestion,
    type: 'dropoff' | 'discarded' | 'terminated' | 'overquota'
  ): number {
    const base = question.total_users ?? 0;

    if (base <= 0) return 0;

    const mix = this.getLossMix(question);
    return (mix[type] / base) * 100;
  }

  getOfAllLoss(question: FlatQuestion): number {
    const totalLoss = this.filteredQuestions.reduce(
      (sum, q) => sum + this.getLost(q),
      0
    );

    return totalLoss > 0
      ? (this.getLost(question) / totalLoss) * 100
      : 0;
  }

  getFlag(question: FlatQuestion): 'ok' | 'critical' {
    // Placeholder rule: flag decay >= 50% as critical.
    return this.getDecay(question) >= 50 ? 'critical' : 'ok';
  }

  setTab(tab: 'served' | 'loss'): void {
    this.activeTab = tab;
    this.onFilterChange();
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredQuestions.length / this.pageSize) || 1;
  }

  get paginatedQuestions(): FlatQuestion[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredQuestions.slice(startIndex, startIndex + this.pageSize);
  }

  get startRecord(): number {
    return this.filteredQuestions.length === 0
      ? 0
      : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredQuestions.length
    );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  selectQuestion(question: FlatQuestion): void {
    this.selectedQuestion.set(question);
    this.showQuestionDetail = true;
  }

  closeQuestionDetail(): void {
    this.showQuestionDetail = false;
  }
}
