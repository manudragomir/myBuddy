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

    /**
     * Saves a report to the report repository.
     * The post ID is checked for existence, so a valid one must be provided.
     * The report argument must specify the reporting username and the reason for reporting formatted as a message.
     * <p>
     *     It validates the given postId and the username field in reportDto and creates a Report instance which is
     *     saved to reportRepository
     * </p>
     * @param postId
     * @param reportDto  the report data
     * @throws InvalidUserException  in case the given username is not found
     * @throws InvalidPostException  in case the given post is not found
     * @throws SaveReportException   in case of unsuccessful save
     */
    public void saveReport(String postId, ReportDto reportDto) {
        Report report = new Report();
        report.setPost(postRepository.findPostById(postId));
        report.setMessage(reportDto.getMessage());
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
    }

    /**
     * Fetches all the existing reports from the report repository.
     * @return  a list containing all reports
     */
    public List<Report> findAll() {
        return reportRepository.findAll();
    }

    /**
     * Deletes the report from the report repository only if it exists.
     * @param id  the identifier of the given report
     * @throws DeleteReportException  in case of unsuccessful deletion
     */
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
