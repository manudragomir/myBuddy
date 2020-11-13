package ro.mybuddy.server.post.model;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tags")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NonNull
    private String name;
    @ManyToMany
    @JoinTable(name = "tag_post",
            joinColumns = { @JoinColumn(name = "fk_tag") },
            inverseJoinColumns = { @JoinColumn(name = "fk_post") })
    private Set<Post> posts;
}
