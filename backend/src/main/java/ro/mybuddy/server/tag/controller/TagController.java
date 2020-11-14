package ro.mybuddy.server.tag.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ro.mybuddy.server.post.exceptions.AddPostException;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.post.service.PostService;
import ro.mybuddy.server.tag.exceptions.DeleteTagException;
import ro.mybuddy.server.tag.exceptions.SaveTagException;
import ro.mybuddy.server.tag.model.Tag;
import ro.mybuddy.server.tag.service.TagService;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class TagController {
    @Autowired
    private TagService tagService;

    @GetMapping(value="/tag")
    public ResponseEntity<?> findAll(){
        return new ResponseEntity<>(tagService.findAll(),HttpStatus.ACCEPTED);
    }

    @DeleteMapping(value="/tag/{id}")
    public ResponseEntity<?> deleteTag(@PathVariable String id){
        try{
            tagService.deleteTag(new Tag(id));
            return new ResponseEntity<>("Deleted successfully",HttpStatus.ACCEPTED);
        } catch(DeleteTagException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_ACCEPTABLE);
        }

    }

    @PostMapping(value="/tag")
    public ResponseEntity<?> saveTag(@Valid @RequestBody Tag tag,BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(x -> x.getDefaultMessage())
                    .collect(Collectors.toList());
            return new ResponseEntity<>(errors.toString(), HttpStatus.NOT_ACCEPTABLE);
        }
        try{
            return new ResponseEntity<>(tagService.saveTag(tag),HttpStatus.ACCEPTED);
        } catch(SaveTagException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_ACCEPTABLE);
        }
    }

}
