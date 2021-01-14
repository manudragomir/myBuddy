package ro.mybuddy.server.post.exceptions;

/**
 * Exception thrown when problems occurred deleting a post
 */
public class DeletePostException extends RuntimeException {
    public DeletePostException() {
    }

    public DeletePostException(String message) {
        super(message);
    }
}