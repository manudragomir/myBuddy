package ro.mybuddy.server.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.user.exceptions.*;
import ro.mybuddy.server.user.model.ConfirmationToken;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.repository.ConfirmationTokenRepository;
import ro.mybuddy.server.user.repository.UserRepository;
import ro.mybuddy.server.user.utils.ConfirmationEmailBuilder;

import javax.persistence.NonUniqueResultException;

/**
 * Service Class that manages application logic related to Users
 */
@Component
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConfirmationTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Tries to register a new user in the system
     * Successful execution adds a new user in the persistence layer
     * @param newUser New User to persist in the system
     */
    public void addNewUser(User newUser){
        User userOnRepo = userRepository.findByUsernameOrEmail(newUser.getUsername(), newUser.getEmail());
        if (userOnRepo != null) {
            throw new SignUpException("User already signed up. Please check your email to confirm the account.");
        }
        // encrypt the password before persisting the user
        String encodedPass = passwordEncoder.encode(newUser.getPassword());
        newUser.setPassword(encodedPass);
        User returnedUser = userRepository.save(newUser);
        if(returnedUser == null){
            throw new SignUpException("Error when added to database");
        }
        emailNewTokenToUser(newUser);
    }

    /**
     * Confirms the user account linked to the given confirmation token
     * @param confirmationToken Confirmation token of the user to validate
     * @return A success string, if confirmation operation succeeds
     */
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

    /**
     * Sends a confirmation email (containing the confirmation token) to the given user
     * @param user User to send the email to
     */
    private void emailNewTokenToUser(User user) {
        ConfirmationToken token = new ConfirmationToken(user);
        System.out.println("[DEBUG] token: " + token.getConfirmationToken());
        System.out.println("[DEBUG] user id: " + token.getUser().getId());
        if (tokenRepository.findByConfirmationToken(token.getConfirmationToken()) != null)
            throw new TokenAlreadyGeneratedException("Token already generated");
        tokenRepository.save(token);
        sendEmail(new ConfirmationEmailBuilder(token).build());
    }

    /**
     * Utility function - dispatches the MailSender an email to be sent to the corresponding user
     * @param email SimpleMailMessage to send to the recipient user
     */
    @Async
    protected void sendEmail(SimpleMailMessage email) {
        javaMailSender.send(email);
    }
}
