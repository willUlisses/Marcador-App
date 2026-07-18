package br.com.will.marcador_api.dtos.body;

import jakarta.validation.constraints.NotBlank;

public record CreateReflectionBody(
        @NotBlank(message = "Você deve inserir um titulo para criar a reflexão.")
        String title,
        String description
) {
}
