package ro.mybuddy.server.user.service;

import ro.mybuddy.server.user.exceptions.TokenException;

public class TokenAlreadyGeneratedException extends TokenException {
    public TokenAlreadyGeneratedException() {
    }

    public TokenAlreadyGeneratedException(String message) {
        super(message);
    }
}
