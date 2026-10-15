import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTermination } from './user-termination';

describe('UserTermination', () => {
  let component: UserTermination;
  let fixture: ComponentFixture<UserTermination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTermination],
    }).compileComponents();

    fixture = TestBed.createComponent(UserTermination);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
