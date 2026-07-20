package br.com.will.marcador_api.dtos.body;

import br.com.will.marcador_api.entities.enums.Genre;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.Set;

public record CreateBookBody(
        @NotBlank(message = "The title is mandatory")
        String title,

        @NotEmpty(message = "Select at least one genre")
        Set<Genre> genres,

        @NotNull(message = "the total of pages is mandatory")
        @Positive(message = "The total of pages must be more than 0")
        Integer totalPages
) {
}
