package ro.mybuddy.server.post.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.post.exceptions.AddPostException;
import ro.mybuddy.server.post.exceptions.DeletePostException;
import ro.mybuddy.server.post.exceptions.PostNotFoundException;
import ro.mybuddy.server.post.exceptions.UpdatePostException;
import ro.mybuddy.server.post.model.FilterPrototype;
import ro.mybuddy.server.post.model.Index;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.post.model.Range;
import ro.mybuddy.server.post.repository.IndexRepository;
import ro.mybuddy.server.post.repository.PostRepository;
import ro.mybuddy.server.post.utils.StringGenerator;
import ro.mybuddy.server.tag.model.Tag;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.repository.UserRepository;
import ro.mybuddy.server.user.utils.GetAuthenticatedUserId;

import java.util.*;

@Component
public class PostService {
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private IndexRepository indexRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Post> findAll(FilterPrototype filterPrototype){
        Long id = null;
        if(filterPrototype.username!=null){
            User user = userRepository.findByUsernameOrEmail(filterPrototype.username,null);
            if(user!=null)
                id = user.getId();
            else return Arrays.asList();
        }
        List<Tag> l = Arrays.asList(new Tag("any"));
        if(filterPrototype.listTags!=null) l = filterPrototype.listTags;

        if(filterPrototype.range == null)
            filterPrototype.range = new Range(90.0,90.0,0.0);

        List<Post> list;
        Integer ord=null;

        if(filterPrototype.type!=null)
            ord = filterPrototype.type.ordinal();
        if(filterPrototype.page == null){
            list = postRepository.findPostsFiltered(l,id,ord,filterPrototype.range.getLongitude(),filterPrototype.range.getLatitude(),filterPrototype.range.getRange());
        }
        else{
            Pageable page = PageRequest.of(filterPrototype.page.nrOrd,filterPrototype.page.size);
            list = postRepository.findPostsFiltered(l,id,ord,filterPrototype.range.getLongitude(),filterPrototype.range.getLatitude(),filterPrototype.range.getRange(),page);
        }
        return list;
    }

    public Post savePost(Post post){
        User currentUser = userRepository.findByUsernameOrEmail(GetAuthenticatedUserId.get(),"");
        if(currentUser == null){
            throw new UsernameNotFoundException("User does not exist");
        }
        post.setUser(currentUser);

        Index index = getIndex();
        String id = StringGenerator.generate() + index.getId().toString();
        post.setId(id);

        try{
            post = postRepository.save(post);
        } catch(JpaObjectRetrievalFailureException e){
            throw new AddPostException("Tag does not exist");
        }

        if(post==null){
            throw new AddPostException("Error adding post to the database");
        }
        return post;
    }

    private Index getIndex(){
        List<Index> l = indexRepository.findAll();
        if(l.size()==0)
            indexRepository.save(new Index(0));
        Index i = indexRepository.findAll().get(0);
        indexRepository.deleteAll();
        i.setId(i.getId()+1);
        indexRepository.save(i);
        return i;
    }

    public String deletePost(Post post){
        try{
            postRepository.delete(post);
        } catch(JpaObjectRetrievalFailureException e){
            throw new DeletePostException("Error deleting post");
        }

        if(post==null)
            throw new DeletePostException("Error deleting post");
        return "Successfully deleted";
    }

    public Post updatePost(Post post){
        User currentUser = userRepository.findByUsernameOrEmail(GetAuthenticatedUserId.get(),"");
        if(currentUser == null){
            throw new UsernameNotFoundException("User does not exist");
        }

        post.setUser(currentUser);

        try{
            post = postRepository.save(post);
        } catch(JpaObjectRetrievalFailureException e){
            throw new UpdatePostException("Tag does not exist");
        }

        if(post==null){
            throw new UpdatePostException("Error updating post to the database");
        }
        return post;
    }

    public Post findById(String id){
        Optional<Post> post = postRepository.findById(id);
        if(post.isEmpty())
            throw new PostNotFoundException("Post does not exist");
        return post.get();
    }

    public void changeTypePost(String id){
        Post post = postRepository.findById(id).get();
        post.setType(post.getType().update());
        updatePost(post);
    }
}
