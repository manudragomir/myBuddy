package ro.mybuddy.server.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;
import ro.mybuddy.server.user.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Nullable
    User findByUsernameOrEmail(String username, String email);
}