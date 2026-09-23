package br.com.will.marcador_api.repository;

import br.com.will.marcador_api.entities.ReadingLog;
import br.com.will.marcador_api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReadingLogRepository extends JpaRepository<ReadingLog, Long> {

    List<ReadingLog> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);

    @Query("SELECT DISTINCT r.date FROM ReadingLog r WHERE r.user = :user ORDER BY r.date DESC")
    List<LocalDate> findDistinctDatesByUserOrderByDateDesc(@Param("user") User user);

}
