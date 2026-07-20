package br.com.will.marcador_api.dtos.body;

import jakarta.validation.constraints.NotBlank;

public record RegisterBody(
        @NotBlank(message = "You must inform your email.")
        String email,
        @NotBlank(message = "You must insert a username")
        String username,
        @NotBlank(message = "You must create a password for your account.")
        String password
) {
}
