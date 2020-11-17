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

@Component
public class TagService {
    @Autowired
    TagRepository tagRepository;

    @Autowired
    PostRepository postRepository;

    public List<Tag> findAll(){
        return tagRepository.findAll();
    }

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

    public Tag saveTag(Tag tag){
        tag = tagRepository.save(tag);
        if(tag==null){
            throw new SaveTagException("Error adding tag to database");
        }
        return tag;
    }
}
