package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.body.DailyReadingDTO;
import br.com.will.marcador_api.dtos.response.WeeklyProgressResponse;
import br.com.will.marcador_api.entities.ReadingLog;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.repository.ReadingLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReadingLogService {

    private final ReadingLogRepository readingLogRepository;

    @Transactional(readOnly = true)
    public WeeklyProgressResponse getWeeklyProgress(User user) {
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY);
        LocalDate sunday = LocalDate.now().with(DayOfWeek.SUNDAY);

        List<ReadingLog> logs = readingLogRepository.findByUserAndDateBetween(user, monday, sunday);

        Map<LocalDate, Integer> pagesReadByDay = logs.stream()
                .collect(
                        Collectors.groupingBy(
                                ReadingLog::getDate,
                                Collectors.summingInt(ReadingLog::getPagesRead)
                        )
                );

        List<DailyReadingDTO> dailyReadings = new ArrayList<>();
        int weeklyTotalPages = 0;

        LocalDate currentDay = monday;

        while (!currentDay.isAfter(sunday)) {
            int pagesRead = pagesReadByDay.getOrDefault(currentDay, 0);
            weeklyTotalPages += pagesRead;

            String dayString = getDayStringName(currentDay.getDayOfWeek());
            dailyReadings.add(new DailyReadingDTO(dayString, pagesRead));

            currentDay = currentDay.plusDays(1);
        }

        return new WeeklyProgressResponse(weeklyTotalPages, dailyReadings);
    }

    private String getDayStringName(DayOfWeek day) {
        return switch (day) {
            case MONDAY -> "Seg";
            case TUESDAY -> "Ter";
            case WEDNESDAY -> "Qua";
            case THURSDAY -> "Qui";
            case FRIDAY -> "Sex";
            case SATURDAY -> "Sáb";
            case SUNDAY -> "Dom";
        };
    }

}
