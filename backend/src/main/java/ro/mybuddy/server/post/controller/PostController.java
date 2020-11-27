package ro.mybuddy.server.post.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ro.mybuddy.server.post.exceptions.AddPostException;
import ro.mybuddy.server.post.exceptions.DeletePostException;
import ro.mybuddy.server.post.exceptions.PostNotFoundException;
import ro.mybuddy.server.post.exceptions.UpdatePostException;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.tag.model.Tag;
import ro.mybuddy.server.post.service.PostService;
import ro.mybuddy.server.tag.service.TagService;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class PostController {
    @Autowired
    private PostService postService;

    @GetMapping(value = "/post")
    public ResponseEntity<List<Post>> findAll(){
        return new ResponseEntity<List<Post>>(postService.findAll(), HttpStatus.ACCEPTED);
    }

    @PostMapping(value="/post")
    public ResponseEntity<?> savePost(@Valid @RequestBody Post post, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(x -> x.getDefaultMessage())
                    .collect(Collectors.toList());
            return new ResponseEntity<>(errors.toString(), HttpStatus.NOT_ACCEPTABLE);
        }
        try{
            Post post_new = postService.savePost(post);
            return new ResponseEntity<>(post_new, HttpStatus.ACCEPTED);
        } catch(AddPostException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @PutMapping(value="/post")
    public ResponseEntity<?> updatePost(@Valid @RequestBody Post post, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(x -> x.getDefaultMessage())
                    .collect(Collectors.toList());
            return new ResponseEntity<>(errors.toString(), HttpStatus.NOT_ACCEPTABLE);
        }
        try{
            Post post_new = postService.updatePost(post);
            return new ResponseEntity<>(post_new, HttpStatus.ACCEPTED);
        } catch(UpdatePostException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @DeleteMapping(value="/post/{id}")
    ResponseEntity<?> deletePost(@PathVariable String id){
        try{
            return new ResponseEntity<>(postService.deletePost(new Post(id)),HttpStatus.ACCEPTED);
        } catch(DeletePostException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @GetMapping(value="/post/{id}")
    ResponseEntity<?> getById(@PathVariable String id){
        try{
            return new ResponseEntity<>(postService.findById(id),HttpStatus.ACCEPTED);
        } catch(PostNotFoundException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_ACCEPTABLE);
        }
    }

}
