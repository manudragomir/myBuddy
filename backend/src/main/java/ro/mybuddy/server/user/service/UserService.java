package ro.mybuddy.server.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.repository.UserRepository;

import java.time.LocalDate;

@Component
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void test() {
        System.out.println("In SERVICE - userRepo: " + userRepository);
        userRepository.save(new User("a", "123", "email", "first", "last", LocalDate.now()));
        userRepository.findByUsername("gigel");
    }
}
