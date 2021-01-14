package ro.mybuddy.server.tag.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.mybuddy.server.tag.model.Tag;

import java.util.List;

/***
 * Repository responsible for tags
 * @see Tag
 */
@Repository
public interface TagRepository extends JpaRepository<Tag,String> {
    List<Tag> findAll();
    Tag save(Tag tag);
    void delete(Tag tag);
}
