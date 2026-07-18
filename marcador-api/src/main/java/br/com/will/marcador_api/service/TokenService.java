package br.com.will.marcador_api.service;

import br.com.will.marcador_api.entities.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class TokenService {

    @Value("${marcador.jwt.secret.key}")
    private String secretKey;

    public String gerarToken(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);

            return JWT.create()
                    .withSubject(user.getId().toString())
                    .withIssuedAt(Date.from(Instant.now()))
                    .withIssuer("marcador-api")
                    .withExpiresAt(generateExpirationDate())
                    .sign(algorithm);


        } catch (JWTCreationException exception) {
            throw new JWTCreationException("Erro ao gerar token JWT: ", exception);
        }
    }

    public String extrairSubject(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);

            return JWT.require(algorithm)
                    .withIssuer("marcador-api")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            throw new JWTVerificationException("Erro ao verificar token JWT: ", exception);
        }
    }

    private final Instant generateExpirationDate() {
        return LocalDateTime.now().plusDays(7).toInstant(ZoneOffset.of("-03:00"));
    }


}
