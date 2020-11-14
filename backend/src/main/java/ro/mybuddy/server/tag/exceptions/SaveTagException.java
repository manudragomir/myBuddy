package ro.mybuddy.server.tag.exceptions;

public class SaveTagException extends RuntimeException {
    public SaveTagException() {
    }

    public SaveTagException(String message) {
        super(message);
    }
}
