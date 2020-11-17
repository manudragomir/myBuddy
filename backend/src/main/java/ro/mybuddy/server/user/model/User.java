package ro.mybuddy.server.user.model;


import lombok.*;
import ro.mybuddy.server.post.model.Post;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NonNull
    private String username;
    @NonNull
    private String password;
    @NonNull
    private String email;
    @NonNull
    private String firstName;
    @NonNull
    private String lastName;
    @NonNull
    private LocalDate birthday;
    private String token;
    @NonNull
    private String role;
}
