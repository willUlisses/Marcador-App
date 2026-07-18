package br.com.will.marcador_api.dtos.body;

import br.com.will.marcador_api.entities.enums.Genre;
import br.com.will.marcador_api.entities.enums.ReadingStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.Set;

public record PatchBookBody(
        String title,

        @Min(value = 1, message = "A nota deve ser maior ou igual a 1.")
        @Max(value = 5, message = "A nota deve ser menor ou igual a 5.")
        Integer rating,

        Set<Genre> genres,

        @Positive(message = "O total de páginas deve ser maior que 0")
        Integer totalPages,

        @Min(value = 0, message = "A página atual deve ser positiva.")
        Integer currentPage,

        ReadingStatus status,

        String opinion
) {
}
