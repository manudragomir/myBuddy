package ro.mybuddy.server.user.service;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.user.exceptions.NotMatchingPassword;
import ro.mybuddy.server.user.exceptions.UnverifiedUser;
import ro.mybuddy.server.user.exceptions.UsernameOrEmailNotFound;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.repository.UserRepository;

import java.time.LocalDateTime;

@Component
public class UserService {
    @Autowired
    private UserRepository userRepository;

    //@Autowired
    //private PasswordEncoder passwordEncoder;

    private User findByUserOrEmail(String userOrEmail) {
        User userByUsername = userRepository.findByUsername(userOrEmail);
        if (userByUsername != null) {
            return userByUsername;
        } else {
            return userRepository.findByEmail(userOrEmail);
        }
    }
}
