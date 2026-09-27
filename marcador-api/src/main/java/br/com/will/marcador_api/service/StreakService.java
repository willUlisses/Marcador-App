package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.response.StreakResponse;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.repository.ReadingLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final ReadingLogRepository readingLogRepository;

    private static final ZoneId ZONE_ID = ZoneId.of("America/Sao_Paulo");

    @Transactional(readOnly = true)
    public StreakResponse getStreaks(User user) {
        LocalDate today = LocalDate.now(ZONE_ID);

        List<LocalDate> distinctDatesDesc = readingLogRepository.findDistinctDatesByUserOrderByDateDesc(user);

        int currentStreak = calculateCurrentStreak(distinctDatesDesc, today);
        int highestStreak = calculateHighestStreak(distinctDatesDesc);

        return new StreakResponse(currentStreak, highestStreak);
    }

    private int calculateCurrentStreak(List<LocalDate> distinctDatesDesc, LocalDate today) {
        if (distinctDatesDesc.isEmpty()) return 0;

        LocalDate expectedDate = today;

        if (!distinctDatesDesc.getFirst().isEqual(today)) {
            expectedDate = today.minusDays(1);
            if (!distinctDatesDesc.getFirst().isEqual(expectedDate)) {
                return 0;
            }
        }

        int streak = 0;
        for (LocalDate date : distinctDatesDesc) {
            if (date.isEqual(expectedDate)) {
                streak++;
                expectedDate = expectedDate.minusDays(1);
            } else if (date.isBefore(expectedDate)) {
                break;
            }
        }

        return streak;
    }

    private int calculateHighestStreak(List<LocalDate> distinctDatesDesc) {
        if (distinctDatesDesc.isEmpty()) return 0;

        List<LocalDate> datesAsc = new ArrayList<>(distinctDatesDesc);
        Collections.reverse(datesAsc);

        int longestStreak = 1;
        int currentRun = 1;

        for (int i = 1; i < datesAsc.size(); i++) {
            LocalDate previousDate = datesAsc.get(i - 1);
            LocalDate actualDate = datesAsc.get(i);

            if (actualDate.equals(previousDate.plusDays(1))) {
                currentRun++;
                longestStreak = Math.max(longestStreak, currentRun);
            } else {
                currentRun = 1;
            }
        }

        return longestStreak;
    }
}