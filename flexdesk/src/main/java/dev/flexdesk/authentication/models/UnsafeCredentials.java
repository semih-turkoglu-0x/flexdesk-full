package dev.flexdesk.authentication.models;

import dev.flexdesk.model.User;

public class UnsafeCredentials {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isInvalid() {
        return email == null || email.isEmpty() || password == null || password.isEmpty();
    }

    public User makeSafe(String hashedPassword) {
        User user = new User();
        user.setUsername(email); // Using email as username
        user.setPassword(hashedPassword);
        // Set default values to avoid DB constraint errors
        user.setFirstName("New");
        user.setLastName("User");
        user.setSurName("");
        user.setAdmin(false);
        return user;
    }
}
