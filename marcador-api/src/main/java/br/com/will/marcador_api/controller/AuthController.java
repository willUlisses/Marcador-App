package br.com.will.marcador_api.controller;

import br.com.will.marcador_api.dtos.body.ForgotPasswordBody;
import br.com.will.marcador_api.dtos.body.LoginBody;
import br.com.will.marcador_api.dtos.body.RegisterBody;
import br.com.will.marcador_api.dtos.body.ResetPasswordBody;
import br.com.will.marcador_api.dtos.response.AuthResponse;
import br.com.will.marcador_api.dtos.response.UserResponse;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.service.AuthService;
import br.com.will.marcador_api.service.TokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterBody body) {
        User user = authService.register(body);

        String token = tokenService.gerarToken(user);

        return new ResponseEntity<>(AuthResponse.from(user, token), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginBody body) {
        return new ResponseEntity<>(authService.login(body), HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        return new ResponseEntity<>(authService.getUserLoggedData(user), HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody @Valid ForgotPasswordBody body) {
        authService.forgotPassword(body);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody @Valid ResetPasswordBody body) {
        authService.resetPassword(body);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
