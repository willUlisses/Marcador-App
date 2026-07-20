package br.com.will.marcador_api.repository;

import br.com.will.marcador_api.entities.Book;
import br.com.will.marcador_api.entities.Reflection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReflectionsRepository extends JpaRepository<Reflection, Long> {

    List<Reflection> findAllByBookId(Long bookId);

}
