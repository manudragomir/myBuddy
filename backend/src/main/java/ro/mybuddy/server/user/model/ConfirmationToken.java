package ro.mybuddy.server.user.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import ro.mybuddy.server.user.utils.Random;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * Class that encapsulates a randomly generated token(UUID) when a new user is registered in the system
 */
@Entity
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Table(name="confirmation_tokens")
public class ConfirmationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NonNull
    private String confirmationToken;

    @NonNull
    private LocalDateTime createdDate;

    @NonNull
    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "users")
    private User user;

    public ConfirmationToken(User user) {
        this.user = user;
        createdDate = LocalDateTime.now();
        confirmationToken = Random.generateToken();
    }



}