package ro.mybuddy.server.tag.exceptions;

public class DeleteTagException extends RuntimeException {
    public DeleteTagException() {
    }

    public DeleteTagException(String message) {
        super(message);
    }
}
