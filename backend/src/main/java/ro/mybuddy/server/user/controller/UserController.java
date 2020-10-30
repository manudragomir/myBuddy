package ro.mybuddy.server.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import ro.mybuddy.server.user.service.UserService;

@CrossOrigin
@RestController
public class UserController {

    @Autowired
    private UserService userService;
}
