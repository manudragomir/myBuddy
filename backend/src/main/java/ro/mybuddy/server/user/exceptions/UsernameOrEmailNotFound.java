package ro.mybuddy.server.user.exceptions;

public class UsernameOrEmailNotFound extends SignUpException {
    public UsernameOrEmailNotFound() {
    }

    public UsernameOrEmailNotFound(String message) {
        super(message);
    }
}
