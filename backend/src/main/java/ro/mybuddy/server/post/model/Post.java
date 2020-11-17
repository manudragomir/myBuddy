package ro.mybuddy.server.post.model;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.*;
import ro.mybuddy.server.post.utils.PostSerializer;
import ro.mybuddy.server.tag.model.Tag;
import ro.mybuddy.server.user.model.User;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "posts")
@JsonSerialize(using= PostSerializer.class)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class Post {
    @Id
    private String id;
    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL, targetEntity = User.class)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    private String body;
    @NonNull
    @NotNull
    private LocalDate date;
    @Min(value=-90, message = "Longitude must be higher than -90")
    @Max(value=90, message = "Longitude must be lower than 90")
    private Double longitude;
    @Min(value=-90, message = "Latitude must be higher than -90")
    @Max(value=90, message = "Latitude must be lower than 90")
    private Double latitude;
    @ManyToMany
    private Set<Tag> tags = new HashSet<>();

    public Post(@NonNull String body, @NonNull LocalDate date, @NonNull @Min(value = -90, message = "Longitude must be higher than -90") @Max(value = 90, message = "Longitude must be lower than 90") Double longitude, @NonNull @Min(value = -90, message = "Latitude must be higher than -90") @Max(value = 90, message = "Latitude must be lower than -90") Double latitude, Set<Tag> tags) {
        this.body = body;
        this.date = date;
        this.longitude = longitude;
        this.latitude = latitude;
        this.tags = tags;
    }

    public Post(String id) {
        this.id = id;
    }
}
