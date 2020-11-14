package ro.mybuddy.server.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.tag.model.Tag;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post,String> {
    List<Post> findAll();
    Post save(Post post);
    List<Post> findPostsByTagsContains(Tag tag);
    void delete(Post post);
    Post findPostById(String id);
}
