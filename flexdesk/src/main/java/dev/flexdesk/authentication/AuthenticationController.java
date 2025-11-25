package dev.flexdesk.authentication;

import dev.flexdesk.authentication.models.NewCredentials;
import dev.flexdesk.authentication.models.UnsafeCredentials;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
  private final AuthenticationService service;

  public AuthenticationController(AuthenticationService service) {
    this.service = service;
  }

  @PostMapping("/register")
  public ResponseEntity<Void> register(@RequestBody UnsafeCredentials credentials) {
    System.out.println("Register request for: " + credentials.getEmail());
    if (credentials.isInvalid()) {
        System.out.println("Invalid credentials");
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

    if(service.createOne(credentials)) {
      System.out.println("User created successfully");
      return new ResponseEntity<>(HttpStatus.CREATED);
    }

    System.out.println("User already exists");
    throw new ResponseStatusException(HttpStatus.CONFLICT);
  }

  @PostMapping("/login")
  public String login(@RequestBody UnsafeCredentials credentials) {
    System.out.println("Login request for: " + credentials.getEmail());
    if (credentials.isInvalid()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

    String token = service.connect(credentials);

    if(token != null) {
      System.out.println("Login successful");
      return token;
    }

    System.out.println("Login failed");
    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
  }

  @PostMapping("/verify-token")
  public String verifyToken(@RequestBody String token) {
    if(token == null || token.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
    
    String cleanToken = token.replace("\"", "");
    String email = service.verify(cleanToken);

    if(email != null) {
      return email;
    }

    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
  }

  @PatchMapping("/change-password")
  public ResponseEntity<Void> changePassword(@RequestBody NewCredentials credentials) {
    if (credentials.isInvalid()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    if(service.changePassword(credentials)) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
  }

  @DeleteMapping("/delete")
  public ResponseEntity<Void> deleteAccount(@RequestBody String email) {
    if(email == null || email.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
    if(service.deleteOne(email)) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND);
  }
}
