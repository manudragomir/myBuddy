package ro.mybuddy.server.tag.exceptions;

/***
 * Exception thrown when some problem occurs when deleting a tag
 * */
public class DeleteTagException extends RuntimeException {
    public DeleteTagException() {
    }

    public DeleteTagException(String message) {
        super(message);
    }
}
