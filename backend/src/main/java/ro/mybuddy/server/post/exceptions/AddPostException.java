package ro.mybuddy.server.post.exceptions;

/**
 * Exception thrown when problems occurred saving a post
 */
public class AddPostException extends RuntimeException {
    public AddPostException() {
    }

    public AddPostException(String message) {
        super(message);
    }
}
