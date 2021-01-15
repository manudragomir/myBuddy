package ro.mybuddy.server.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.logging.Logger;

/**
 * Custom Spring Security Class that handles authorization with JWT token for all secured endpoints other than the login endpoint
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    private final Logger logger = Logger.getLogger(JwtAuthenticationFilter.class.getName());

    /**
     * Intercepts HTTP requests to all secured endpoints(other than "/user/login") and handles authentication logic
     * Gets the JWT token from the request and tries to parse and validate it
     * Gets the username from the claims of the token and identifies a system user with the username
     * If a user is found, authentication is considered successful and the details of the authenticated user are stored in the Security Context
     * @param request Object that encapsulates the intercepted HTTP request
     * @param response Object that encapsulates the retrieved HTTP response
     * @param filterChain Spring Security filter chain; used to pass down the request from one filter to the next
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        logger.info("IN JWT FILTER");
        // retrieve the Authorization header from the request
        String authHeaderValue = request.getHeader(SecurityConstants.AUTH_HEADER);
        logger.info("Auth Header: " + authHeaderValue);
        if (authHeaderValue == null) {
            logger.info("NO AUTH HEADER - PASSING TO AUTHORIZATION FILTER");
            filterChain.doFilter(request, response);
            return;
        }
        // extract the jwt token from the header
        String jwt = authHeaderValue.replace(SecurityConstants.AUTH_TOKEN_PREFIX + " ", "");
        logger.info("Auth Token: " + jwt);

        // parse the jwt token
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SecurityConstants.SECRET));
        Claims claims = null;
        try {
            claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();
        } catch (UnsupportedJwtException | MalformedJwtException | SignatureException e) {
            e.printStackTrace();
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid auth token - " + e.getMessage());
        } catch (ExpiredJwtException e) {
            e.printStackTrace();
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Auth token expired - " + e.getMessage());
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Empty auth token - " + e.getMessage());
        }

        if (claims == null)
            return;

        // gets the username from the claims of the jwt token
        String username = String.valueOf(claims.get("username"));
        try {
            // identifies a user with the username
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            var auth = new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());
            // stores the authenticated user details in Spring Security's Security Context
            SecurityContextHolder.getContext().setAuthentication(auth);
            filterChain.doFilter(request, response);

        } catch (UsernameNotFoundException e) {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Username could not be found");
        }
    }

    /**
     * Utility function to store an error in the HTTP response
     * @param response Object that gets modified and encapsulates the HTTP response
     * @param scErrorCode HTTP error code to store in response
     * @param errorMsg String with human-readable error message to write in response
     */
    private void sendError(HttpServletResponse response, int scErrorCode, String errorMsg) throws IOException {
        response.setStatus(scErrorCode);
        response.getWriter().println(errorMsg);
        response.getWriter().flush();
    }

    /**
     * Ignore requests to the login endpoint("/user/login"), but handle all other endpoints
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getServletPath().equals("/user/login");
    }
}
