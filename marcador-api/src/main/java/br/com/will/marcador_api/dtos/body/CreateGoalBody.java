package br.com.will.marcador_api.dtos.body;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateGoalBody(
        @NotNull(message = "Você deve definir uma quantidade de livros pra meta")
        @Min(value = 1, message = "Você deve ter no mínimo 1 livro como meta anual")
        Integer targetBooks
) {
}
