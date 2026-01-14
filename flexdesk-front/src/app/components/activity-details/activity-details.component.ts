import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity';
import { ToastService } from '../../services/toast.service';
import { Activity, Comment } from '../../core/models';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-activity-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ activity.activityName }}</h2>
    <mat-dialog-content>
      <p><strong>Description:</strong> {{ activity.activityDescription }}</p>
      <p><strong>Category:</strong> {{ activity.category }}</p>
      <p>
        <strong>Time:</strong> {{ activity.activityTime | date : 'medium' }} -
        {{ activity.endTime | date : 'medium' }}
      </p>

      <h3>Comments</h3>
      <div class="comments-list">
        @for (comment of comments; track $index) {
        <div class="comment-item">
          <p>
            <strong>{{ comment.author.surName }}</strong
            >: {{ comment.content }}
          </p>
          <small>{{ comment.createdAt | date : 'short' }}</small>
        </div>
        } @if (comments.length === 0) {
        <p>No comments yet.</p>
        }
      </div>

      <div class="add-comment">
        <mat-form-field appearance="fill" style="width: 100%">
          <mat-label>Add a comment</mat-label>
          <textarea matInput [(ngModel)]="newComment" rows="3"></textarea>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="addComment()" [disabled]="!newComment">
          Post
        </button>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button color="warn" (click)="deleteActivity()">Delete Activity</button>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .comments-list {
        max-height: 200px;
        overflow-y: auto;
        margin-bottom: 16px;
        border: 1px solid #eee;
        padding: 8px;
      }
      .comment-item {
        border-bottom: 1px solid #eee;
        padding: 8px 0;
      }
      .add-comment {
        margin-top: 16px;
      }
    `,
  ],
})
export class ActivityDetailsComponent {
  activity: Activity;
  comments: Comment[] = [];
  newComment: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { activity: Activity },
    private activityService: ActivityService,
    private dialogRef: MatDialogRef<ActivityDetailsComponent>,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {
    this.activity = data.activity;
    this.loadComments();
  }

  loadComments() {
    this.activityService.getComments(this.activity.activityId).subscribe((comments) => {
      this.comments = comments;
    });
  }

  addComment() {
    if (!this.newComment) return;
    this.activityService.addComment(this.activity.activityId, this.newComment).subscribe({
      next: (comment) => {
        this.comments.push(comment);
        this.newComment = '';
        this.toastService.success('Comment added successfully');
      },
      error: (err) => {
        console.error('Error adding comment', err);
        this.toastService.error('Failed to add comment');
      },
    });
  }

  deleteActivity() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this activity?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.activityService.deleteActivity(this.activity.activityId).subscribe({
          next: () => {
            this.toastService.success('Activity deleted successfully');
            this.dialogRef.close('deleted');
          },
          error: (err) => {
            console.error('Error deleting activity', err);
            this.toastService.error('Failed to delete activity');
          },
        });
      }
    });
  }
}
