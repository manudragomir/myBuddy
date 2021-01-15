package ro.mybuddy.server.user.service;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.ActiveProfiles;
import ro.mybuddy.server.user.exceptions.InvalidTokenException;
import ro.mybuddy.server.user.exceptions.SignUpException;
import ro.mybuddy.server.user.exceptions.TokenNotFoundException;
import ro.mybuddy.server.user.exceptions.UserException;
import ro.mybuddy.server.user.model.ConfirmationToken;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.repository.ConfirmationTokenRepository;
import ro.mybuddy.server.user.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
class UserServiceTest {
    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ConfirmationTokenRepository tokenRepository;

    @Mock
    private JavaMailSender javaMailSender;

    private final String MOCK_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImEiLCJpYXQiOjE2MTA3MDczNDN9.XsX9lQ3zay91aamYB_gDn2qtTuSYDdA5P-D0KuhDSUk";
    private final User MOCK_USER = new User("username", "pass123", "a@a.com", "John", "Johnson", LocalDate.MIN, "USER");

    @Test
    void addUserShould_ThrowSignUpException_IfUserAlreadyRegistered() {

        when(userRepository.findByUsernameOrEmail(anyString(), anyString())).thenReturn(MOCK_USER);

        assertThrows(SignUpException.class, () -> {
           userService.addNewUser(MOCK_USER);
        });
    }

    @Test
    void confirmAccountShould_ThrowTokenNotFoundException_IfTokenIsMissing() {
        when(tokenRepository.findByConfirmationToken(MOCK_TOKEN)).thenReturn(null);
        assertThrows(TokenNotFoundException.class, () -> {
            userService.confirmAccount(MOCK_TOKEN);
        }, "Token is not valid");
    }

    @Test
    void confirmAccountShould_ThrowUserException_IfAssociatedAccountIsAlreadyConfirmed() {
        ConfirmationToken token = new ConfirmationToken(MOCK_TOKEN, LocalDateTime.MIN, MOCK_USER);
        when(tokenRepository.findByConfirmationToken(MOCK_TOKEN)).thenReturn(token);
        when(userRepository.findByUsernameOrEmail(anyString(), anyString())).thenReturn(MOCK_USER);

        assertThrows(UserException.class, () -> {
            userService.confirmAccount(MOCK_TOKEN);
        }, "Account has already been confirmed.");
    }
}