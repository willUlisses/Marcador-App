package br.com.will.marcador_api.dtos.body;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordBody(
        @NotBlank(message = "The token is required.")
        String token,

        @NotBlank(message = "You must inform a new password.")
        @Size(min = 6, message = "The password must be at least 6 characters long.")
        String newPassword
) {
}
