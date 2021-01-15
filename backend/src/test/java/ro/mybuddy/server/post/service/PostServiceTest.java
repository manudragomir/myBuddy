package ro.mybuddy.server.post.service;

import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import ro.mybuddy.server.post.model.FilterPrototype;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.post.repository.PostRepository;
import ro.mybuddy.server.post.utils.TypePost;
import ro.mybuddy.server.tag.model.Tag;
import ro.mybuddy.server.tag.repository.TagRepository;
import ro.mybuddy.server.tag.service.TagService;
import ro.mybuddy.server.user.model.User;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
public class PostServiceTest {
    @InjectMocks
    private PostService postService;

    @Mock
    private PostRepository postRepository;


    @Before
    public void createMocks() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void should_FindAllPosts() {
        Post post = new Post("1", TypePost.Adopted,new User("1","pass","email","first","second", LocalDate.now(),"USER"),"body", LocalDate.now(),0.0,0.0, new HashSet<Tag>());
        when(postRepository.findPostsFiltered(Arrays.asList(new Tag("any")),null,null,90.0,90.0,0.0)).thenReturn(Collections.singletonList(post));
        List<Post> all = postService.findAll(new FilterPrototype());

        assertThat(all).contains(post);
        assertThat(all.size()).isEqualTo(1);
    }

    @Test
    void should_DeletePost() {
        Post post = new Post("1", TypePost.Adopted,new User("1","pass","email","first","second", LocalDate.now(),"USER"),"body", LocalDate.now(),0.0,0.0, new HashSet<Tag>());
        postRepository.save(post);
        postService.deletePost(post);
        List<Post> all = postService.findAll(new FilterPrototype());

        assertThat(all.size()).isEqualTo(0);
    }

}
