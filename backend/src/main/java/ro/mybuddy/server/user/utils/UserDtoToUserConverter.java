package ro.mybuddy.server.user.utils;

import ro.mybuddy.server.user.model.User;
import ro.mybuddy.server.user.model.UserDto;

public class UserDtoToUserConverter {
    public static User convert(UserDto userDto){
        return new User(userDto.getUsername(), userDto.getPassword(), userDto.getEmail(), userDto.getFirstName(),
                userDto.getLastName(), userDto.getDateOfBirth(), "GUEST");
    }
}
