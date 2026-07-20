package br.com.will.marcador_api.dtos.body;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordBody(
        @NotBlank
        String currentPassword,

        @NotBlank
        @Size(min = 6, message = "The new password must be at least 6 characters long")
        String newPassword
) {
}
