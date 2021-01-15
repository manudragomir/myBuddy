package ro.mybuddy.server.tag.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ro.mybuddy.server.tag.exceptions.DeleteTagException;
import ro.mybuddy.server.tag.model.Tag;
import ro.mybuddy.server.tag.service.TagService;

import java.util.ArrayList;
import java.util.Arrays;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
//@SpringBootTest
//@AutoConfigureMockMvc
//@ActiveProfiles("test")
//@WebMvcTest(TagController.class)
class TagControllerTest {

    @Spy
    @InjectMocks
    private TagController controller;

    @Mock
    private TagService tagService;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    public void findAllShould_ReturnEmptyTagList_WhenNoTagInRepo() throws Exception {
        when(tagService.findAll())
                .thenReturn(new ArrayList<>());

        mockMvc
                .perform(get("/tag"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.size()", is(0)));
    }

    @Test
    public void findAllShould_ReturnAllTags_WhenTagsExistInRepo() throws Exception {
        Tag tag1 = new Tag("#cat");
        Tag tag2 = new Tag("#dog");
        when(tagService.findAll()).thenReturn(Arrays.asList(tag1, tag2));

        mockMvc
                .perform(get("/tag"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.size()", is(2)));
    }

    @Test
    void deleteShould_ReturnRequestFailed_WhenTagIsMissing() throws Exception {
        String TAG_ID = "cat";
        doThrow(DeleteTagException.class).when(tagService).deleteTag(new Tag(TAG_ID));

        mockMvc
                .perform(delete("/tag/cat"))
                .andExpect(status().isNotAcceptable());
    }
}