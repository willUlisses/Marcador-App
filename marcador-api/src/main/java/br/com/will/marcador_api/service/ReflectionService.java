package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.body.CreateReflectionBody;
import br.com.will.marcador_api.dtos.response.BookWithReflectionsResponse;
import br.com.will.marcador_api.entities.Book;
import br.com.will.marcador_api.entities.Reflection;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.exception.NotFoundException;
import br.com.will.marcador_api.exception.UnauthorizedException;
import br.com.will.marcador_api.repository.BookRepository;
import br.com.will.marcador_api.repository.ReflectionsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReflectionService {

    private final ReflectionsRepository reflectionsRepository;
    private final BookRepository bookRepository;

    public BookWithReflectionsResponse createReflection(User user, Long bookId, CreateReflectionBody body) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Book not found"));

        if (!book.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("This book does not belong to this user");
        }

        Reflection reflection = new Reflection();
        reflection.setDescription(body.description());
        reflection.setTitle(body.title());
        book.addReflection(reflection);

        return BookWithReflectionsResponse.from(bookRepository.save(book));
    }

}
