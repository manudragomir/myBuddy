package ro.mybuddy.server.user.exceptions;

public class NotMatchingPassword extends SignUpException {
    public NotMatchingPassword() {
    }

    public NotMatchingPassword(String message) {
        super(message);
    }

}
