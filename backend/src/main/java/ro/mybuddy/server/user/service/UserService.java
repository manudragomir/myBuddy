package ro.mybuddy.server.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.user.exceptions.*;
import ro.mybuddy.server.user.model.ConfirmationToken;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.repository.ConfirmationTokenRepository;
import ro.mybuddy.server.user.repository.UserRepository;
import ro.mybuddy.server.user.utils.ConfirmationEmailBuilder;
import ro.mybuddy.server.user.utils.Random;

import javax.persistence.NonUniqueResultException;
import java.util.UUID;

@Component
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConfirmationTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    public User findByUsername(String username) {
        return userRepository.findByUsernameOrEmail(username, username);
    }

    public String confirmAccount(String confirmationToken) {
        ConfirmationToken token = tokenRepository.findByConfirmationToken(confirmationToken);
        if (token == null) {
            throw new TokenNotFoundException("Token is not valid");
        } else {
            if (token.getUser() == null)
                throw new InvalidTokenException("Token has no associated account");
            try {
                User user = userRepository.findByUsernameOrEmail(token.getUser().getUsername(), token.getUser().getEmail());
                user.setRole("USER");
                userRepository.save(user);
            } catch (NonUniqueResultException nue) {
                throw new UserException("Two users must not use the same email address");
            }
        }
        return null;
    }

    public void emailNewTokenToUser(User user) {
        ConfirmationToken token = new ConfirmationToken(user);
        System.out.println("[DEBUG] token: " + token.getConfirmationToken());
        System.out.println("[DEBUG] user id: " + token.getUser().getId());
        if (tokenRepository.findByConfirmationToken(token.getConfirmationToken()) != null)
            throw new TokenAlreadyGeneratedException("Token already generated");
        tokenRepository.save(token);
        sendEmail(new ConfirmationEmailBuilder(token).build());
    }

    @Async
    protected void sendEmail(SimpleMailMessage email) {
        javaMailSender.send(email);
    }
}
