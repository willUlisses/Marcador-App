package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.body.CreateBookBody;
import br.com.will.marcador_api.dtos.response.BookResponse;
import br.com.will.marcador_api.entities.Book;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.entities.enums.Genre;
import br.com.will.marcador_api.repository.BookRepository;
import br.com.will.marcador_api.repository.UserRepository;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@ExtendWith(MockitoExtension.class)
public class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BookService bookService;


    @Nested
    @DisplayName("Create book method tests")
    class CreateBookTests {

        @Test
        @DisplayName("Must successfully create a book")
        void createBook_Success() {
            User mockUser = new User();
            mockUser.setId(1L);

            CreateBookBody body = new CreateBookBody(
                   "testTitle",
                   Set.of(Genre.TECHNOLOGY, Genre.BUSINESS),
                   280
            );

            Book mockBook = new Book();
            mockBook.setId(1L);
            mockBook.setTitle(body.title());
            mockBook.setTotalPages(body.totalPages());
            mockBook.setGenres(Set.of(Genre.TECHNOLOGY, Genre.BUSINESS));
            mockBook.setUser(mockUser);

            Mockito.when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
            Mockito.when(bookRepository.save(Mockito.any(Book.class))).thenReturn(mockBook);

            BookResponse response = bookService.createBook(body, mockUser);

            assertEquals("testTitle", response.title());
            assertEquals(280, response.totalPages());
            assertEquals(Set.of(Genre.TECHNOLOGY, Genre.BUSINESS), response.genres());

            Mockito.verify(userRepository, Mockito.times(1)).findById(1L);
            Mockito.verify(bookRepository, Mockito.times(1)).save(Mockito.any(Book.class));
        }


    }

}
