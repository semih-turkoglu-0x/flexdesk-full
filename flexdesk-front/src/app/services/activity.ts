import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity, Comment } from '../core/models';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private apiUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) { }


  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/activities`);
  }

  getMyActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/activities/me`);
  }

  getActivity(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/activities/${id}`);
  }

  addActivity(activity: Partial<Activity>): Observable<Activity> {
    return this.http.post<Activity>(`${this.apiUrl}/activities`, activity);
  }

  updateActivity(id: number, activity: Partial<Activity>): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/activities/${id}`, activity);
  }

  deleteActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/activities/${id}`);
  }

  addComment(activityId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/activities/${activityId}/comments`, { content });
  }

  getComments(activityId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/activities/${activityId}/comments`);
  }
}
