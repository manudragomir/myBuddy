package ro.mybuddy.server.user.exceptions;

public class UsernameOrEmailNotFound extends LoginException {
    public UsernameOrEmailNotFound() {
    }

    public UsernameOrEmailNotFound(String message) {
        super(message);
    }
}
