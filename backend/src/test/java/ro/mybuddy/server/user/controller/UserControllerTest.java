package ro.mybuddy.server.user.controller;

import com.google.gson.Gson;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.model.UserDto;
import ro.mybuddy.server.user.service.UserService;

import java.time.LocalDate;

import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class UserControllerTest {
    @Autowired
    private WebApplicationContext context;

    @Spy
    @InjectMocks
    private UserController controller;

    @Mock
    private UserService userService;

    private MockMvc mockMvc;

    private final User MOCK_USER = new User("username", "pass123", "a@a.com", "John", "Johnson", LocalDate.MIN, "USER");
    private final UserDto MOCK_NON_MATCHING_PASS_USERDTO = new UserDto("John", "Doe", "pass1", "pass2", "a@a.com", LocalDate.MIN, "username");

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

//    @WithMockUser(username="username")
    @Test
    void loginShould_ReturnNotFound_WithInvalidCredentials() throws Exception {
        Gson gson = new Gson();
        String requestBody = gson.toJson(MOCK_USER);
        mockMvc
                .perform(post("/user/login").contentType(MediaType.APPLICATION_JSON).content(requestBody))
                .andExpect(status().isNotFound());
    }

    @Test
    void signUpShould_ReturnBadRequest_WhenPasswordDoNotMatch() throws Exception {
        Gson gson = new Gson();
        String requestBody = gson.toJson(MOCK_NON_MATCHING_PASS_USERDTO);
        mockMvc
                .perform(post("/user/registration").contentType(MediaType.APPLICATION_JSON).content(requestBody))
                .andExpect(status().isBadRequest());
//                .andExpect(content().string("Passwords do not match"));
    }
}