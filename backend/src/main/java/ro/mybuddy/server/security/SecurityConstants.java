package ro.mybuddy.server.security;

class SecurityConstants {
    // Secret key generated with:
    // SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256)
    // String secretString = Encoders.BASE64.encode(secretKey.getEncoded())
    static final String SECRET = "xg42GDzQFaJn9AbzsPpOc9163ZPhughircy3ROdVpO8=";

    static final String AUTH_TOKEN_PREFIX = "Bearer";

    static final String AUTH_HEADER = "Authorization";
}
