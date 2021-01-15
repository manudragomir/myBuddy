package ro.mybuddy.server.post.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ro.mybuddy.server.post.exceptions.AddPostException;
import ro.mybuddy.server.post.exceptions.DeletePostException;
import ro.mybuddy.server.post.exceptions.PostNotFoundException;
import ro.mybuddy.server.post.exceptions.UpdatePostException;
import ro.mybuddy.server.post.model.FilterPrototype;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.tag.model.Tag;
import ro.mybuddy.server.post.service.PostService;
import ro.mybuddy.server.tag.service.TagService;
import ro.mybuddy.server.websockets.EventHandler;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller handling the communication with clients
 */
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class PostController {
    @Autowired
    private PostService postService;

    @Autowired
    private EventHandler eventHandler;

    @PostMapping(value = "/post/newsfeed")
    @ApiOperation(value="Returns a list of posts filter by specified criteria")
    @ApiResponses(value={
            @ApiResponse(code=200,message="The request has succeeded"),
            @ApiResponse(code=406,message="Error retrieving the posts")
    })
    public ResponseEntity<?> findAll(@Valid @RequestBody FilterPrototype filterPrototype, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(x -> x.getDefaultMessage()).collect(Collectors.toList());
            return new ResponseEntity<>(errors.toString(),HttpStatus.NOT_ACCEPTABLE);
        }

        return new ResponseEntity<List<Post>>(postService.findAll(filterPrototype),HttpStatus.OK);
    }

    @PostMapping(value="/post")
    @ApiOperation(value="Saves a post for a specific user")
    @ApiResponses(value={
            @ApiResponse(code=200,message="The request has succeeded"),
            @ApiResponse(code=406,message="Error saving the post")
    })
    public ResponseEntity<?> savePost(@Valid @RequestBody Post post, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(x -> x.getDefaultMessage())
                    .collect(Collectors.toList());
            return new ResponseEntity<>(errors.toString(), HttpStatus.NOT_ACCEPTABLE);
        }
        try{
            Post post_new = postService.savePost(post);
            eventHandler.newPost(post);
            return new ResponseEntity<Post>(post_new, HttpStatus.ACCEPTED);
        } catch(AddPostException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @PutMapping(value="/post")
    @ApiOperation(value="Updates an existing post")
    @ApiResponses(value={
            @ApiResponse(code=200,message="The request has succeeded"),
            @ApiResponse(code=406,message="Error updating the post")
    })
    public ResponseEntity<?> updatePost(@Valid @RequestBody Post post, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(x -> x.getDefaultMessage())
                    .collect(Collectors.toList());
            return new ResponseEntity<>(errors.toString(), HttpStatus.NOT_ACCEPTABLE);
        }
        try{
            Post post_new = postService.updatePost(post);
            eventHandler.updatePost(post_new);
            return new ResponseEntity<>(post_new, HttpStatus.ACCEPTED);
        } catch(UpdatePostException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @ApiOperation(value="Updates the type for a specific post")
    @ApiResponses(value={
            @ApiResponse(code=200,message="The request has succeeded"),
            @ApiResponse(code=406,message="Error updating the post")
    })
    @PutMapping(value="/post/type/{id}")
    public ResponseEntity<?> updatePost(@PathVariable String id){
        try{
            Post p = postService.changeTypePost(id);
            eventHandler.updatePost(p);
            return new ResponseEntity<>("updated",HttpStatus.ACCEPTED);
        } catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @ApiOperation(value="Deletes an existing post")
    @ApiResponses(value={
            @ApiResponse(code=200,message="The request has succeeded"),
            @ApiResponse(code=406,message="Error deleting the post")
    })
    @DeleteMapping(value="/post/{id}")
    ResponseEntity<?> deletePost(@PathVariable String id){
        try{
            postService.deletePost(new Post(id));
            eventHandler.deletePost(id);
            return new ResponseEntity<>("deleted",HttpStatus.ACCEPTED);
        } catch(DeletePostException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @ApiOperation(value="Returns a post which contains the given id")
    @ApiResponses(value={
            @ApiResponse(code=200,message="The request has succeeded"),
            @ApiResponse(code=406,message="Error retrieving the post")
    })
    @GetMapping(value="/post/{id}")
    ResponseEntity<?> getById(@PathVariable String id){
        try{
            return new ResponseEntity<>(postService.findById(id),HttpStatus.ACCEPTED);
        } catch(PostNotFoundException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_ACCEPTABLE);
        }
    }

}
