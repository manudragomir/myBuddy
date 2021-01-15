package ro.mybuddy.server;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import ro.mybuddy.server.post.controller.PostController;
import ro.mybuddy.server.tag.controller.TagController;

/**
 * Simple sanity check test - will fail if the application context cannot start
 */
@SpringBootTest
@ActiveProfiles("test")
class ServerApplicationTests {

	@Value("${spring.mail.host}")
	private String mailHost;

	@Autowired
	private TagController tagController;

	@Autowired
	private PostController postController;

	@Test
	void contextLoads() {
		System.out.println("mailHost ::: " + mailHost);
		assertThat(tagController).isNotNull();
		assertThat(postController).isNotNull();
	}

}
