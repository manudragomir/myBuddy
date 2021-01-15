package ro.mybuddy.server.tag.service;

import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import ro.mybuddy.server.post.repository.PostRepository;
import ro.mybuddy.server.tag.model.Tag;
import ro.mybuddy.server.tag.repository.TagRepository;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
class TagServiceTest {

    @InjectMocks
    private TagService tagService;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private PostRepository postRepository;

    @Before
    public void createMocks() {
        MockitoAnnotations.initMocks(this);
    }


    @Test
    void should_FindAllTags() {
        Tag tagCat = new Tag("cat");
        when(tagRepository.findAll()).thenReturn(Collections.singletonList(tagCat));
        List<Tag> all = tagService.findAll();

        assertThat(all).contains(tagCat);
        assertThat(all.size()).isEqualTo(1);
    }

}