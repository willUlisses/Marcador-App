package br.com.will.marcador_api.dtos.response;

import br.com.will.marcador_api.entities.Book;
import br.com.will.marcador_api.entities.enums.Genre;
import br.com.will.marcador_api.entities.enums.ReadingStatus;

import java.util.Set;

public record BookResponse(
        Long id,
        String title,
        Set<Genre> genres,
        ReadingStatus status,
        Integer currentPage,
        Integer totalPages,
        Integer rating,
        String opinion
) {
    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getGenres(),
                book.getStatus(),
                book.getCurrentPage(),
                book.getTotalPages(),
                book.getRating(),
                book.getOpinion()
        );
    }

}
