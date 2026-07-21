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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @PostMapping()
    public ResponseEntity<BookResponse> createBook(@RequestBody @Valid CreateBookBody body, @AuthenticationPrincipal User user) {
        return new ResponseEntity<>(bookService.createBook(body, user), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BookResponse>> getAllUserBooks(@AuthenticationPrincipal User user) {
        return new ResponseEntity<>(bookService.findAllBooks(user), HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BookResponse> patchBook(
            @RequestBody @Valid PatchBookBody body,
            @PathVariable("id") Long id,
            @AuthenticationPrincipal User user) {
        return new ResponseEntity<>(bookService.patchBook(body, id, user), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") Long id, @AuthenticationPrincipal User user) {
        bookService.deleteBook(id, user);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
