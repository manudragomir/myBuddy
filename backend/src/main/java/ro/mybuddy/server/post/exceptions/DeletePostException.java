package ro.mybuddy.server.post.exceptions;

public class DeletePostException extends RuntimeException {
    public DeletePostException() {
    }

    public DeletePostException(String message) {
        super(message);
    }
}