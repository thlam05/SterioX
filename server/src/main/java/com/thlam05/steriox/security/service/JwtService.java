package com.thlam05.steriox.security.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
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

@Component
public class JwtService {

    public static final String USERNAME_CLAIM = "username";

    @Value("${jwt.secretKey}")
    private String secretKey;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    public String generateAccessToken(String userId, String username) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(userId)
                .claim(USERNAME_CLAIM, username)
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
            throw new RuntimeException("Lỗi khi tạo Token: " + e.getMessage());
        }
    }

    public SignedJWT parseAndValidate(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(secretKey.getBytes());

            boolean verified = signedJWT.verify(verifier);

            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            boolean isNotExpired = expirationTime.after(new Date());

            if (verified && isNotExpired) {
                return signedJWT;
            } else {
                throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn");
            }
        } catch (Exception e) {
            throw new RuntimeException("Không thể xác thực Token: " + e.getMessage());
        }
    }

    public String extractSubject(String token) {
        try {
            SignedJWT signedJWT = parseAndValidate(token);
            return signedJWT.getJWTClaimsSet().getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi trích xuất Subject: " + e.getMessage());
        }
    }
}
