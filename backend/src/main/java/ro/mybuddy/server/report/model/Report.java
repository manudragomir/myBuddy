package ro.mybuddy.server.report.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import ro.mybuddy.server.report.utils.ReportSerializer;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.post.utils.PostSerializer;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "reports")
@JsonSerialize(using= ReportSerializer.class)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class Report {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private long id;

    @ApiModelProperty(notes = "explanation of post report (e.g. violence, harassment, or user-given explanation)")
    @NotNull
    private String message;

    @ApiModelProperty(notes = "ID of post")
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, targetEntity = Post.class)
    @JoinColumn(name = "post_id", nullable = false)
    @NotNull
    private Post post;

    @ApiModelProperty(notes = "user who reported the post")
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, targetEntity = User.class)
    @JoinColumn(name = "user_id")
    private User user;

}
