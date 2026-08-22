package br.com.will.marcador_api.repository;

import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.repository.projections.UserStatsProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);


    @Query("""
        SELECT 
            (SELECT COUNT(b) FROM Book b WHERE b.user.id = :userId AND b.status = 'COMPLETED') AS booksRead,
            (SELECT COUNT(b) FROM Book b WHERE b.user.id = :userId AND b.status = 'WANT_TO_READ') AS booksinQueue,
            (SELECT COALESCE(SUM(rl.pagesRead), 0) FROM ReadingLog rl WHERE rl.user.id = :userId) AS totalPagesRead
        FROM User u WHERE u.id = :userId
    """)
    UserStatsProjection findHeaderStatsByUserId(@Param("userId") Long userId);
}
