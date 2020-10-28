package ro.mybuddy.server.user.exceptions;

public class LoginException extends RuntimeException {


    public LoginException() {
    }

    public LoginException(String message) {
        super(message);
    }
}
