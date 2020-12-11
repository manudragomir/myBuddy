package ro.mybuddy.server.report.controller;

import jdk.jshell.spi.ExecutionControl;
import org.hibernate.cfg.NotYetImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import ro.mybuddy.server.report.exceptions.InvalidUserException;
import ro.mybuddy.server.report.exceptions.ReportException;
import ro.mybuddy.server.report.model.Report;
import ro.mybuddy.server.report.service.ReportService;
import ro.mybuddy.server.user.model.User;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@Controller
public class ReportController {

    @Autowired
    private ReportService service;

    @PostMapping(value="/report")
    ResponseEntity<?> saveReport(@PathVariable String id, @RequestBody Report report) {
        try {
            service.saveReport(report);
            return new ResponseEntity<Void>(HttpStatus.OK);
        } catch (ReportException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }

    }
}
