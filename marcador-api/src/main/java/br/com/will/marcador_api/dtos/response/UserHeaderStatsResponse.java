package br.com.will.marcador_api.dtos.response;

import br.com.will.marcador_api.repository.projections.UserStatsProjection;
import com.fasterxml.jackson.annotation.JsonProperty;

public record UserHeaderStatsResponse(
        @JsonProperty("books_read")
        Long booksRead,
        @JsonProperty("books_in_queue")
        Long booksInQueue,
        @JsonProperty("total_pages_read")
        Long totalPagesRead
) {
    public static UserHeaderStatsResponse fromProjection(UserStatsProjection stats) {
        if (stats == null) {
            return new UserHeaderStatsResponse(0L, 0L, 0L);
        }
        return new UserHeaderStatsResponse(
                stats.getBooksRead() != null ? stats.getBooksRead() : 0L,
                stats.getBooksInQueue() != null ? stats.getBooksInQueue() : 0L,
                stats.getTotalPagesRead() != null ? stats.getTotalPagesRead() : 0L
        );
    }
}
