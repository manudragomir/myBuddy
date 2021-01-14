package ro.mybuddy.server.post.exceptions;

/**
 * Exception thrown when specified post is inexistent
 */
public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException() {
    }

    public PostNotFoundException(String message) {
        super(message);
    }
}