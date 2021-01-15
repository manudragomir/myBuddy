package ro.mybuddy.server.report.exceptions;

public class InvalidPostException extends ReportException {
    public InvalidPostException() {
    }

    public InvalidPostException(String message) {
        super(message);
    }
}
