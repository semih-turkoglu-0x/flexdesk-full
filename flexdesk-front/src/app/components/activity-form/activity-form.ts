import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivityService } from '../../services/activity';
import { Activity } from '../../core/models';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './activity-form.html',
  styleUrl: './activity-form.css'
})
export class ActivityFormComponent implements OnInit {

  @Output() activityAdded = new EventEmitter<Activity>();
  
  activityForm!: FormGroup;
  
  categories = ['Réunion', 'Focus', 'RH', 'Client', 'Formation'];
  
  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private dialogRef: MatDialogRef<ActivityFormComponent>,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.activityForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      activityDate: [now, Validators.required],
      activityTime: [this.getCurrentTime(), Validators.required], 
      category: ['', Validators.required]
    });
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 50);
  }
  
  // Helper to init the time field
  private getCurrentTime(): string {
    const now = new Date();
    return now.toTimeString().substring(0, 5);
  }

  onSubmit(): void {
    if (this.activityForm.valid) {
      const formValue = this.activityForm.value;
      
      const datePart = formValue.activityDate as Date;
      
      const timeString = formValue.activityTime as string;
      const [hours, minutes] = timeString.split(':').map(Number);
      
      const fullActivityTime = new Date(
        datePart.getFullYear(),
        datePart.getMonth(),
        datePart.getDate(),
        hours,
        minutes
      );

      const newActivity: Partial<Activity> = {
        activityName: formValue.name,
        activityDescription: formValue.description,
        activityTime: fullActivityTime,
        category: formValue.category
      };
      
      this.activityService.addActivity(newActivity).subscribe({
        next: (activity) => {
          console.log('Activity added:', activity);
          
          this.activityForm.reset({
            activityDate: new Date(),
            activityTime: this.getCurrentTime()
          }); 
          
          this.dialogRef.close(activity); 
          this.toastService.success('Activité ajoutée avec succès !');
        },
        error: (err) => {
          console.error('Error adding activity:', err);
          this.toastService.error('Erreur lors de l\'ajout de l\'activité. Veuillez vérifier que vous êtes connecté.');
        }
      });
    }
  }

}