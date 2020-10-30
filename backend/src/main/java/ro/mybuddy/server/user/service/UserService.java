package ro.mybuddy.server.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.user.repository.UserRepository;

@Component
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
