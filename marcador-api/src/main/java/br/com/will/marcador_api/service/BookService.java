package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.body.CreateBookBody;
import br.com.will.marcador_api.dtos.body.PatchBookBody;
import br.com.will.marcador_api.dtos.response.BookResponse;
import br.com.will.marcador_api.entities.Book;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.entities.enums.ReadingStatus;
import br.com.will.marcador_api.exception.BookNotFoundException;
import br.com.will.marcador_api.exception.UnauthorizedException;
import br.com.will.marcador_api.exception.UserNotFoundException;
import br.com.will.marcador_api.repository.BookRepository;
import br.com.will.marcador_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookResponse createBook(CreateBookBody body, User user) {
        User userLogged = userRepository.findById(user.getId())
                .orElseThrow(() -> new UserNotFoundException("User Not Found"));

        Book book = new Book();
        book.setTitle(body.title());
        book.setStatus(ReadingStatus.WANT_TO_READ);
        book.setCurrentPage(0);
        book.setTotalPages(body.totalPages());
        book.setGenres(body.genres());
        book.setUser(userLogged);

        return BookResponse.from(bookRepository.save(book));
    }

    public List<BookResponse> findAllBooks(User user) {
        List<Book> books = bookRepository.findAllByUserIdWithGenres(user.getId());

        return books.stream().map(BookResponse::from).toList();
    }

    @Transactional
    public BookResponse patchBook(PatchBookBody body, Long bookId, User user) {
        User userLogged = userRepository.findById(user.getId())
                .orElseThrow(() -> new UserNotFoundException("User Not Found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book Not Found"));

        if (!book.getUser().getId().equals(userLogged.getId())) {
            throw new UnauthorizedException("This book does not belong to this user");
        }

        Optional.ofNullable(body.title()).ifPresent(book::setTitle);
        Optional.ofNullable(body.genres()).ifPresent(book::setGenres);
        Optional.ofNullable(body.currentPage()).ifPresent(book::setCurrentPage);
        Optional.ofNullable(body.totalPages()).ifPresent(book::setTotalPages);
        Optional.ofNullable(body.status()).ifPresent(book::setStatus);
        Optional.ofNullable(body.opinion()).ifPresent(book::setOpinion);
        Optional.ofNullable(body.rating()).ifPresent(book::setRating);

        if (book.getCurrentPage() > book.getTotalPages()) throw new IllegalArgumentException("A página atual não pode ser maior que o total de páginas.");

        return BookResponse.from(bookRepository.save(book));
    }


    @Transactional
    public void deleteBook(Long bookId, User user) {
        User userLogged = userRepository.findById(user.getId())
                .orElseThrow(() -> new UserNotFoundException("User Not Found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book Not Found"));

        if (!book.getUser().getId().equals(userLogged.getId())) {
            throw new UnauthorizedException("This book does not belong to this user");
        }

        bookRepository.delete(book);
    }



}
