package dev.flexdesk.controller;

import dev.flexdesk.model.User;
import dev.flexdesk.repository.UserRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class UserController {

  @Autowired
  private UserRepository userRepository;

  @GetMapping("/users")
  public List<User> getUsers() {
    return userRepository.findAll();
  }

  @GetMapping("/users/{id}")
  public User getUserById (@PathVariable Integer id) {
    return userRepository.findByUserId(id);
  }

  @PostMapping("/users")
  public User addUser(@RequestBody User user) {
    user.setAdmin(false);
    return userRepository.save(user);
  }

  @PutMapping("/users/{id}")
  public User updateUser(@PathVariable Integer id, @RequestBody User updatedUser) {
    User user = userRepository.findByUserId(id);
    if (user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);

    if (updatedUser.getFirstName() != null) user.setFirstName(updatedUser.getFirstName());
    if (updatedUser.getLastName() != null) user.setLastName(updatedUser.getLastName());
    if (updatedUser.getSurName() != null) user.setSurName(updatedUser.getSurName());
    
    return userRepository.save(user);
  }

  @DeleteMapping("/users/{id}")
  public void deleteUser(@PathVariable Integer id) {
    User user = userRepository.findByUserId(id);
    if (user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    userRepository.delete(user);
  }
}