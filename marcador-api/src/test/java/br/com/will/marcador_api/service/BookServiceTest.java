package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.body.CreateBookBody;
import br.com.will.marcador_api.dtos.body.PatchBookBody;
import br.com.will.marcador_api.dtos.response.BookResponse;
import br.com.will.marcador_api.entities.Book;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.entities.enums.Genre;
import br.com.will.marcador_api.entities.enums.ReadingStatus;
import br.com.will.marcador_api.exception.NotFoundException;
import br.com.will.marcador_api.exception.UnauthorizedException;
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

        @Test
        @DisplayName("Must throw NotFoundException when searching for the user logged")
        void  createBook_NotFound() {
            User mockUser = new User();
            mockUser.setId(1L);

            CreateBookBody body = new CreateBookBody(
                    "testTitle",
                    Set.of(Genre.TECHNOLOGY, Genre.BUSINESS),
                    280
            );

            Mockito.when(userRepository.findById(1L)).thenReturn(Optional.empty());

            assertThrows(NotFoundException.class, () -> bookService.createBook(body, mockUser));

            Mockito.verify(bookRepository, Mockito.never()).save(Mockito.any());
        }
    }

    @Nested
    @DisplayName("Patch book method tests")
    class PatchBookTests {

        @Test
        @DisplayName("Must update the book successfully")
        void patchBook_Success() {
            User mockUser = new User();
            mockUser.setId(1L);

            PatchBookBody body = new PatchBookBody(
                   "newTitle",
                   3,
                   Set.of(Genre.FACTUAL),
                   299,
                   30,
                   ReadingStatus.READING,
                   "Testing Opinion"
            );

            Book mockBook = new Book();
            mockBook.setId(1L);
            mockBook.setUser(mockUser);
            mockBook.setCurrentPage(30);
            mockBook.setTotalPages(290);

            Mockito.when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
            Mockito.when(bookRepository.findById(1L)).thenReturn(Optional.of(mockBook));
            Mockito.when(bookRepository.save(Mockito.any(Book.class))).thenReturn(mockBook);

            BookResponse response = bookService.patchBook(body, 1L,  mockUser);

            assertEquals("newTitle", response.title());
            assertEquals(299, response.totalPages());
            assertEquals(Set.of(Genre.FACTUAL), response.genres());

            Mockito.verify(userRepository, Mockito.times(1)).findById(1L);
            Mockito.verify(bookRepository, Mockito.times(1)).save(Mockito.any(Book.class));
        }


        @Test
        @DisplayName("Should throw UnauthorizedException when trying to modify a book that is not from the user")
        void patchBook_Unauthorized() {
            User mockUser = new User();
            mockUser.setId(1L);

            User otherMockUser = new User();
            otherMockUser.setId(2L);

            PatchBookBody body = new PatchBookBody(
                    "newTitle",
                    3,
                    Set.of(Genre.FACTUAL),
                    299,
                    30,
                    ReadingStatus.READING,
                    "Testing Opinion"
            );

            Book mockBook = new Book();
            mockBook.setId(1L);
            mockBook.setUser(otherMockUser);

            Mockito.when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
            Mockito.when(bookRepository.findById(1L)).thenReturn(Optional.of(mockBook));

            assertThrows(UnauthorizedException.class, () -> bookService.patchBook(body, 1L,  mockUser));
            Mockito.verify(userRepository, Mockito.never()).save(Mockito.any());
        }

        @Test
        @DisplayName("Should throw IllegalArgumentException when currentPage is greater than totalPages")
        void patchBook_CurrentPageGreaterThanTotalPages_ThrowsException() {
            User mockUser = new User();
            mockUser.setId(1L);

            Book mockBook = new Book();
            mockBook.setId(1L);
            mockBook.setUser(mockUser);
            mockBook.setTotalPages(100);
            mockBook.setCurrentPage(50);

            PatchBookBody body = new PatchBookBody(null, null, null, 100, 150, null, null);

            Mockito.when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
            Mockito.when(bookRepository.findById(1L)).thenReturn(Optional.of(mockBook));

            IllegalArgumentException exception = assertThrows(
                    IllegalArgumentException.class,
                    () -> bookService.patchBook(body, 1L, mockUser)
            );

            assertEquals("A página atual não pode ser maior que o total de páginas.", exception.getMessage());
            Mockito.verify(bookRepository, Mockito.never()).save(Mockito.any());
        }

        @Test
        @DisplayName("Should throw NotFoundException when the book doesn't exists")
        void patchBook_BookNotFound() {
            User mockUser = new User();
            mockUser.setId(1L);

            PatchBookBody body = new PatchBookBody("newTitle", null, null, null, null, null, null);

            Mockito.when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
            Mockito.when(bookRepository.findById(1L)).thenReturn(Optional.empty());

            assertThrows(NotFoundException.class, () -> bookService.patchBook(body, 1L, mockUser));
            Mockito.verify(bookRepository, Mockito.never()).save(Mockito.any());
        }

        @Test
        @DisplayName("Should update only providede fields and keep original values for null fields")
        void patchBook_PartielUpdate_Success() {
            User mockUser = new User();
            mockUser.setId(1L);

            Book mockBook = new Book();
            mockBook.setId(1L);
            mockBook.setTitle("originalTitle");
            mockBook.setCurrentPage(30);
            mockBook.setTotalPages(200);
            mockBook.setUser(mockUser);

            PatchBookBody body = new PatchBookBody("newTitle", null, null, null, 50, null, null);

            Mockito.when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
            Mockito.when(bookRepository.findById(1L)).thenReturn(Optional.of(mockBook));
            Mockito.when(bookRepository.save(Mockito.any(Book.class))).thenAnswer(i -> i.getArgument(0));

            BookResponse response = bookService.patchBook(body, 1L, mockUser);

            assertEquals("newTitle", response.title());
            assertEquals(50, response.currentPage());
            assertEquals(200, response.totalPages());

            Mockito.verify(bookRepository, Mockito.times(1)).save(mockBook);
        }

    }


}
