package ro.mybuddy.server.user.utils;

import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Stateless Utility Class for interfacing with Spring Security's SecurityContext
 */
public class GetAuthenticatedUserId {
    /**
     * Retrieves the username of the currently authenticated user from the SecurityContext
     * @return String representing the username of the currently authenticated user
     *         null, if no user logged in
     */
    public static String get(){
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
