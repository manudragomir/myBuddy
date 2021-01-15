package ro.mybuddy.server.user.model;


import lombok.*;
import ro.mybuddy.server.post.model.Post;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Objects;
import java.util.Set;

/**
 * Entity representing the User in the system
 */
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) &&
                Objects.equals(username, user.username) &&
                Objects.equals(password, user.password) &&
                Objects.equals(email, user.email) &&
                Objects.equals(firstName, user.firstName) &&
                Objects.equals(lastName, user.lastName) &&
                Objects.equals(birthday, user.birthday) &&
                Objects.equals(token, user.token) &&
                Objects.equals(role, user.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, password, email, firstName, lastName, birthday, token, role);
    }
}
