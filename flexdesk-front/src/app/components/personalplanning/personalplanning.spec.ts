import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPlanningComponent } from './personalplanning';

describe('Personalplanning', () => {
  let component: PersonalPlanningComponent;
  let fixture: ComponentFixture<PersonalPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
