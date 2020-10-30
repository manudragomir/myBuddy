package ro.mybuddy.server.user.exceptions;

public class UnverifiedUser extends LoginException {
    public UnverifiedUser() {
    }

    public UnverifiedUser(String message) {
        super(message);
    }
}
