package br.com.will.marcador_api.controller;

import br.com.will.marcador_api.dtos.body.CreateBookBody;
import br.com.will.marcador_api.dtos.body.PatchBookBody;
import br.com.will.marcador_api.dtos.response.BookResponse;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    //TODO: POST createBook(CreateBookBody body, User user)
    public ResponseEntity<BookResponse> createBook(@RequestBody @Valid CreateBookBody body, @AuthenticationPrincipal User user) {
        return new ResponseEntity<>(bookService.createBook(body, user), HttpStatus.CREATED);
    }
    //TODO: GET findAllBooks(User user)
    public ResponseEntity<List<BookResponse>> getAllUserBooks(@AuthenticationPrincipal User user) {
        return new ResponseEntity<>(bookService.findAllBooks(user), HttpStatus.OK);
    }

    //TODO: PATCH patchBook(PatchBookBody body, Long id, User user)
    public ResponseEntity<BookResponse> patchBook(
            @RequestBody @Valid PatchBookBody body,
            @PathVariable("id") Long id,
            @AuthenticationPrincipal User user) {
        return new ResponseEntity<>(bookService.patchBook(body, id, user), HttpStatus.OK);
    }

    //TODO: DELETE deleteBook(Long id, User user)
    public ResponseEntity<Void> deleteBook(@PathVariable("id") Long id, @AuthenticationPrincipal User user) {
        bookService.deleteBook(id, user);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
