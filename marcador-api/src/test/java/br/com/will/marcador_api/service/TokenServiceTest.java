package br.com.will.marcador_api.service;

import br.com.will.marcador_api.entities.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class TokenServiceTest {

    private final String SECRET_KEY = "test-secret-key";
    private TokenService tokenService;

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();
        String SECRET_KEY = "test-secret-key";
        org.springframework.test.util.ReflectionTestUtils.setField(tokenService, "secretKey", SECRET_KEY);
    }

    @Nested
    @DisplayName("Token Generation Tests")
    class GenerateTokenTests {

        @Test
        @DisplayName("Must generate the token successfully")
        void generateToken_Success() {
            User mockUser = new User();
            mockUser.setId(1L);

            String token = tokenService.generateToken(mockUser);

            assertNotNull(token);
            assertFalse(token.isBlank());

            String subject = JWT.require(Algorithm.HMAC256(SECRET_KEY))
                    .withIssuer("marcador-api")
                    .build()
                    .verify(token)
                    .getSubject();

            assertEquals("1", subject);
        }

        @Test
        @DisplayName("Should throw JWTCreationException when the secret key is invalid")
        void generateToken_InvalidSecretKey() {
            org.springframework.test.util.ReflectionTestUtils.setField(tokenService, "secretKey", null);
            User mockUser = new User();
            mockUser.setId(1L);

            assertThrows(IllegalArgumentException.class, () -> tokenService.generateToken(mockUser));
        }
    }

    @Nested
    @DisplayName("Extract Subject Tests")
    class ExtractSubjectTests {
        @Test
        @DisplayName("Must successfully extract subject from a valid token")
        void extractSubject_Success() {
            User mockUser = new User();
            mockUser.setId(1L);
            String token = tokenService.generateToken(mockUser);

            String subject = tokenService.extractSubject(token);

            assertEquals("1", subject);
        }

        @Test
        @DisplayName("Should throw JWTVerificationException when token is tampered/invalid")
        void extractSubject_InvalidToken() {
            String invalidToken = "invalid.jwt.token";

            assertThrows(JWTVerificationException.class, () -> tokenService.extractSubject(invalidToken));
        }

        @Test
        @DisplayName("Should throw JWTVerificationException when token is signed with a different secret")
        void extractSubject_DifferentSecret() {
            String tokenFromAnotherApp = JWT.create()
                    .withSubject("1")
                    .withIssuer("marcador-api")
                    .sign(Algorithm.HMAC256("different-secret"));

            assertThrows(JWTVerificationException.class, () -> tokenService.extractSubject(tokenFromAnotherApp));
        }

        @Test
        @DisplayName("Should throw JWTVerificationException when token has an invalid issuer")
        void extractSubject_InvalidIssuer() {
            String tokenWithWrongIssuer = JWT.create()
                    .withSubject("1")
                    .withIssuer("wrong-issuer")
                    .sign(Algorithm.HMAC256(SECRET_KEY));

            assertThrows(JWTVerificationException.class, () -> tokenService.extractSubject(tokenWithWrongIssuer));
        }

        @Test
        @DisplayName("Should throw JWTVerificationException when token is expired")
        void extractSubject_ExpiredToken() {
            Instant pastInstant = LocalDateTime.now().minusDays(1).toInstant(ZoneOffset.of("-03:00"));

            String expiredToken = JWT.create()
                    .withSubject("1")
                    .withIssuer("marcador-api")
                    .withExpiresAt(Date.from(pastInstant))
                    .sign(Algorithm.HMAC256(SECRET_KEY));

            assertThrows(JWTVerificationException.class, () -> tokenService.extractSubject(expiredToken));
        }
    }

}
