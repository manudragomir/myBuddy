package ro.mybuddy.server.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.mybuddy.server.user.exceptions.InvalidTokenException;
import ro.mybuddy.server.user.exceptions.TokenException;
import ro.mybuddy.server.user.exceptions.TokenNotFoundException;
import ro.mybuddy.server.user.exceptions.UserException;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.service.UserService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    // TODO embed the inner code in the sign-up function
    @RequestMapping(value = "/user/test-send-confirmation", method = RequestMethod.POST)
    public ResponseEntity<Void> Registration(@RequestParam(name="username") String username) {
        User user = userService.findByUsername(username);
        userService.emailNewTokenToUser(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/user/confirm-account", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<String> confirmAccount(@RequestParam(name="token") String confirmationToken) {
        try {
            return new ResponseEntity<>(userService.confirmAccount(confirmationToken), HttpStatus.OK);
        } catch (TokenNotFoundException te) {
            return new ResponseEntity<>(te.getMessage(), HttpStatus.GONE);
        } catch (InvalidTokenException te) {
            return new ResponseEntity<>(te.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        } catch (UserException te) {
            return new ResponseEntity<>(te.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
