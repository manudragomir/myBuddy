package ro.mybuddy.server.tag.exceptions;

/***
 * Exception thrown when some problem occurs when saving a tag
 * */
public class SaveTagException extends RuntimeException {
    public SaveTagException() {
    }

    public SaveTagException(String message) {
        super(message);
    }
}
