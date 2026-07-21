package br.com.will.marcador_api.dtos.body;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordBody(
        @NotBlank(message = "You must inform your email.")
        @Email(message = "Invalid email format.")
        String email
) {
}
