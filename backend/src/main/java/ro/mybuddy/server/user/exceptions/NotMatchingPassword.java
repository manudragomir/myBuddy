package ro.mybuddy.server.user.exceptions;

public class NotMatchingPassword extends LoginException {
    public NotMatchingPassword() {
    }

    public NotMatchingPassword(String message) {
        super(message);
    }

}
