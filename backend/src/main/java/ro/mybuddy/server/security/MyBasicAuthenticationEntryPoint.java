package ro.mybuddy.server.security;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class MyBasicAuthenticationEntryPoint extends BasicAuthenticationEntryPoint {
    @Override
    public void commence(
            HttpServletRequest request, HttpServletResponse response, AuthenticationException authEx)
            throws IOException {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND); // set status
        PrintWriter writer = response.getWriter();
        writer.println(authEx.getMessage()); // set message
    }

    @Override
    public void afterPropertiesSet() {
        super.afterPropertiesSet();
    }
}
