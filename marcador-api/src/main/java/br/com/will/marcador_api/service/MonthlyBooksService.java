package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.response.MonthlyBookCountDTO;
import br.com.will.marcador_api.dtos.response.MonthlyBooksResponse;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MonthlyBooksService {

    private final BookRepository bookRepository;

    private static final ZoneId ZONE_ID = ZoneId.of("America/Sao_Paulo");
    private static final int MONTHS_WINDOW = 7;

    @Transactional(readOnly = true)
    public MonthlyBooksResponse getMonthlyBooksRead(User user) {
        LocalDate today = LocalDate.now(ZONE_ID);
        YearMonth currentYearMonth = YearMonth.from(today);
        YearMonth startYearMonth = currentYearMonth.minusMonths(MONTHS_WINDOW - 1);

        LocalDateTime startDateTime = startYearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDateTime = currentYearMonth.atEndOfMonth().atTime(23, 59, 59);

        List<LocalDateTime> completions = bookRepository.findCompletedAtByUserAndDateRange(
                user.getId(), startDateTime, endDateTime
        );

        Map<YearMonth, Long> countsByMonth = completions.stream()
                .map(YearMonth::from)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        List<MonthlyBookCountDTO> months = new ArrayList<>();
        YearMonth cursor = startYearMonth;

        while (!cursor.isAfter(currentYearMonth)) {
            long count = countsByMonth.getOrDefault(cursor, 0L);
            months.add(new MonthlyBookCountDTO(
                    getMonthLabel(cursor.getMonth()),
                    cursor.getMonthValue(),
                    cursor.getYear(),
                    count
            ));
            cursor = cursor.plusMonths(1);
        }

        return new MonthlyBooksResponse(currentYearMonth.getYear(), months);
    }

    private String getMonthLabel(Month month) {
        return switch (month) {
            case JANUARY -> "Jan";
            case FEBRUARY -> "Fev";
            case MARCH -> "Mar";
            case APRIL -> "Abr";
            case MAY -> "Mai";
            case JUNE -> "Jun";
            case JULY -> "Jul";
            case AUGUST -> "Ago";
            case SEPTEMBER -> "Set";
            case OCTOBER -> "Out";
            case NOVEMBER -> "Nov";
            case DECEMBER -> "Dez";
        };
    }
}