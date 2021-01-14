package ro.mybuddy.server.tag.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.post.exceptions.AddPostException;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.post.repository.PostRepository;
import ro.mybuddy.server.tag.exceptions.DeleteTagException;
import ro.mybuddy.server.tag.exceptions.SaveTagException;
import ro.mybuddy.server.tag.model.Tag;
import ro.mybuddy.server.tag.repository.TagRepository;

import java.util.List;

/***
 * Service that works with tags
 * @see Tag
 */
@Component
public class TagService {
    @Autowired
    TagRepository tagRepository;

    @Autowired
    PostRepository postRepository;

    /***
     * Returns a list of tags
     * @return List<Tag> A list of all tags
     */
    public List<Tag> findAll(){
        return tagRepository.findAll();
    }

    /***
     * Method that deletes one tag
     * @param tag Tag that will be deleted
     * @throws DeleteTagException Throw exception if tag cannot be deleted/found
     */
    public void deleteTag(Tag tag){
        try{
            for(Post post: postRepository.findPostsByTagsContains(tag)){
                post.getTags().remove(tag);
            }

            tagRepository.delete(tag);
        } catch(JpaObjectRetrievalFailureException e){
            throw new DeleteTagException("");
        }
    }

    /***
     * Method that saves one tag
     * @param tag Tag that will be saved
     * @throws SaveTagException Throw exception if tag cannot be added
     */
    public Tag saveTag(Tag tag){
        tag = tagRepository.save(tag);
        if(tag==null){
            throw new SaveTagException("Error adding tag to database");
        }
        return tag;
    }
}
