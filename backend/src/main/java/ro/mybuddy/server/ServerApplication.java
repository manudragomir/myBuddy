package ro.mybuddy.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import ro.mybuddy.server.user.service.UserService;

@EnableJpaRepositories("ro.mybuddy.server.user.repository")
@SpringBootApplication(scanBasePackages = {"ro.mybuddy.server"})
//@ComponentScan({"ro.mybuddy.server"})
//@ComponentScan(
//        basePackageClasses = UserRepository.class,
//        useDefaultFilters = false,
//        includeFilters = {
//                @ComponentScan.Filter(type = ASSIGNABLE_TYPE, value = UserRepository.class)
//        })
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
//        UserService userService = new UserService();
//        System.out.println("In APP - userService: " + userService);
//        userService.test();
    }

}
