package ro.mybuddy.server.user.exceptions;

public class TokenException extends UserException {
    public TokenException() {
    }

    public TokenException(String message) {
        super(message);
    }
}
