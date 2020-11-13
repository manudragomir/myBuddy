package ro.mybuddy.server.user.exceptions;

public class TokenNotFoundException extends TokenException {
    public TokenNotFoundException() {
    }

    public TokenNotFoundException(String message) {
        super(message);
    }
}
