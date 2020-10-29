package ro.mybuddy.server.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ro.mybuddy.server.user.exceptions.NotMatchingPassword;
import ro.mybuddy.server.user.exceptions.UsernameOrEmailNotFound;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.service.UserService;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController("/mybuddy/user")
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String login(@RequestParam("useroremail") String userOrEmail, @RequestParam("password") String password) {
        try {
            System.out.println("Controller before login");
            String loginToken = userService.login(userOrEmail, password);
            System.out.println("loginToken: " + loginToken);
            return loginToken;
        } catch (NotMatchingPassword passException) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        } catch (UsernameOrEmailNotFound notFoundException) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/ok")
    public String a() {
        return "OK";
    }
}
