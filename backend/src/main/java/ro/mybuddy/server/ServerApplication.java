package ro.mybuddy.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;

@SpringBootApplication(scanBasePackages = {"ro.mybuddy.server"})
@EnableJpaRepositories("ro.mybuddy.server")
@EntityScan("ro.mybuddy.server")
@EnableSwagger2
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

    @Bean
    public Docket swaggerConfiguration(){
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("ro.mybuddy.server"))
                .build()
                .apiInfo(swaggerDetails());
    }

    private ApiInfo swaggerDetails(){
        return new ApiInfo(
                "MyBuddyApp API",
                "Sample API for befriending with our community",
                "1.0",
                "Free to use",
                new springfox.documentation.service.Contact("MyBuddyTeam", "http://localhost:8100", "mapmandrago@gmail.com"),
                "API License", "API license URL",
                Collections.emptyList()
        );
    }
}
