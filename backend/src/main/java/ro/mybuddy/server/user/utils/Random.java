package ro.mybuddy.server.user.utils;

import java.util.UUID;

public class Random {
    public static String generateToken() {
        UUID confirmationToken = UUID.randomUUID();
        return confirmationToken.toString();
    }

}
