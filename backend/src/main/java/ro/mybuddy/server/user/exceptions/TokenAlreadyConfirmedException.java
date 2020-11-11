package ro.mybuddy.server.user.exceptions;

public class TokenAlreadyConfirmedException extends TokenException {
    public TokenAlreadyConfirmedException() {
    }

    public TokenAlreadyConfirmedException(String message) {
        super(message);
    }
}
