package dev.flexdesk.repository;

import dev.flexdesk.model.User;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository <User, Integer> {

  List<User> findAll();
  User findByUserId(Integer id);
  User findByUsername(String username);
  boolean existsByUsername(String username);
}