package br.com.will.marcador_api.controller;

import br.com.will.marcador_api.dtos.body.CreateReflectionBody;
import br.com.will.marcador_api.dtos.body.PatchReflectionBody;
import br.com.will.marcador_api.dtos.response.BookWithReflectionsResponse;
import br.com.will.marcador_api.dtos.response.ReflectionResponse;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.service.ReflectionService;
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
@RequestMapping("/reflections")
@RequiredArgsConstructor
public class ReflectionController {

    private final ReflectionService reflectionService;

    //TODO: POST createReflection(User user, Long bookId, CreateReflectionBody body)
    @PostMapping("/{id}")
    public ResponseEntity<BookWithReflectionsResponse> createReflection(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Long id,
            @RequestBody @Valid CreateReflectionBody body
    ) {
        return new ResponseEntity<>(reflectionService.createReflection(user, id, body), HttpStatus.CREATED);
    }

    //TODO: PATCH patchReflection(User user, Long bookId, Long reflectionId, PatchReflectionBody body)
    @PatchMapping("/{bookId}/{reflectionId}")
    public ResponseEntity<BookWithReflectionsResponse> patchReflection(
            @AuthenticationPrincipal User user,
            @PathVariable("bookId") Long bookId,
            @PathVariable("reflectionId") Long reflectionId,
            @RequestBody @Valid PatchReflectionBody body)
    {
        return new ResponseEntity<>(reflectionService.patchReflection(
                user,
                bookId,
                reflectionId,
                body), HttpStatus.OK);
    }
    //TODO: GET getBookReflections(User user, Long bookId)
    @GetMapping("/{id}")
    public ResponseEntity<List<ReflectionResponse>> getBookReflections(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Long id)
    {
        return new ResponseEntity<>(reflectionService.getBookReflections(user, id), HttpStatus.OK);
    }

    //TODO: DELETE deleteReflection(User user, Long bookId, Long reflectionId)
    @DeleteMapping("/{bookId}/{reflectionId}")
    public ResponseEntity<Void> deleteReflection(
            @AuthenticationPrincipal User user,
            @PathVariable("bookId") Long bookId,
            @PathVariable("reflectionId") Long reflectionId)
    {
        reflectionService.deleteReflection(user, bookId, reflectionId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

