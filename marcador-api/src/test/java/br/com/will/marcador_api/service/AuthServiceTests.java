package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.body.ForgotPasswordBody;
import br.com.will.marcador_api.dtos.body.LoginBody;
import br.com.will.marcador_api.dtos.body.RegisterBody;
import br.com.will.marcador_api.dtos.body.ResetPasswordBody;
import br.com.will.marcador_api.dtos.response.AuthResponse;
import br.com.will.marcador_api.entities.PasswordResetToken;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.entities.enums.Roles;
import br.com.will.marcador_api.exception.BadRequestException;
import br.com.will.marcador_api.exception.NotFoundException;
import br.com.will.marcador_api.repository.PasswordResetTokenRepository;
import br.com.will.marcador_api.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTests {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TokenService tokenService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthService authService;


    @Nested
    @DisplayName("Register method tests")
    class RegisterTests {

        @Test
        @DisplayName("Should register a user successfully")
        void register_success() {
            RegisterBody body = new RegisterBody("body@email.com", "bodyUsername", "bodyPassword");

            Mockito.when(userRepository.existsByUsername("bodyUsername")).thenReturn(false);
            Mockito.when(userRepository.existsByEmail("body@email.com")).thenReturn(false);
            Mockito.when(userRepository.save(Mockito.any(User.class))).thenAnswer(i -> i.getArguments()[0]);

            User mockUser = authService.register(body);

            Assertions.assertNotNull(mockUser);
            Assertions.assertEquals("bodyUsername", mockUser.getUsername());
            Assertions.assertEquals("body@email.com", mockUser.getEmail());
            Assertions.assertEquals(Roles.ROLE_USER, mockUser.getRole());
            Mockito.verify(userRepository, Mockito.times(1)).save(Mockito.any(User.class));
        }

        @Test
        @DisplayName("Should throw BadRequestException if the username is already used")
        void register_UsernameAlreadyUsed() {
            RegisterBody body = new RegisterBody("body@email.com", "bodyUsername", "bodyPassword");

            Mockito.when(userRepository.existsByUsername("bodyUsername")).thenReturn(true);

            BadRequestException exception = Assertions.assertThrows
                    (BadRequestException.class,
                    () -> authService.register(body));

            Assertions.assertEquals("This user already exists.",  exception.getMessage());
            Mockito.verify(userRepository, Mockito.never()).save(Mockito.any(User.class));
        }

        @Test
        @DisplayName("Should throw BadRequestException if the email is already used")
        void register_EmailAlreadyUsed() {
            RegisterBody body = new RegisterBody("body@email.com", "bodyUsername", "bodyPassword");

            Mockito.when(userRepository.existsByUsername("bodyUsername")).thenReturn(false);
            Mockito.when(userRepository.existsByEmail("body@email.com")).thenReturn(true);

            BadRequestException exception = Assertions.assertThrows(
                    BadRequestException.class,
                    () -> authService.register(body)
            );

            Assertions.assertEquals("This email is already used.",   exception.getMessage());
            Mockito.verify(userRepository, Mockito.never()).save(Mockito.any(User.class));
        }
    }

    @Nested
    @DisplayName("Login method tests")
    class LoginTests {

        @Test
        @DisplayName("Should login successfully")
        void login_success() {
            LoginBody body = new LoginBody("bodyUsername",  "bodyPassword");

            User mockUser = User.builder()
                    .id(1L)
                    .username("bodyUsername")
                    .email("body@email.com")
                    .role(Roles.ROLE_USER)
                    .build();

            Authentication mockAuthentication = Mockito.mock(Authentication.class);

            Mockito.when(userRepository.findByUsername("bodyUsername")).thenReturn(Optional.of(mockUser));
            Mockito.when(authenticationManager.authenticate(Mockito.any(UsernamePasswordAuthenticationToken.class))).thenReturn(mockAuthentication);
            Mockito.when(tokenService.generateToken(mockUser)).thenReturn("jwt-token-123");

            AuthResponse response = authService.login(body);

            Assertions.assertNotNull(response);
            Assertions.assertEquals("jwt-token-123", response.token());

            Mockito.verify(authenticationManager, Mockito.times(1))
                    .authenticate(Mockito.any(UsernamePasswordAuthenticationToken.class));

            Mockito.verify(tokenService, Mockito.times(1)).generateToken(mockUser);
        }

        @Test
        @DisplayName("Should throw NotFoundException if the informed username doesn't exist")
        void login_UsernameNotFound() {
            LoginBody body = new LoginBody("bodyUsername", "bodyPassword");

            Mockito.when(userRepository.findByUsername("bodyUsername")).thenReturn(Optional.empty());

            Assertions.assertThrows(NotFoundException.class, () -> authService.login(body));
            Mockito.verify(tokenService, Mockito.never()).generateToken(Mockito.any(User.class));
            Mockito.verify(authenticationManager, Mockito.never()).authenticate(Mockito.any(UsernamePasswordAuthenticationToken.class));
        }
    }

    @Nested
    @DisplayName("Forgot Password method tests")
    class ForgotPasswordTests {

        @Test
        @DisplayName("Must delete old tokens, create new reset token and send the reset email successfully")
        void forgotPassword_Success() {
            ForgotPasswordBody body = new ForgotPasswordBody("body@email.com");
            User mockUser = User.builder()
                    .id(1L)
                    .username("bodyUsername")
                    .email("body@email.com")
                    .role(Roles.ROLE_USER)
                    .build();

            Mockito.when(userRepository.findByEmail("body@email.com")).thenReturn(Optional.of(mockUser));

            authService.forgotPassword(body);

            Mockito.verify(tokenRepository, Mockito.times(1)).deleteByUser(mockUser);
            Mockito.verify(tokenRepository, Mockito.times(1)).save(Mockito.any(PasswordResetToken.class));
            Mockito.verify(emailService, Mockito.times(1))
                    .sendPasswordResetEmail(
                            Mockito.eq("body@email.com"),
                            Mockito.contains("http://localhost:5173/reset-password?token=")
                    );
        }

        @Test
        @DisplayName("Should return silently without sending email when the email is not found")
        void forgotPassword_EmailNotFound() {
            ForgotPasswordBody body = new ForgotPasswordBody("body@email.com");

            Mockito.when(userRepository.findByEmail("body@email.com")).thenReturn(Optional.empty());

            authService.forgotPassword(body);

            Mockito.verify(tokenRepository, Mockito.never()).deleteByUser(Mockito.any(User.class));
            Mockito.verify(tokenRepository, Mockito.never()).save(Mockito.any(PasswordResetToken.class));
            Mockito.verify(emailService, Mockito.never())
                    .sendPasswordResetEmail(
                            Mockito.anyString(),
                            Mockito.anyString()
                    );
        }
    }

    @Nested
    @DisplayName("Reset Password Tests")
    class ResetPasswordTests {

        @Test
        @DisplayName("Must reset the account password successfully")
        void resetPassword_Success() {
            ResetPasswordBody body = new ResetPasswordBody("reset-token-test-123", "newPasswordTest");
            User mockUser = User.builder()
                    .id(1L)
                    .email("test@email.com")
                    .username("testUser")
                    .role(Roles.ROLE_USER)
                    .build();

            PasswordResetToken mockToken = Mockito.mock(PasswordResetToken.class);
            Mockito.when(mockToken.isExpired()).thenReturn(false);
            Mockito.when(mockToken.getUser()).thenReturn(mockUser);

            Mockito.when(tokenRepository.findByToken("reset-token-test-123")).thenReturn(Optional.of(mockToken));

            authService.resetPassword(body);

            Mockito.verify(userRepository, Mockito.times(1)).save(mockUser);
            Mockito.verify(tokenRepository, Mockito.times(1)).delete(mockToken);
        }

        @Test
        @DisplayName("Should throw NotFoundException if the reset token doesn't exists")
        void resetPassword_TokenNotFound() {
            ResetPasswordBody body = new ResetPasswordBody("reset-token-test-123", "newPassword");

            Mockito.when(tokenRepository.findByToken("reset-token-test-123")).thenReturn(Optional.empty());

            Assertions.assertThrows(NotFoundException.class, () -> authService.resetPassword(body));
            Mockito.verify(userRepository, Mockito.never()).save(Mockito.any());
        }

        @Test
        @DisplayName("Should Throw BadRequestException and delete token when token is expired")
        void resetPassword_ExpiredToken() {
            ResetPasswordBody body = new ResetPasswordBody("reset-token-test-123", "newPassword");
            PasswordResetToken mockToken = Mockito.mock(PasswordResetToken.class);

            Mockito.when(mockToken.isExpired()).thenReturn(true);

            Mockito.when(tokenRepository.findByToken("reset-token-test-123")).thenReturn(Optional.of(mockToken));

            BadRequestException exception = Assertions.assertThrows(BadRequestException.class, () -> authService.resetPassword(body));

            Assertions.assertEquals("Token has expired.", exception.getMessage());
            Mockito.verify(tokenRepository, Mockito.times(1)).delete(mockToken);
            Mockito.verify(userRepository, Mockito.never()).save(Mockito.any());
        }
    }

}
