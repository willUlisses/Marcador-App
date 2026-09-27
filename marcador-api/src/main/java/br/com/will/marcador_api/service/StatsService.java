package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.response.StatsResponse;
import br.com.will.marcador_api.entities.ReadingLog;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.repository.BookRepository;
import br.com.will.marcador_api.repository.ReadingLogRepository;
import br.com.will.marcador_api.repository.projections.GenreCountProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final ReadingLogRepository readingLogRepository;
    private final BookRepository bookRepository;

    private static final ZoneId ZONE_ID = ZoneId.of("America/Sao_Paulo");
    private static final int PACE_WINDOW_DAYS = 30;

    @Transactional(readOnly = true)
    public StatsResponse getStats(User user) {
        LocalDate today = LocalDate.now(ZONE_ID);

        int pagesThisMonth = getPagesReadThisMonth(user, today);
        String mostReadGenre = getMostReadGenre(user);
        double averagePagesPerDay = getAveragePagesPerDay(user, today);
        long totalPagesRead = readingLogRepository.sumPagesReadByUser(user);

        return new StatsResponse(pagesThisMonth, mostReadGenre, averagePagesPerDay, totalPagesRead);
    }

    private int getPagesReadThisMonth(User user, LocalDate today) {
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        LocalDate lastDayOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        List<ReadingLog> logs = readingLogRepository.findByUserAndDateBetween(user, firstDayOfMonth, lastDayOfMonth);

        return logs.stream().mapToInt(ReadingLog::getPagesRead).sum();
    }

    private String getMostReadGenre(User user) {
        List<GenreCountProjection> result = bookRepository.findMostReadGenre(user.getId());
        return result.isEmpty() ? null : result.getFirst().getGenre();
    }

    private double getAveragePagesPerDay(User user, LocalDate today) {
        LocalDate windowStart = today.minusDays(PACE_WINDOW_DAYS - 1);
        List<ReadingLog> logs = readingLogRepository.findByUserAndDateBetween(user, windowStart, today);

        if (logs.isEmpty()) return 0.0;

        int totalPages = logs.stream().mapToInt(ReadingLog::getPagesRead).sum();
        long activeDays = logs.stream().map(ReadingLog::getDate).distinct().count();

        if (activeDays == 0) return 0.0;

        double average = (double) totalPages / activeDays;
        return Math.round(average * 10) / 10.0;
    }
}