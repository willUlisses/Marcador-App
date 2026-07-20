package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.body.LoginBody;
import br.com.will.marcador_api.dtos.body.RegisterBody;
import br.com.will.marcador_api.dtos.response.AuthResponse;
import br.com.will.marcador_api.dtos.response.UserLoggedResponse;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.entities.enums.Roles;
import br.com.will.marcador_api.exception.BadRequestException;
import br.com.will.marcador_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserRepository userRepository;

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

    public UserLoggedResponse getUserLoggedData(User user) {
        return UserLoggedResponse.from(user);
    }

}
