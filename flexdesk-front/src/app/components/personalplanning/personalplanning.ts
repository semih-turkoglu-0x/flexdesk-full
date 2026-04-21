import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { 
  CalendarEvent,
  CalendarView,
  CalendarMonthViewComponent,
  CalendarWeekViewComponent,
  CalendarDayViewComponent,
  CalendarDatePipe,
  CalendarDateFormatter,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivityService } from '../../services/activity';
import { Activity } from '../../core/models';
import { ActivityFormComponent } from '../activity-form/activity-form';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';
import { CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective } from 'angular-calendar';
import { CustomDateFormatter } from '../../providers/custom-date-formatter.provider';


@Component({
  selector: 'app-personal-planning',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule, 
    MatButtonModule,
    MatDialogModule,
    
    CalendarMonthViewComponent, 
    CalendarWeekViewComponent, 
    CalendarDayViewComponent, 
    CalendarDatePipe,

    CalendarPreviousViewDirective, 
    CalendarTodayDirective, 
    CalendarNextViewDirective, 
  ],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  templateUrl: './personalplanning.html',
  styleUrl: './personalplanning.css'
})
export class PersonalPlanningComponent implements OnInit {

  readonly CalendarView = CalendarView; 
  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();
  
  calendarEvents: CalendarEvent[] = [];

  constructor(
    private activityService: ActivityService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchActivities();
  }
  
  setView(view: CalendarView) {
    this.view = view;
  }

  fetchActivities(): void {
    this.activityService.getMyActivities().subscribe({
      next: (activities: Activity[]) => {
        this.calendarEvents = activities.map(activity => {
          const start = new Date(activity.activityTime);
          const end = activity.endTime ? new Date(activity.endTime) : new Date(start.getTime() + (60 * 60 * 1000));
          return {
            start,
            end,
            title: `${activity.activityName} (${activity.category})`,
            color: { 
              primary: '#28a745',
              secondary: '#d4edda'
            },
            draggable: true,
            resizable: { beforeStart: true, afterEnd: true },
            meta: activity
          };
        });
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching activities:', err);
      }
    });
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    
    const activity = event.meta as Activity;
    const updatedActivity: Partial<Activity> = {
      activityTime: newStart,
      endTime: newEnd
    };

    this.activityService.updateActivity(activity.activityId, updatedActivity).subscribe({
      next: () => {
        console.log('Activity updated');
        this.fetchActivities();
      },
      error: (err) => console.error('Update failed', err)
    });
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    const activity = event.meta as Activity;
    this.dialog.open(ActivityDetailsComponent, {
      width: '500px',
      data: { activity }
    });
  }

  openAddActivityDialog(): void {
    const dialogRef = this.dialog.open(ActivityFormComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchActivities();
      }
    });
  }
}
