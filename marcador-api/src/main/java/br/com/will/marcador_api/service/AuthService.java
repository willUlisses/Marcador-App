package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.body.ForgotPasswordBody;
import br.com.will.marcador_api.dtos.body.LoginBody;
import br.com.will.marcador_api.dtos.body.RegisterBody;
import br.com.will.marcador_api.dtos.body.ResetPasswordBody;
import br.com.will.marcador_api.dtos.response.AuthResponse;
import br.com.will.marcador_api.dtos.response.UserResponse;
import br.com.will.marcador_api.entities.PasswordResetToken;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.entities.enums.Roles;
import br.com.will.marcador_api.exception.BadRequestException;
import br.com.will.marcador_api.repository.PasswordResetTokenRepository;
import br.com.will.marcador_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    @Transactional
    public User register(RegisterBody body) {
        if (userRepository.existsByUsername(body.username())) throw new BadRequestException("This user already exists.");

        String senhaHash = new BCryptPasswordEncoder().encode(body.password());

        User user = User.builder()
                .email(body.email())
                .username(body.username())
                .password(senhaHash)
                .role(Roles.ROLE_USER)
                .build();


        return userRepository.save(user);
    }

    public AuthResponse login(LoginBody body) {
        User userLogging = userRepository.findByUsername(body.username())
                .orElseThrow(() -> new BadRequestException("Invalid username or password."));

        var usernamePasswordToken = new UsernamePasswordAuthenticationToken(
                body.username(),
                body.password()
        );
        Authentication auth = this.authenticationManager.authenticate(usernamePasswordToken);
        String token = tokenService.gerarToken(userLogging);

        return AuthResponse.from(userLogging, token);
    }

    public UserResponse getUserLoggedData(User user) {
        return UserResponse.from(user);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordBody body) {
        Optional<User> userOptional = userRepository.findByEmail(body.email());

        if (userOptional.isEmpty()) {
            return;
        }

        User user = userOptional.get();

        tokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(token, user, 10);
        tokenRepository.save(passwordResetToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
    }

    @Transactional
    public void resetPassword(ResetPasswordBody body) {
        PasswordResetToken resetToken = tokenRepository.findByToken(body.token())
                .orElseThrow(() -> new BadRequestException("Invalid or expired token."));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new BadRequestException("Token has expired.");
        }

        User user = resetToken.getUser();
        user.setPassword(new BCryptPasswordEncoder().encode(body.newPassword()));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }

}
