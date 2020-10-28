package ro.mybuddy.server.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ro.mybuddy.server.user.service.UserService;

@CrossOrigin
@RestController("/mybuddy/user")
public class LoginController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login() {
        System.out.println(userService);
        userService.test();
        return "OK";
    }
}
