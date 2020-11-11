package ro.mybuddy.server.user.exceptions;

public class TokenAlreadyGeneratedException extends TokenException {
    public TokenAlreadyGeneratedException() {
    }

    public TokenAlreadyGeneratedException(String message) {
        super(message);
    }
}
