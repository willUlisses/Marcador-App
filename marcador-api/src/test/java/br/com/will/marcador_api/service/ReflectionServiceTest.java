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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ReflectionServiceTest {

    @Mock
    private ReflectionsRepository reflectionsRepository;

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private ReflectionService reflectionService;

    private User user;
    private User otherUser;
    private Book book;
    private Reflection reflection;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        otherUser = new User();
        otherUser.setId(2L);

        book = new Book();
        book.setId(10L);
        book.setUser(user);
        book.setReflections(new ArrayList<>());

        reflection = new Reflection();
        reflection.setId(100L);
        reflection.setTitle("Reflexão Inicial");
        reflection.setDescription("Descrição da reflexão");
        reflection.setBook(book);
    }

    @Nested
    @DisplayName("Create Reflection Tests")
    class CreateReflectionTests {

        @Test
        @DisplayName("Must create reflection successfully when book belongs to user")
        void createReflection_Success() {
            CreateReflectionBody body = new CreateReflectionBody("Novo Título", "Nova Descrição");
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));
            when(bookRepository.save(any(Book.class))).thenReturn(book);

            BookWithReflectionsResponse response = reflectionService.createReflection(user, 10L, body);

            assertNotNull(response);
            verify(bookRepository, times(1)).save(book);
            assertEquals(1, book.getReflections().size());
            assertEquals("Novo Título", book.getReflections().getFirst().getTitle());
        }

        @Test
        @DisplayName("Should throw NotFoundException when book is not found")
        void createReflection_BookNotFound() {
            CreateReflectionBody body = new CreateReflectionBody("Título", "Descrição");
            when(bookRepository.findById(99L)).thenReturn(Optional.empty());

            assertThrows(NotFoundException.class, () -> reflectionService.createReflection(user, 99L, body));
            verify(bookRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw UnauthorizedException when book does not belong to user")
        void createReflection_UserNotOwner() {
            CreateReflectionBody body = new CreateReflectionBody("Título", "Descrição");
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));

            assertThrows(UnauthorizedException.class, () -> reflectionService.createReflection(otherUser, 10L, body));
            verify(bookRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Patch Reflection Tests")
    class PatchReflectionTests {

        @Test
        @DisplayName("Must update reflection fields partially when valid")
        void patchReflection_Success() {
            PatchReflectionBody body = new PatchReflectionBody("Título Atualizado", null);
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));
            when(reflectionsRepository.findById(100L)).thenReturn(Optional.of(reflection));
            when(bookRepository.save(any(Book.class))).thenReturn(book);

            BookWithReflectionsResponse response = reflectionService.patchReflection(user, 10L, 100L, body);

            assertNotNull(response);
            assertEquals("Título Atualizado", reflection.getTitle());
            assertEquals("Descrição da reflexão", reflection.getDescription());
            verify(bookRepository, times(1)).save(book);
        }

        @Test
        @DisplayName("Should throw UnauthorizedException when user does not own the book")
        void patchReflection_UserNotOwner() {
            PatchReflectionBody body = new PatchReflectionBody("Novo", "Novo");
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));

            assertThrows(UnauthorizedException.class, () -> reflectionService.patchReflection(otherUser, 10L, 100L, body));
        }

        @Test
        @DisplayName("Should throw NotFoundException when reflection does not exist")
        void patchReflection_ReflectionNotFound() {
            PatchReflectionBody body = new PatchReflectionBody("Novo", "Novo");
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));
            when(reflectionsRepository.findById(999L)).thenReturn(Optional.empty());

            assertThrows(NotFoundException.class, () -> reflectionService.patchReflection(user, 10L, 999L, body));
        }

        @Test
        @DisplayName("Should throw BadRequestException when reflection belongs to another book")
        void patchReflection_ReflectionBelongsToAnotherBook() {
            Book anotherBook = new Book();
            anotherBook.setId(20L);
            reflection.setBook(anotherBook);

            PatchReflectionBody body = new PatchReflectionBody("Novo", "Novo");
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));
            when(reflectionsRepository.findById(100L)).thenReturn(Optional.of(reflection));

            assertThrows(BadRequestException.class, () -> reflectionService.patchReflection(user, 10L, 100L, body));
        }
    }

    @Nested
    @DisplayName("getBookReflections Tests")
    class GetBookReflectionsTests {

        @Test
        @DisplayName("Must return list of reflections for a valid book and owner")
        void getBookReflections_Success() {
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));
            when(reflectionsRepository.findAllByBookId(10L)).thenReturn(List.of(reflection));

            List<ReflectionResponse> responses = reflectionService.getBookReflections(user, 10L);

            assertNotNull(responses);
            assertEquals(1, responses.size());
            verify(reflectionsRepository, times(1)).findAllByBookId(10L);
        }

        @Test
        @DisplayName("Should throw UnauthorizedException when fetching reflections of another user's book")
        void getBookReflections_UserNotOwner() {
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));

            assertThrows(UnauthorizedException.class, () -> reflectionService.getBookReflections(otherUser, 10L));
            verify(reflectionsRepository, never()).findAllByBookId(any());
        }
    }

    @Nested
    @DisplayName("deleteReflection Tests")
    class DeleteReflectionTests {

        @Test
        @DisplayName("Must successfully remove reflection from book and save")
        void deleteReflection_Success() {
            book.getReflections().add(reflection);
            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));
            when(reflectionsRepository.findById(100L)).thenReturn(Optional.of(reflection));

            reflectionService.deleteReflection(user, 10L, 100L);

            assertFalse(book.getReflections().contains(reflection));
            verify(bookRepository, times(1)).save(book);
        }

        @Test
        @DisplayName("Should throw IllegalArgumentException when reflection does not belong to the book being deleted from")
        void deleteReflection_ReflectionNotBelongToBook() {
            Book otherBook = new Book();
            otherBook.setId(50L);
            reflection.setBook(otherBook);

            when(bookRepository.findById(10L)).thenReturn(Optional.of(book));
            when(reflectionsRepository.findById(100L)).thenReturn(Optional.of(reflection));

            assertThrows(IllegalArgumentException.class, () -> reflectionService.deleteReflection(user, 10L, 100L));
            verify(bookRepository, never()).save(any());
        }
    }

}
