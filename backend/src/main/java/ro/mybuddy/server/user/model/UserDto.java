package ro.mybuddy.server.user.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    @NotNull(message = "First name must not be null\n")
    private String firstName;
    @NotNull(message = "Last name must not be null\n")
    private String lastName;
    @NotNull(message = "Password must not be null\n")
    private String password;
    @NotNull(message = "Password must not be null\n")
    private String confirmPassword;
    @NotNull(message = "Email must not be null\n")
    @Email(message = "Invalid email\n")
    private String email;
    @NotNull(message = "Birthday must not be null\n")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate dateOfBirth;
    @NotNull(message = "User must not be null\n")
    private String username;

}
