package dev.flexdesk.repository;

import dev.flexdesk.model.Comment;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface CommentRepository extends CrudRepository<Comment, Integer> {
    List<Comment> findByActivity_ActivityId(Integer activityId);
}
