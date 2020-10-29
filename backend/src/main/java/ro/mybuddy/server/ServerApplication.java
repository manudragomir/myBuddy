package ro.mybuddy.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication(scanBasePackages = {"ro.mybuddy.server"})
@EnableJpaRepositories("ro.mybuddy.server")
@EntityScan("ro.mybuddy.server")
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

    //@Bean
    //public PasswordEncoder passwordEncoder() {
     //   return new BCryptPasswordEncoder();
   // }
}
