package ro.mybuddy.server.post.exceptions;

/**
 * Exception thrown when problems occurred updating a post
 */
public class UpdatePostException extends RuntimeException {
    public UpdatePostException() {
    }

    public UpdatePostException(String message) {
        super(message);
    }
}