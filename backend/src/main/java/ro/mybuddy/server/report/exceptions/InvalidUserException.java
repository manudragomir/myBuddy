package ro.mybuddy.server.report.exceptions;

public class InvalidUserException extends ReportException {
    public InvalidUserException() {
    }

    public InvalidUserException(String message) {
        super(message);
    }
}
