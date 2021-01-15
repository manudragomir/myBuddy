package ro.mybuddy.server.post.model;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import ro.mybuddy.server.post.utils.PostSerializer;
import ro.mybuddy.server.post.utils.TypePost;
import ro.mybuddy.server.tag.model.Tag;
import ro.mybuddy.server.user.model.User;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Model used to represent a post
 */
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
    @Enumerated(EnumType.ORDINAL)
    @NotNull
    private TypePost type;
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

    @ApiModelProperty(notes = "a set of strings that represents the tags of the post")
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Post post = (Post) o;
        return Objects.equals(id, post.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, type, user, body, date, longitude, latitude, tags);
    }
}
