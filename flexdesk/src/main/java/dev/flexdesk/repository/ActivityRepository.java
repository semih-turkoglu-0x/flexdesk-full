package dev.flexdesk.repository;

import dev.flexdesk.model.Activity;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface ActivityRepository extends CrudRepository<Activity, Integer> {

  List<Activity> findAll();
  Activity findByActivityId(Integer id);
  List<Activity> findByRequestingUser_Username(String username);

}