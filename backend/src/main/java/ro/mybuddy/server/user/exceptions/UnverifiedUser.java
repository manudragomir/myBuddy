package ro.mybuddy.server.user.exceptions;

public class UnverifiedUser extends SignUpException {
    public UnverifiedUser() {
    }

    public UnverifiedUser(String message) {
        super(message);
    }
}
