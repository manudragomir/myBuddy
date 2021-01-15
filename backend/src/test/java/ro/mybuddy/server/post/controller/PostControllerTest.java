package ro.mybuddy.server.post.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ro.mybuddy.server.post.exceptions.DeletePostException;
import ro.mybuddy.server.post.exceptions.PostNotFoundException;
import ro.mybuddy.server.post.exceptions.UpdatePostException;
import ro.mybuddy.server.post.model.FilterPrototype;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.post.service.PostService;
import ro.mybuddy.server.post.utils.LocalDateAdapter;
import ro.mybuddy.server.post.utils.TypePost;
import ro.mybuddy.server.tag.controller.TagController;
import ro.mybuddy.server.tag.exceptions.DeleteTagException;
import ro.mybuddy.server.tag.model.Tag;
import ro.mybuddy.server.tag.service.TagService;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.service.UserService;
import ro.mybuddy.server.websockets.EventHandler;
import springfox.documentation.spring.web.json.Json;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
//@SpringBootTest
//@AutoConfigureMockMvc
//@ActiveProfiles("test")
//@WebMvcTest(TagController.class)
class PostControllerTest {

    @Spy
    @InjectMocks
    private PostController controller;

    @Mock
    private PostService postService;

    @Mock
    private UserService userService;

    @Mock
    private EventHandler eventHandler;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    public void findAllShould_ReturnEmptyPostList_WhenNoPostInRepo() throws Exception {
        when(postService.findAll(new FilterPrototype()))
                .thenReturn(new ArrayList<>());

        mockMvc
                .perform(post("/post/newsfeed").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(0)));
    }

    @Test
    public void findAllShould_ReturnAllPosts_WhenPostsExistInRepo() throws Exception {
        Post post1 = new Post("1", TypePost.Adopted,new User("1","pass","email","first","second",LocalDate.now(),"USER"),"body", LocalDate.now(),0.0,0.0, new HashSet<Tag>());
        Post post2 = new Post("1", TypePost.Adopted,new User("1","pass","email","first","second",LocalDate.now(),"USER"),"body", LocalDate.now(),0.0,0.0, new HashSet<Tag>());
        userService.addNewUser(new User("1","pass","email","first","second",LocalDate.now(),"USER"));
        when(postService.findAll(new FilterPrototype())).thenReturn(Arrays.asList(post1, post2));

        mockMvc
                .perform(post("/post/newsfeed").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)));
    }

    @Test
    void deleteShould_ReturnError_WhenPostIsMissing() throws Exception {
        doThrow(DeletePostException.class).when(postService).deletePost(new Post("1"));

        mockMvc
                .perform(delete("/post/1"))
                .andExpect(status().isNotAcceptable());
    }

    @Test
    void deleteShould_Succeeded_WhenPostExists() throws Exception {
        Post post1 = new Post("1", TypePost.Adopted,new User("1","pass","email","first","second",LocalDate.now(),"USER"),"body", LocalDate.now(),0.0,0.0, new HashSet<Tag>());
        postService.savePost(post1);

        mockMvc
                .perform(delete("/post/1"))
                .andExpect(status().isAccepted());
    }

    @Test
    void updateShould_ReturnError_WhenPostIsMissing() throws Exception {
        Post post = new Post("1", TypePost.Adopted,new User("1","pass","email","first","second",LocalDate.now(),"USER"),"body", LocalDate.now(),0.0,0.0, new HashSet<Tag>());
        doThrow(UpdatePostException.class).when(postService).updatePost(post);
        Gson gson = new GsonBuilder()
                .setPrettyPrinting()
                .registerTypeAdapter(LocalDate.class, new LocalDateAdapter())
                .create();

        mockMvc
                .perform(put("/post").contentType(MediaType.APPLICATION_JSON).content(gson.toJson(post)))
                .andExpect(status().isNotAcceptable());
    }

    @Test
    void updateShould_Succeed_WhenPostExists() throws Exception {
        Post post = new Post("1", TypePost.Adopted,new User("1","pass","email","first","second",LocalDate.now(),"USER"),"body", LocalDate.now(),0.0,0.0, new HashSet<Tag>());
        postService.savePost(post);
        Gson gson = new GsonBuilder()
                .setPrettyPrinting()
                .registerTypeAdapter(LocalDate.class, new LocalDateAdapter())
                .create();

        mockMvc
                .perform(put("/post").contentType(MediaType.APPLICATION_JSON).content(gson.toJson(post)))
                .andExpect(status().isAccepted());
    }

    @Test
    void getShould_ReturnError_WhenPostIsMissing() throws Exception {
        doThrow(PostNotFoundException.class).when(postService).findById("1");

        mockMvc
                .perform(get("/post/1"))
                .andExpect(status().isNotAcceptable());
    }

    @Test
    void getShould_Succed_WhenPostExists() throws Exception {
        Post post = new Post("1", TypePost.Adopted,new User("1","pass","email","first","second",LocalDate.now(),"USER"),"body", LocalDate.now(),0.0,0.0, new HashSet<Tag>());
        postService.savePost(post);

        mockMvc
                .perform(get("/post/1"))
                .andExpect(status().isAccepted());
    }

    @Test
    void updateTypeShould_ReturnError_WhenPostIsMissing() throws Exception {
        Post post = new Post("1", TypePost.Adopted,new User("1","pass","email","first","second",LocalDate.now(),"USER"),"body", LocalDate.now(),0.0,0.0, new HashSet<Tag>());
        doThrow(UpdatePostException.class).when(postService).changeTypePost("1");

        mockMvc
                .perform(put("/post/type/1"))
                .andExpect(status().isNotAcceptable());
    }

    @Test
    void updateTypeShould_Succeed_WhenPostExists() throws Exception {
        Post post = new Post("1", TypePost.Adopted,new User("1","pass","email","first","second",LocalDate.now(),"USER"),"body", LocalDate.now(),0.0,0.0, new HashSet<Tag>());
        postService.savePost(post);

        mockMvc
                .perform(put("/post/type/1"))
                .andExpect(status().isAccepted());
    }
}