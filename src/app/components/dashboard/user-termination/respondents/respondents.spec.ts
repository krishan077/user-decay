import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Respondents } from './respondents';

describe('Respondents', () => {
  let component: Respondents;
  let fixture: ComponentFixture<Respondents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Respondents],
    }).compileComponents();

    fixture = TestBed.createComponent(Respondents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
