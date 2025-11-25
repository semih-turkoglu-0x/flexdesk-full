package dev.flexdesk.authentication.models;

public class NewCredentials {
    private String email;
    private String oldPassword;
    private String newPassword;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public boolean isInvalid() {
        return email == null || email.isEmpty() || 
               oldPassword == null || oldPassword.isEmpty() || 
               newPassword == null || newPassword.isEmpty();
    }
}
