package ro.mybuddy.server.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.Map;
import java.util.logging.Logger;

/**
 * Custom Spring Security Class that only intercepts and handles login requests with username and password
 */
@Component
public class InitialAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private AuthenticationManager authManager;

    private final Logger logger = Logger.getLogger(InitialAuthenticationFilter.class.getName());

    /**
     * Intercepts HTTP requests to the login endpoint ("/user/login") and handles authentication logic
     * Gets the login username and password from the request and tries to identify the correct User(through Spring Security's Authentication Manager)
     * If a system user is successfully identified, then generates and signs a JWT token that is returned in the HTTP response
     * All subsequent requests will use the generated token for authentication
     * @param request Object that encapsulates the intercepted HTTP request
     * @param response Object that encapsulates the retrieved HTTP response
     * @param filterChain Spring Security filter chain; used to pass down the request from one filter to the next
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        logger.info("IN INITIAL AUTH FILTER");
        try {
            // extract the login credentials from the request body
            JSONObject requestBody = (JSONObject) new JSONParser().parse(request.getReader());
            String username = (String) requestBody.get("username");
            String password = (String) requestBody.get("password");
            logger.info("REQUEST BODY:" + requestBody.toString());
            logger.info("username:" + username);
            logger.info("password:" + password);

            // authenticate the user credentials
            authManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

            // generate and sign a jwt for the authenticated user
            SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SecurityConstants.SECRET));
            String jwt = Jwts.builder()
                    .claim("username", username)
                    .setIssuedAt(new Date())
                    .signWith(key)
                    .compact();

            // put the generated jwt in the response body
            JSONObject responseToken = new JSONObject(Map.of("token", jwt));
            logger.info("JSON resp:" + responseToken.toJSONString());
            response.setContentType("application/json");
            response.getWriter().println(responseToken.toJSONString());
            response.getWriter().flush();

        } catch (ParseException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("JSON ParseException");
            response.getWriter().flush();
        }
    }

    /**
     * Ignore all requests to endpoints other than the login endpoint ("/user/login")
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return !request.getServletPath().equals("/user/login");
    }
}
