import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomPlanningComponent } from './roomplanning';

describe('Roomplanning', () => {
  let component: RoomPlanningComponent;
  let fixture: ComponentFixture<RoomPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
