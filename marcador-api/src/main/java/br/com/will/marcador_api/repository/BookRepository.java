package br.com.will.marcador_api.repository;

import br.com.will.marcador_api.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("SELECT b FROM Book b LEFT JOIN FETCH b.genres WHERE b.user.id = :userId")
    List<Book> findAllByUserIdWithGenres(Long userId);
}
