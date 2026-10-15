import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface FlatQuestion {
  category: string;
  question: string;
  spss: string;
  type: string;
}


@Component({
  selector: 'app-question-decay',
  imports: [FormsModule, CommonModule],
  templateUrl: './question-decay.html',
  styleUrl: './question-decay.css',
})
export class QuestionDecay {
  searchQuery: string = '';
  @Input() allQuestions: FlatQuestion[] = [];
  @Input() categories: string[] = [];
  selectedCategory: string = 'All stages';
  activeTab: 'served' | 'loss' = 'served';
  currentPage: number = 1;
  pageSize: number = 10;
  totalScreens: number = 69;

  ngOnChanges(){
    console.log(this.allQuestions);
  }

  get filteredQuestions(): FlatQuestion[] {
    const term = this.searchQuery.toLowerCase().trim();
    return this.allQuestions.filter(q => {
      const matchCategory = this.selectedCategory === 'All stages' || q.category === this.selectedCategory;
      const matchSearch = !term || q.question.toLowerCase().includes(term) || q.spss.toLowerCase().includes(term);
      return matchCategory && matchSearch;
    });
  }

    setTab(tab: 'served' | 'loss'): void {
    this.activeTab = tab;
    this.onFilterChange();
  }

  get totalPages(): number {
      return Math.ceil(this.filteredQuestions.length / this.pageSize) || 1;
    }
  
    get paginatedQuestions(): FlatQuestion[] {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredQuestions.slice(startIndex, endIndex);
    }
  
    get startRecord(): number {
      if (this.filteredQuestions.length === 0) return 0;
      return (this.currentPage - 1) * this.pageSize + 1;
    }
  
    get endRecord(): number {
      const end = this.currentPage * this.pageSize;
      return end > this.filteredQuestions.length ? this.filteredQuestions.length : end;
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
  
    onFilterChange(): void {
      this.currentPage = 1;
    }
  
}
