package br.com.will.marcador_api.repository;

import br.com.will.marcador_api.entities.ReadingGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReadingGoalRepository extends JpaRepository<ReadingGoal, Long> {

    Optional<ReadingGoal> findByUserIdAndYear(Long userId, Integer year);

    @Query("""
        SELECT COUNT(b)
            FROM Book b
            WHERE b.user.id = :userId
              AND b.status = 'COMPLETED'
              AND YEAR(b.completedAt) = :year
        """)
    Long countCompletedBooksByUserIdAndYear(@Param("userId") Long userId, @Param("year") Integer year);

}
