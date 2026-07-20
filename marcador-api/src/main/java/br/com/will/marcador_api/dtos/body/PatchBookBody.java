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

        @Min(value = 1, message = "The rating must be greater than or equal 1.")
        @Max(value = 5, message = "The rating must be less than or equal 5.")
        Integer rating,

        Set<Genre> genres,

        @Positive(message = "The total of pages must be more than 0")
        Integer totalPages,

        @Min(value = 0, message = "The current page must be positive.")
        Integer currentPage,

        ReadingStatus status,

        String opinion
) {
}
