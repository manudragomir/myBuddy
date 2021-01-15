package ro.mybuddy.server.report.service;

import org.junit.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.post.repository.PostRepository;
import ro.mybuddy.server.report.exceptions.InvalidPostException;
import ro.mybuddy.server.report.exceptions.InvalidUserException;
import ro.mybuddy.server.report.model.Report;
import ro.mybuddy.server.report.model.ReportDto;
import ro.mybuddy.server.report.repository.ReportRepository;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.repository.UserRepository;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
public class ReportServiceTest {

    @InjectMocks
    private ReportService reportService;

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @Before
    public void createMocks() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void shouldFindAllReports() {
        Report r = new Report();
        r.setMessage("Doamne ajuta!");
        when(reportRepository.findAll()).thenReturn(Collections.singletonList(r));
        List<Report> reports = reportService.findAll();
        assertThat(reports).contains(r);
        assertThat(reports.size()).isEqualTo(1);
    }

    @Test
    public void shouldReturnEmptyList() {
        when(reportRepository.findAll()).thenReturn(Collections.emptyList());
        List<Report> reports = reportService.findAll();
        assertThat(reports.size()).isEqualTo(0);
    }

    @Test
    public void shouldThrowInvalidPostException() {
        User user = new User();
        user.setUsername("boss");
        when(postRepository.findPostById("kkk")).thenReturn(null);
        when(userRepository.findByUsernameOrEmail("boss", "boss")).thenReturn(user);
        ReportDto reportDto = new ReportDto();
        reportDto.setUsername("boss");
        reportDto.setMessage("MOCKITO E SMECHER RAU DE TOT FRT");
        try {
            reportService.saveReport("kkk", reportDto);
        } catch (InvalidPostException e) {
            assertThat(e).isInstanceOf(InvalidPostException.class);
        }
    }


    @Test
    public void shouldBeSavedSuccessfully() {
        Post p = new Post();
        p.setId("kkk");
        User user = new User();
        user.setUsername("boss");
        Report r = new Report();
        r.setPost(p);
        r.setUser(user);
        r.setMessage("good");

        when(postRepository.findPostById("kkk")).thenReturn(p);
        when(userRepository.findByUsernameOrEmail("boss", "boss")).thenReturn(user);
        when(reportRepository.save(r)).thenReturn(r);

        ReportDto reportDto = new ReportDto();
        reportDto.setUsername("boss");
        reportDto.setMessage("MOCKITO E SMECHER RAU DE TOT FRT");
        reportService.saveReport("kkk", reportDto);
    }

}
