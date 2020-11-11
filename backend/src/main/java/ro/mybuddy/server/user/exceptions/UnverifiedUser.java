package ro.mybuddy.server.user.exceptions;

public class UnverifiedUser extends UserException {
    public UnverifiedUser() {
    }

    public UnverifiedUser(String message) {
        super(message);
    }
}
