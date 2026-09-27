package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.response.StreakResponse;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.repository.ReadingLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StreakServiceTest {

    @Mock
    private ReadingLogRepository readingLogRepository;

    @InjectMocks
    private StreakService streakService;

    private static final ZoneId ZONE_ID = ZoneId.of("America/Sao_Paulo");

    private User user;
    private LocalDate today;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        today = LocalDate.now(ZONE_ID);
    }

    @Test
    @DisplayName("Deve retornar streak 0 quando não há nenhum registro de leitura")
    void shouldReturnZeroStreaksWhenNoLogs() {
        when(readingLogRepository.findDistinctDatesByUserOrderByDateDesc(user))
                .thenReturn(List.of());

        StreakResponse response = streakService.getStreaks(user);

        assertThat(response.currentStreak()).isZero();
        assertThat(response.highestStreak()).isZero();
    }

    @Test
    @DisplayName("Deve retornar streak atual 0 quando o último registro foi há mais de 1 dia")
    void shouldReturnZeroCurrentStreakWhenGapExists() {
        List<LocalDate> dates = List.of(today.minusDays(3), today.minusDays(4));
        when(readingLogRepository.findDistinctDatesByUserOrderByDateDesc(user))
                .thenReturn(dates);

        StreakResponse response = streakService.getStreaks(user);

        assertThat(response.currentStreak()).isZero();
        assertThat(response.highestStreak()).isEqualTo(2);
    }

    @Test
    @DisplayName("Deve manter streak atual viva quando o usuário leu ontem mas ainda não leu hoje")
    void shouldKeepStreakAliveWhenReadYesterday() {
        List<LocalDate> dates = List.of(today.minusDays(1), today.minusDays(2), today.minusDays(3));
        when(readingLogRepository.findDistinctDatesByUserOrderByDateDesc(user))
                .thenReturn(dates);

        StreakResponse response = streakService.getStreaks(user);

        assertThat(response.currentStreak()).isEqualTo(3);
        assertThat(response.highestStreak()).isEqualTo(3);
    }

    @Test
    @DisplayName("Deve calcular streak atual corretamente quando o usuário já leu hoje")
    void shouldCalculateCurrentStreakWhenReadToday() {
        List<LocalDate> dates = List.of(today, today.minusDays(1), today.minusDays(2));
        when(readingLogRepository.findDistinctDatesByUserOrderByDateDesc(user))
                .thenReturn(dates);

        StreakResponse response = streakService.getStreaks(user);

        assertThat(response.currentStreak()).isEqualTo(3);
        assertThat(response.highestStreak()).isEqualTo(3);
    }

    @Test
    @DisplayName("Deve interromper a contagem da streak atual ao encontrar uma quebra na sequência")
    void shouldStopCurrentStreakAtGap() {
        List<LocalDate> dates = List.of(
                today, today.minusDays(1),
                today.minusDays(5), today.minusDays(6)
        );
        when(readingLogRepository.findDistinctDatesByUserOrderByDateDesc(user))
                .thenReturn(dates);

        StreakResponse response = streakService.getStreaks(user);

        assertThat(response.currentStreak()).isEqualTo(2);
        assertThat(response.highestStreak()).isEqualTo(2);
    }

    @Test
    @DisplayName("Deve identificar a maior sequência histórica mesmo quando ela não é a sequência atual")
    void shouldIdentifyHighestStreakEvenWhenNotCurrent() {
        List<LocalDate> dates = List.of(
                today,
                today.minusDays(10), today.minusDays(11), today.minusDays(12), today.minusDays(13)
        );
        when(readingLogRepository.findDistinctDatesByUserOrderByDateDesc(user))
                .thenReturn(dates);

        StreakResponse response = streakService.getStreaks(user);

        assertThat(response.currentStreak()).isEqualTo(1);
        assertThat(response.highestStreak()).isEqualTo(4);
    }

    @Test
    @DisplayName("Deve retornar streak 1 para um único dia de leitura no passado distante")
    void shouldReturnOneForSingleOldDate() {
        List<LocalDate> dates = List.of(today.minusDays(20));
        when(readingLogRepository.findDistinctDatesByUserOrderByDateDesc(user))
                .thenReturn(dates);

        StreakResponse response = streakService.getStreaks(user);

        assertThat(response.currentStreak()).isZero();
        assertThat(response.highestStreak()).isEqualTo(1);
    }
}