package ro.mybuddy.server.user.exceptions;

public class InvalidTokenException extends TokenException {
    public InvalidTokenException() {
    }

    public InvalidTokenException(String message) {
        super(message);
    }
}
