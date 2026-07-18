package br.com.will.marcador_api.dtos.body;

import jakarta.validation.constraints.NotBlank;

public record RegisterBody(
        @NotBlank(message = "Você deve informar seu email.")
        String email,
        @NotBlank(message = "Você deve informar um nome de usuário.")
        String username,
        @NotBlank(message = "Você deve informar a senha para se registrar.")
        String password
) {
}
