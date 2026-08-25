package br.com.will.marcador_api.repository;

import br.com.will.marcador_api.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("SELECT b FROM Book b LEFT JOIN FETCH b.genres WHERE b.user.id = :userId")
    List<Book> findAllByUserIdWithGenres(Long userId);

    @Query(value = """
            SELECT id, user_id, title, rating, status, current_page, total_pages, opinion, completed_at 
            FROM tb_books 
            WHERE user_id = :userId 
              AND status = 'READING'
            """, nativeQuery = true)
    List<Book> findReadingBooksByUserId(@Param("userId") Long userId);

    @Query("""
           SELECT b
           FROM Book b 
           WHERE b.user.id = :userId
             AND b.status = 'COMPLETED'
             AND b.completedAt >= :sinceDate
           ORDER BY b.completedAt DESC
           """)
    List<Book> findRecentCompletedBooks(@Param("userId") Long userId, @Param("sinceDate") LocalDateTime sinceDate, Pageable pageable);
}
