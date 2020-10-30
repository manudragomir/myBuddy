package ro.mybuddy.server.user.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.repository.UserRepository;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        org.springframework.security.core.userdetails.User.UserBuilder builder = org.springframework.security.core.userdetails.User.withUsername(username);
        builder.password(new BCryptPasswordEncoder().encode(user.getPassword()));
        builder.roles(user.getRole());
        return builder.build();
    }
}