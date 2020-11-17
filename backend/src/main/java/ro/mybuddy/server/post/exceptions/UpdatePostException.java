package ro.mybuddy.server.post.exceptions;

public class UpdatePostException extends RuntimeException {
    public UpdatePostException() {
    }

    public UpdatePostException(String message) {
        super(message);
    }
}