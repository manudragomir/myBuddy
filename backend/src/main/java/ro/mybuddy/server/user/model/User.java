package ro.mybuddy.server.user.model;


import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDate;

@Entity
@Data
@RequiredArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @NonNull private String username;
    @NonNull private String password;
    @NonNull private String email;
    @NonNull private String firstName;
    @NonNull private String lastName;
    @NonNull private LocalDate birthday;
    private String token;
    private Integer permissions;
}
