package ro.mybuddy.server.post.exceptions;

public class AddPostException extends RuntimeException {
    public AddPostException() {
    }

    public AddPostException(String message) {
        super(message);
    }
}
