package ro.mybuddy.server.post.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.post.utils.TypePost;
import ro.mybuddy.server.tag.model.Tag;
import ro.mybuddy.server.tag.repository.TagRepository;
import ro.mybuddy.server.user.model.User;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
public class PostRepositoryTest {
    @Autowired
    PostRepository postRepository;

    @Test
    @Transactional
    void should_FindAll() {
        Post post = new Post("1", TypePost.Adopted,new User("1","pass","email","first","second", LocalDate.now(),"USER"),"body", LocalDate.now(),0.0,0.0, new HashSet<Tag>());
        postRepository.save(post);

        List<Post> all = postRepository.findAll();
        assertThat(all).contains(post);
    }

    @Test
    @Transactional
    void should_Delete() {
        Post post = new Post("1", TypePost.Adopted,new User("1","pass","email","first","second", LocalDate.now(),"USER"),"body", LocalDate.now(),0.0,0.0, new HashSet<Tag>());
        postRepository.save(post);
        postRepository.delete(post);

        List<Post> all = postRepository.findAll();
        assertThat(all).hasSize(0);
    }

    @Test
    @Transactional
    void should_Find() {
        Post post = new Post("1", TypePost.Adopted,new User("1","pass","email","first","second", LocalDate.now(),"USER"),"body", LocalDate.now(),0.0,0.0, new HashSet<Tag>());
        postRepository.save(post);

        Post p = postRepository.findPostById(post.getId());
        assertThat(p).isEqualTo(post);
    }
}
