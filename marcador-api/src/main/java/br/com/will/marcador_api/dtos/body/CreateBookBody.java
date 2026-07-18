package br.com.will.marcador_api.dtos.body;

import br.com.will.marcador_api.entities.enums.Genre;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.Set;

public record CreateBookBody(
        @NotBlank(message = "O título é obrigatório.")
        String title,

        @NotEmpty(message = "Selecione pelo menos um gênero.")
        Set<Genre> genres,

        @NotNull(message = "O total de páginas é obrigatório")
        @Positive(message = "O total de páginas deve ser maior que 0")
        Integer totalPages
) {
}
