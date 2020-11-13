package ro.mybuddy.server.user.exceptions;

public class SignUpException extends RuntimeException {


    public SignUpException() {
    }

    public SignUpException(String message) {
        super(message);
    }
}
