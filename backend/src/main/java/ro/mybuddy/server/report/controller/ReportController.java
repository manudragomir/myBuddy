package ro.mybuddy.server.report.controller;

import jdk.jshell.spi.ExecutionControl;
import org.hibernate.cfg.NotYetImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ro.mybuddy.server.report.exceptions.InvalidUserException;
import ro.mybuddy.server.report.exceptions.ReportException;
import ro.mybuddy.server.report.model.Report;
import ro.mybuddy.server.report.model.ReportDto;
import ro.mybuddy.server.report.service.ReportService;
import ro.mybuddy.server.user.model.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ReportController {

    @Autowired
    private ReportService service;

    @PostMapping(value="/post/newsfeed/report/{postId}")
    ResponseEntity<?> saveReport(@PathVariable String postId, @RequestBody ReportDto report, BindingResult bindingResult) {
        System.out.println("[TRACE] saveReport...");
        if(bindingResult.hasErrors()){
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(x -> x.getDefaultMessage())
                    .collect(Collectors.toList());
            return new ResponseEntity<>(errors.toString(), HttpStatus.NOT_ACCEPTABLE);
        }
        try {
            System.out.println("[DEBUG] id of post: " + postId);
            service.saveReport(postId, report);
            return new ResponseEntity<Void>(HttpStatus.OK);
        } catch (ReportException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @GetMapping(value="/post/newsfeed/report")
    ResponseEntity<?> findAll() {
        try {
            var reports = service.findAll();
            return new ResponseEntity<>(reports, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(value = "/post/newsfeed/report/{id}")
    ResponseEntity<?> deleteReport(@PathVariable long id) {
        try {
            service.deleteReport(id);
            return new ResponseEntity<Void>(HttpStatus.OK);
        } catch (ReportException re) {
            return new ResponseEntity<>(re.toString(), HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
