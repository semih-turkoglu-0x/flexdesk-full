package dev.flexdesk.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
public class Activity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer activityId;
  private String activityName;
  private String activityDescription;
  private LocalDateTime activityTime;
  @ManyToOne
  private User requestingUser;
  private String category;
  private LocalDateTime endTime;

  public String getActivityName() {
    return activityName;
  }

  public void setActivityName(String activityName) {
    this.activityName = activityName;
  }

  public String getActivityDescription() {
    return activityDescription;
  }

  public void setActivityDescription(String activityDescription) {
    this.activityDescription = activityDescription;
  }

  public LocalDateTime getActivityTime() {
    return activityTime;
  }

  public void setActivityTime(LocalDateTime activityTime) {
    this.activityTime = activityTime;
  }

  public User getRequestingUser() {
    return requestingUser;
  }

  public void setRequestingUser(User requestingUser) {
    this.requestingUser = requestingUser;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public LocalDateTime getEndTime() {
    return endTime;
  }

  public void setEndTime(LocalDateTime endTime) {
    this.endTime = endTime;
  }
}