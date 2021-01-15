package ro.mybuddy.server.user.utils;

import java.util.UUID;

/**
 * Stateless Utility Class that manages generation of random values
 */
public class Random {

    /**
     * Retrieves a string representation of a randomly generated universally unique identifier(UUID)
     * Uses Java's built-in utility package
     * @return String representing the generated UUID
     */
    public static String generateToken() {
        UUID confirmationToken = UUID.randomUUID();
        return confirmationToken.toString();
    }

}