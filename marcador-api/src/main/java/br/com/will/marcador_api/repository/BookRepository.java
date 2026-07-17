package br.com.will.marcador_api.repository;

import br.com.will.marcador_api.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}
