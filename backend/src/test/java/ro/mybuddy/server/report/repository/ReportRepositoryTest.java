package ro.mybuddy.server.report.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.post.utils.TypePost;
import ro.mybuddy.server.report.model.Report;
import ro.mybuddy.server.user.model.User;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
public class ReportRepositoryTest {
    @Autowired
    private ReportRepository reportRepository;

    @Test
    @Transactional
    public void shouldBeSavedSuccessfullyAndFindAll() {
        User u1 = new User();
        u1.setBirthday(LocalDate.now());
        u1.setUsername("boss");
        User u2 = new User();
        u1.setUsername("fraier");
        u1.setBirthday(LocalDate.now());
        Post p = new Post();
        p.setId("123");
        p.setUser(u1);
        p.setDate(LocalDate.now());
        p.setLatitude(0.0);
        p.setLongitude(0.0);
        p.setType(TypePost.Found);
        Report r = new Report();
        r.setPost(p);
        r.setUser(u2);
        r.setMessage("prea putina smecherie");
        reportRepository.save(r);

        List<Report> reports = reportRepository.findAll();
        assertThat(reports).contains(r);
    }

    @Test
    @Transactional
    public void shouldBeDeletedSuccessfully() {
        User u1 = new User();
        u1.setBirthday(LocalDate.now());
        u1.setUsername("boss");
        User u2 = new User();
        u1.setUsername("fraier");
        u1.setBirthday(LocalDate.now());
        Post p = new Post();
        p.setId("123");
        p.setUser(u1);
        p.setDate(LocalDate.now());
        p.setLatitude(0.0);
        p.setLongitude(0.0);
        p.setType(TypePost.Found);
        Report r = new Report();
        r.setPost(p);
        r.setUser(u2);
        r.setMessage("prea putina smecherie");
        reportRepository.save(r);

        reportRepository.deleteById(r.getId());

        List<Report> reports = reportRepository.findAll();
        assertThat(reports).doesNotContain(r);
    }
}
