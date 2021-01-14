package ro.mybuddy.server.report.service;

import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.report.exceptions.*;
import ro.mybuddy.server.report.model.Report;
import ro.mybuddy.server.report.model.ReportDto;
import ro.mybuddy.server.report.repository.ReportRepository;
import ro.mybuddy.server.user.repository.UserRepository;
import ro.mybuddy.server.post.repository.*;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import ro.mybuddy.server.user.model.*;

@Service
public class ReportService {
    private final static Logger logger = Logger.getLogger(ReportService.class.getName());

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public void saveReport(String postId, ReportDto reportDto) {
        logger.info("Saving report...");
        Report report = new Report();
        report.setPost(postRepository.findPostById(postId));
        report.setMessage(reportDto.getMessage());
        logger.info("finding user " + reportDto.getUsername() + " in database");
        User user = userRepository.findByUsernameOrEmail(reportDto.getUsername(), reportDto.getUsername());

        if (user == null) {
            throw new InvalidUserException("The given user does not exist");
        }
        report.setUser(user);

        if (report.getPost() == null) {
            throw new InvalidPostException("The given post does not exist");
        }

        try {
            Report r = reportRepository.save(report);
        } catch (JpaObjectRetrievalFailureException e) {
            throw new SaveReportException("Error while saving report: " + e.getMessage());
        }
//        Post post =
    }

    public List<Report> findAll() {
        return reportRepository.findAll();
    }

    public void deleteReport(long id) {
        Optional<Report> report = reportRepository.findById(id);
        if (report.isPresent()) {
            try {
                reportRepository.deleteById(id);
            } catch (JpaObjectRetrievalFailureException e) {
                throw new DeleteReportException("Error while deleting report: " + e.getMessage());
            }
        }
    }
}
