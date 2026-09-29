package br.com.will.marcador_api.repository;

import br.com.will.marcador_api.entities.Reflection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReflectionsRepository extends JpaRepository<Reflection, Long> {

    List<Reflection> findAllByBookId(Long bookId);

    @Query("""
        SELECT r FROM Reflection r 
        JOIN r.book b 
        WHERE b.user.id = :userId
    """)
    List<Reflection> findAllByUserId(@Param("userId") Long userId);

}
