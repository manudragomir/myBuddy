package ro.mybuddy.server.user.utils;

import lombok.Data;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.user.model.ConfirmationToken;

/**
 * Builder class for confirmation e-mails.
 */
public class ConfirmationEmailBuilder {
    private ConfirmationToken token;

    public ConfirmationEmailBuilder(ConfirmationToken token) {
        this.token = token;
    }

    /**
     * Creates a new SimpleMailMessage instance using the data provided in the ConfirmationToken instance.
     * <p>
     *     Wraps a link to the confirmation page on the frontend.
     * </p>
     * @return a new SimpleMailMessage instance
     */
    public SimpleMailMessage build() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("no-reply@mybuddy.ro");
        message.setTo(token.getUser().getEmail());
        message.setSubject("Confirm your email address");

        // TODO replace raw text with HTML (with inline CSS)
        message.setText("Thank you for creating a MyBuddy account! In order "
                + "to be able to use it, please copy the following link:\n"
                + "http://localhost:8100/confirm?token=" + token.getConfirmationToken());

        return message;
    }
}