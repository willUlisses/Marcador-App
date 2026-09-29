package br.com.will.marcador_api.dtos.response;

import br.com.will.marcador_api.entities.Reflection;

public record UserReflectionResponse(
        Long id,
        String title,
        String description,
        Long bookId,
        String bookTitle,
        Integer bookRating
) {
    public static UserReflectionResponse from(Reflection reflection) {
        return new UserReflectionResponse(
                reflection.getId(),
                reflection.getTitle(),
                reflection.getDescription(),
                reflection.getBook().getId(),
                reflection.getBook().getTitle(),
                reflection.getBook().getRating()
        );
    }
}