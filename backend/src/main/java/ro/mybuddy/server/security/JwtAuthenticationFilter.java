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

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    private final Logger logger = Logger.getLogger(JwtAuthenticationFilter.class.getName());

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        logger.info("IN JWT FILTER");
        String authHeaderValue = request.getHeader(SecurityConstants.AUTH_HEADER);
        logger.info("Auth Header: " + authHeaderValue);
        if (authHeaderValue == null) {
            logger.info("NO AUTH HEADER - PASSING TO AUTHORIZATION FILTER");
            filterChain.doFilter(request, response);
            return;
        }
        String jwt = authHeaderValue.replace(SecurityConstants.AUTH_TOKEN_PREFIX + " ", "");
        logger.info("Auth Token: " + jwt);

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

        String username = String.valueOf(claims.get("username"));
        try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            var auth = new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
            filterChain.doFilter(request, response);

        } catch (UsernameNotFoundException e) {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Username could not be found");
        }
    }

    private void sendError(HttpServletResponse response, int scErrorCode, String errorMsg) throws IOException {
        response.setStatus(scErrorCode);
        response.getWriter().println(errorMsg);
        response.getWriter().flush();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getServletPath().equals("/user/login");
    }
}
