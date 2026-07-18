package com.thlam05.steriox.security.util;

import java.text.ParseException;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.auth.entity.InvalidatedToken;
import com.thlam05.steriox.modules.auth.repository.InvalidatedTokenRepository;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtService {
    private final JwtGenerator jwtGenerator;
    private final JwtValidator jwtValidator;

    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final UserRepository userRepository;

    public String generateAccessToken(User user) {
        return jwtGenerator.generateAccessToken(user);
    }

    public String refreshToken(String token) throws ParseException, JOSEException {
        SignedJWT signedJWT = verify(token, true);

        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder().id(jit).expireAt(expiryTime).build();

        invalidatedTokenRepository.save(invalidatedToken);

        var userId = signedJWT.getJWTClaimsSet().getSubject();

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND));

        token = generateAccessToken(user);
        return token;
    }

    public SignedJWT verify(String token, boolean isRefresh) throws ParseException, JOSEException {
        return jwtValidator.validate(token, isRefresh);
    }

    public boolean introspect(String token) {
        boolean isValid = true;
        try {
            verify(token, false);
        } catch (AppException | JOSEException | ParseException e) {
            isValid = false;
        }
        return isValid;
    }
}
