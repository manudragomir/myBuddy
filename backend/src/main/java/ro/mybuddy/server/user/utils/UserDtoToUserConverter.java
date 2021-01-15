package ro.mybuddy.server.user.utils;

import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.model.UserDto;

/**
 * Stateless Utility Class that manages conversions of User(Entity) to/from User(DTO)
 */
public class UserDtoToUserConverter {
    /**
     * Converts a UserDto to a User entity and returns it
     * @param userDto UserDto to convert to User
     * @return Converted User
     */
    public static User convert(UserDto userDto){
        return new User(userDto.getUsername(), userDto.getPassword(), userDto.getEmail(), userDto.getFirstName(),
                userDto.getLastName(), userDto.getDateOfBirth(), "GUEST");
    }
}
