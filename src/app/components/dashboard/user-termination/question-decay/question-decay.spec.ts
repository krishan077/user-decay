import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDecay } from './question-decay';

describe('QuestionDecay', () => {
  let component: QuestionDecay;
  let fixture: ComponentFixture<QuestionDecay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionDecay],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionDecay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
