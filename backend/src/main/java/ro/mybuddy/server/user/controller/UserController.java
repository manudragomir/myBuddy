package ro.mybuddy.server.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import ro.mybuddy.server.user.service.UserService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/user/registration", method = RequestMethod.POST)
    public ResponseEntity<String> Registration() {
        return new ResponseEntity<>("asdf", HttpStatus.OK);
    }


}
