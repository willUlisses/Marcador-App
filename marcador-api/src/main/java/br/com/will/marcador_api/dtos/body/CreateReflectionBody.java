package br.com.will.marcador_api.dtos.body;

import jakarta.validation.constraints.NotBlank;

public record CreateReflectionBody(
        @NotBlank(message = "You must insert a title.")
        String title,
        String description
) {
}
