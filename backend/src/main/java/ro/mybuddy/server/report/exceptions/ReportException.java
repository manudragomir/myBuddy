package ro.mybuddy.server.report.exceptions;

public class ReportException extends RuntimeException {
    public ReportException() {
    }

    public ReportException(String message) {
        super(message);
    }
}
