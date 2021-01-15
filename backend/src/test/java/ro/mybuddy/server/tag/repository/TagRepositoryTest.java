package ro.mybuddy.server.tag.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import ro.mybuddy.server.tag.model.Tag;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class TagRepositoryTest {

    @Autowired
    TagRepository tagRepository;

    @Test
    void should_FindAll() {
        Tag cat = new Tag("cat");
        tagRepository.save(cat);

        List<Tag> all = tagRepository.findAll();
        assertThat(all).contains(cat);
    }
}