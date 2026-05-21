package com.thlam05.steriox.security.service;

import java.text.ParseException;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.auth.repository.InvalidatedTokenRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtValidator {
    @Value("${jwt.secret-key}")
    private String secretKey;

    @Value("${jwt.refreshable-duration}")
    private long refreshableDuration;

    private final InvalidatedTokenRepository invalidatedTokenRepository;

    public SignedJWT validate(String token, boolean isRefresh) throws ParseException, JOSEException {
        SignedJWT signedJWT = SignedJWT.parse(token);

        JWSVerifier verifier = new MACVerifier(secretKey.getBytes());
        boolean verified = signedJWT.verify(verifier);

        if (!verified) {
            throw new AppException(ResponseStatus.UNAUTHORIZED, "Invalid token");
        }

        JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
        validateExpiration(claimsSet, isRefresh);
        validateRevoked(claimsSet);
        return signedJWT;
    }

    private void validateRevoked(JWTClaimsSet claimsSet) {
        String jti = claimsSet.getJWTID();
        boolean revoked = invalidatedTokenRepository.existsById(jti);
        if (revoked) {
            throw new AppException(ResponseStatus.UNAUTHORIZED, "Token revoked");
        }
    }

    private void validateExpiration(JWTClaimsSet claimsSet, boolean isRefresh) throws ParseException {
        if (isRefresh ? new Date(claimsSet
                .getExpirationTime()
                .toInstant()
                .plus(refreshableDuration, ChronoUnit.SECONDS)
                .toEpochMilli()).before(new Date())
                : claimsSet.getExpirationTime().before(new Date())) {
            throw new AppException(ResponseStatus.UNAUTHORIZED, "Token expired");
        }
    }
}
