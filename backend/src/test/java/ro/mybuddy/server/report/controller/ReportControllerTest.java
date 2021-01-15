package ro.mybuddy.server.report.controller;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.http.MediaType;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.report.exceptions.InvalidPostException;
import ro.mybuddy.server.report.exceptions.InvalidUserException;
import ro.mybuddy.server.report.model.Report;
import ro.mybuddy.server.report.model.ReportDto;
import ro.mybuddy.server.report.service.ReportService;

import java.util.ArrayList;
import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ro.mybuddy.server.report.utils.ReportSerializer;
import ro.mybuddy.server.user.model.User;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ReportControllerTest {

    @Spy
    @InjectMocks
    private ReportController controller;

    @Mock
    private ReportService reportService;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void saveReportWhenPostIsValid() throws Exception {
        String postId = "1231212";
        ReportDto reportDto = new ReportDto();
        reportDto.setMessage("harassment");
        reportDto.setUsername("haja.fgabriel");

        String content = "{" +
                "\"username\":\"haja.fgabriel\", " +
                "\"message\" : \"harassment\"" +
        "}";

        doNothing().when(reportService).saveReport(postId, reportDto);
        mockMvc
                .perform(post("/post/newsfeed/report/1231212")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(content))
                .andExpect(status().isOk());
    }

    @Test
    void saveReportWhenPostIsInvalid() throws Exception {
        ReportDto reportDto = new ReportDto();
        reportDto.setMessage("harassment");
        reportDto.setUsername("haja.fgabriel");
        doThrow(InvalidPostException.class).when(reportService).saveReport("123", reportDto);

        String content = "{" +
                "\"username\":\"haja.fgabriel\", " +
                "\"message\" : \"harassment\"" +
                "}";

        mockMvc
                .perform(post("/post/newsfeed/report/123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(content))
                .andExpect(status().isNotAcceptable());
    }

    void saveReportWhenUserIsInvalid() throws Exception {
        ReportDto reportDto = new ReportDto();
        reportDto.setMessage("nu incape de smecherie");
        reportDto.setUsername("boss");
        doThrow(InvalidUserException.class).when(reportService).saveReport("kkk", reportDto);

        // HACK hardcoded JSON, because ObjectMapper doesn't recognise the ReportSerializer
        String content = "{" +
                "\"username\":\"boss\", " +
                "\"message\" : \"nu incape de smecherie\"" +
                "}";

        mockMvc
                .perform(post("/post/newsfeed/report/kkk")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(content))
                .andExpect(status().isNotAcceptable());
    }

    @Test
    void findAllShouldReturnAllReportsWhenExistentInRepo() throws Exception {
        Report report1 = new Report();
        report1.setMessage("harassment");
        Post post1 = new Post();
        post1.setId("1231212");
        report1.setPost(post1);
        User user1 = new User();
        user1.setUsername("florin");
        report1.setUser(user1);

        Report report2 = new Report();
        report2.setMessage("pornography");
        Post post2 = new Post();
        post2.setId("987651");
        report2.setPost(post2);
        User user2 = new User();
        user2.setUsername("haja");
        report2.setUser(user2);

        when(reportService.findAll())
                .thenReturn(Arrays.asList(report1, report2));

        mockMvc
                .perform(get("/post/newsfeed/report"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)));
    }

    @Test
    void findAllShouldReturnEmptyReportListWhenNoReportsInRepo() throws Exception {
        when(reportService.findAll())
                .thenReturn(new ArrayList<>());

        mockMvc
                .perform(get("/post/newsfeed/report"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(0)));
    }

    @Test
    void deleteReport() {
    }
}