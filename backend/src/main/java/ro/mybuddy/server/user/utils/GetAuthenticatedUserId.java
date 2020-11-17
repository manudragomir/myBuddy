package ro.mybuddy.server.user.utils;

import org.springframework.security.core.context.SecurityContextHolder;

public class GetAuthenticatedUserId {
    public static String get(){
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
