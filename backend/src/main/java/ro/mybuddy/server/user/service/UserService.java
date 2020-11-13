package ro.mybuddy.server.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.user.exceptions.*;
import ro.mybuddy.server.user.model.ConfirmationToken;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.model.UserDto;
import ro.mybuddy.server.user.repository.ConfirmationTokenRepository;
import ro.mybuddy.server.user.repository.UserRepository;
import ro.mybuddy.server.user.utils.ConfirmationEmailBuilder;

import javax.persistence.NonUniqueResultException;

@Component
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConfirmationTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    public void addNewUser(User newUser){
        User userOnRepo = userRepository.findByUsernameOrEmail(newUser.getUsername(), newUser.getEmail());
        if (userOnRepo != null) {
            throw new SignUpException("User already signed up. Please check your email to confirm the account.");
        }
        User returnedUser = userRepository.save(newUser);
        if(returnedUser == null){
            throw new SignUpException("Error when added to database");
        }
        emailNewTokenToUser(newUser);
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
                if(user.getRole().equals("USER")){
                    throw new UserException("Account has already been confirmed.");
                }
                user.setRole("USER");
                userRepository.save(user);
            } catch (NonUniqueResultException nue) {
                throw new UserException("Two users must not use the same email address");
            } catch(NullPointerException ne){
                throw new UserException("User is not registered.");
            }
        }
        return "Account confirmed successfully.";
    }

    private void emailNewTokenToUser(User user) {
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
