package ro.mybuddy.server.post.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "post_index")
public class Index {
    @Id
    private Integer id;
}
