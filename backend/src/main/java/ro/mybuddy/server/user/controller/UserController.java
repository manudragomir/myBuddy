package ro.mybuddy.server.user.controller;

import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ro.mybuddy.server.user.exceptions.*;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.model.UserDto;
import ro.mybuddy.server.user.service.UserService;
import ro.mybuddy.server.user.utils.UserDtoToUserConverter;

import javax.validation.*;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller that defines the endpoints operating on User entities
 */
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @ApiOperation(value = "Logs user into the system")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Login successful; Token generated"),
            @ApiResponse(code = 404, message = "Invalid credentials")})
    @ApiImplicitParams(value = {
        @ApiImplicitParam(name = "username"),
        @ApiImplicitParam(name = "password")
    })
    @PostMapping(value = "/user/login")
    public void login() {}

    @ApiOperation(value = "Creates a new account")
    @PostMapping(value = "/user/registration")
    public ResponseEntity<?> signUp(@Valid @RequestBody UserDto newUser, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(x -> x.getDefaultMessage())
                    .collect(Collectors.toList());

            return new ResponseEntity<>(errors.toString(), HttpStatus.NOT_ACCEPTABLE);
        }
        if(!newUser.getPassword().equals(newUser.getConfirmPassword())){
            return new ResponseEntity<String>("Passwords do not match", HttpStatus.BAD_REQUEST);
        }
        User newCheckedUser = UserDtoToUserConverter.convert(newUser);
        try {
            userService.addNewUser(newCheckedUser);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (SignUpException ue) {
            return new ResponseEntity<>(ue.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @ApiOperation(value = "Confirms a previously created account")
    @RequestMapping(value = "/user/confirm-account", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<String> confirmAccount(@RequestParam(name="token") String confirmationToken) {
        try {
            return new ResponseEntity<>(userService.confirmAccount(confirmationToken), HttpStatus.OK);
        } catch (TokenNotFoundException te) {
            return new ResponseEntity<>(te.getMessage(), HttpStatus.GONE);
        } catch (InvalidTokenException te) {
            return new ResponseEntity<>(te.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        } catch (UserException ue){
            return new ResponseEntity<>(ue.getMessage(), HttpStatus.CONFLICT);
        }
    }
}
