package ro.mybuddy.server.user.utils;

import lombok.Data;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.user.model.ConfirmationToken;

public class ConfirmationEmailBuilder {
    private ConfirmationToken token;

    public ConfirmationEmailBuilder(ConfirmationToken token) {
        this.token = token;
    }

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