package com.thlam05.steriox.security.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.auth.repository.InvalidatedTokenRepository;
import com.thlam05.steriox.modules.user.entity.User;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtService {
    @Value("${jwt.secretKey}")
    private String secretKey;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    private final InvalidatedTokenRepository invalidatedTokenRepository;

    public String generateAccessToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .claim("scope", buildScope(user))
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(expirationMs, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(secretKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new AppException(ResponseStatus.INTERNAL_SERVER_ERROR, "Token creation error");
        }
    }

    public SignedJWT parseAndValidate(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(secretKey.getBytes());

            boolean verified = signedJWT.verify(verifier);

            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            boolean isNotExpired = expirationTime.after(new Date());

            String tokenId = signedJWT.getJWTClaimsSet().getJWTID();
            boolean isNotInvalidated = !invalidatedTokenRepository.existsById(tokenId);

            if (verified && isNotExpired && isNotInvalidated) {
                return signedJWT;
            } else {
                throw new AppException(ResponseStatus.BAD_REQUEST, "Invalid or expired token");
            }
        } catch (Exception e) {
            throw new AppException(ResponseStatus.INTERNAL_SERVER_ERROR, "Token cannot be verified: " + e.getMessage());
        }
    }

    public String extractSubject(String token) {
        try {
            SignedJWT signedJWT = parseAndValidate(token);
            return signedJWT.getJWTClaimsSet().getSubject();
        } catch (Exception e) {
            throw new AppException(ResponseStatus.INTERNAL_SERVER_ERROR, "Error extracting Subject:" + e.getMessage());
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (user.getRoles().isEmpty())
            return "";
        user.getRoles().forEach(role -> {
            stringJoiner.add("ROLE_" + role.getName());
            role.getPermissions().forEach(permission -> {
                stringJoiner.add(permission.getName());
            });
        });
        return stringJoiner.toString();
    }
}
