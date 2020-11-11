package ro.mybuddy.server.user.exceptions;

public class NotMatchingPassword extends UserException {
    public NotMatchingPassword() {
    }

    public NotMatchingPassword(String message) {
        super(message);
    }

}
