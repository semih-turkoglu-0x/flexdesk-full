package dev.flexdesk.controller;

import dev.flexdesk.model.Activity;
import dev.flexdesk.model.Comment;
import dev.flexdesk.model.User;
import dev.flexdesk.repository.ActivityRepository;
import dev.flexdesk.repository.CommentRepository;
import dev.flexdesk.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
public class ActivityController {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public ActivityController(ActivityRepository activityRepository, UserRepository userRepository, CommentRepository commentRepository) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping("/activities")
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    @GetMapping("/activities/me")
    public List<Activity> getMyActivities(Principal principal) {
        return activityRepository.findByRequestingUser_Username(principal.getName());
    }

    @GetMapping("/activities/{id}")
    public Activity getActivity(@PathVariable Integer id) {
        return activityRepository.findByActivityId(id);
    }

    @PostMapping("/activities")
    public Activity addActivity(@RequestBody Activity activity, Principal principal) {
        User user = userRepository.findByUsername(principal.getName());
        activity.setRequestingUser(user);
        if (activity.getEndTime() == null && activity.getActivityTime() != null) {
            // Default duration 1 hour if not provided
            activity.setEndTime(activity.getActivityTime().plusHours(1));
        }
        return activityRepository.save(activity);
    }

    @PutMapping("/activities/{id}")
    public Activity updateActivity(@PathVariable Integer id, @RequestBody Activity updatedActivity, Principal principal) {
        Activity activity = activityRepository.findByActivityId(id);
        if (activity == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        
        // Allow update by anyone (shared planning)
        if (updatedActivity.getActivityTime() != null) {
            activity.setActivityTime(updatedActivity.getActivityTime());
        }
        if (updatedActivity.getEndTime() != null) {
            activity.setEndTime(updatedActivity.getEndTime());
        }
        if (updatedActivity.getActivityName() != null) {
            activity.setActivityName(updatedActivity.getActivityName());
        }
        if (updatedActivity.getActivityDescription() != null) {
            activity.setActivityDescription(updatedActivity.getActivityDescription());
        }
        
        return activityRepository.save(activity);
    }

    @DeleteMapping("/activities/{id}")
    public void deleteActivity(@PathVariable Integer id, Principal principal) {
        Activity activity = activityRepository.findByActivityId(id);
        if (activity == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        User user = userRepository.findByUsername(principal.getName());
        // if (!activity.getRequestingUser().getUserId().equals(user.getUserId()) && !user.isAdmin()) {
        //      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own activities");
        // }
        activityRepository.delete(activity);
    }

    // Comments
    @PostMapping("/activities/{id}/comments")
    public Comment addComment(@PathVariable Integer id, @RequestBody Map<String, String> payload, Principal principal) {
        Activity activity = activityRepository.findByActivityId(id);
        if (activity == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        
        User user = userRepository.findByUsername(principal.getName());
        Comment comment = new Comment();
        comment.setContent(payload.get("content"));
        comment.setActivity(activity);
        comment.setAuthor(user);
        comment.setCreatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }
    
    @GetMapping("/activities/{id}/comments")
    public List<Comment> getComments(@PathVariable Integer id) {
        return commentRepository.findByActivity_ActivityId(id);
    }
}