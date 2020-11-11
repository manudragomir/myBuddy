package ro.mybuddy.server.user.exceptions;

public class UsernameOrEmailNotFound extends UserException {
    public UsernameOrEmailNotFound() {
    }

    public UsernameOrEmailNotFound(String message) {
        super(message);
    }
}
