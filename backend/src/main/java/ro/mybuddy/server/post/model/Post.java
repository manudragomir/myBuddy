package ro.mybuddy.server.post.model;

import lombok.*;
import ro.mybuddy.server.user.model.User;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "posts")
public class Post {
    @Id
    private String id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @NonNull
    private String body;
    @NonNull
    private LocalDate date;
    @NonNull
    private Double longitude;
    @NonNull
    private Double latitude;
    @ManyToMany(mappedBy = "posts")
    private Set<Tag> tags;
}
