package ro.mybuddy.server.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.user.exceptions.SignUpException;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.model.UserDto;
import ro.mybuddy.server.user.repository.UserRepository;

@Component
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void addNewUser(User newUser){
        User returnedUser = userRepository.save(newUser);
        if(returnedUser == null){
            throw new SignUpException("Error when added to database");
        }
    }
}
