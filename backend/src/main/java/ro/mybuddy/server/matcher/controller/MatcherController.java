package ro.mybuddy.server.matcher.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ro.mybuddy.server.matcher.model.Dog;
import ro.mybuddy.server.matcher.model.MatchDogRequest;
import ro.mybuddy.server.matcher.service.MatcherService;

import javax.validation.Valid;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class MatcherController {
    @Autowired
    private MatcherService matcherService;

    @PostMapping(value = "/match/dog")
    @ApiOperation(value = "Returns the suitable dog for you, given your request")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The request has succeeded"),
            @ApiResponse(code = 406, message = "The MatchDogRequest in post body is not correct") })
    public ResponseEntity<?> matchDogBreed(@Valid @RequestBody MatchDogRequest matchRequest, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(x -> x.getDefaultMessage()).collect(Collectors.toList());
            return new ResponseEntity<>(errors.toString(), HttpStatus.NOT_ACCEPTABLE);
        }

        System.out.println(matchRequest);
        return new ResponseEntity<Dog>(matcherService.matchDogBreed(matchRequest),HttpStatus.OK);
    }


    @GetMapping(value = "/match/dog/purposes")
    @ApiOperation(value = "Returns a set of purposes of all dogs in our database")
    public ResponseEntity<?> getPurposes(){
        return new ResponseEntity<Set<String>>(matcherService.getPurposes(),HttpStatus.OK);
    }

    @GetMapping(value = "/match/dog/skills")
    @ApiOperation(value = "Returns a set of skills of all dogs in our database")
    public ResponseEntity<?> getSkills(){
        return new ResponseEntity<Set<String>>(matcherService.getSkills(),HttpStatus.OK);
    }

}
