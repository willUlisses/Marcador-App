package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.body.CreateReflectionBody;
import br.com.will.marcador_api.dtos.body.PatchReflectionBody;
import br.com.will.marcador_api.dtos.response.BookWithReflectionsResponse;
import br.com.will.marcador_api.dtos.response.ReflectionResponse;
import br.com.will.marcador_api.entities.Book;
import br.com.will.marcador_api.entities.Reflection;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.exception.BadRequestException;
import br.com.will.marcador_api.exception.NotFoundException;
import br.com.will.marcador_api.exception.UnauthorizedException;
import br.com.will.marcador_api.repository.BookRepository;
import br.com.will.marcador_api.repository.ReflectionsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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

    @Transactional
    public BookWithReflectionsResponse patchReflection(User user, Long bookId, Long reflectionId, PatchReflectionBody body) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Book not found"));

        if (!user.getId().equals(book.getUser().getId())) throw new UnauthorizedException("This book does not belong to this user");

        Reflection reflection = reflectionsRepository.findById(reflectionId)
                        .orElseThrow(() -> new NotFoundException("Reflection not found"));

        if (!reflection.getBook().getId().equals(book.getId())) throw new BadRequestException("This book does not belong to this user");

        Optional.ofNullable(body.title()).ifPresent(reflection::setTitle);
        Optional.ofNullable(body.description()).ifPresent(reflection::setDescription);

        return BookWithReflectionsResponse.from(bookRepository.save(book));
    }

    public List<ReflectionResponse> getBookReflections(User user, Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Book not found"));

        if (!user.getId().equals(book.getUser().getId())) throw new UnauthorizedException("This book does not belong to this user");

        List<Reflection> reflections = reflectionsRepository.findAllByBookId(bookId);

        return reflections.stream()
                .map(ReflectionResponse::from)
                .toList();
    }

    @Transactional
    public void deleteReflection(User user, Long bookId, Long reflectionId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Book not found"));

        if (!user.getId().equals(book.getUser().getId())) throw new UnauthorizedException("This book does not belong to this user");

        Reflection reflection = reflectionsRepository.findById(reflectionId)
                    .orElseThrow(() -> new NotFoundException("Reflection not found"));

        if (!reflection.getBook().getId().equals(book.getId())) throw new IllegalArgumentException("This reflection does not belong to the specified book.");

        book.removeReflection(reflection);
        bookRepository.save(book);
    }

}
