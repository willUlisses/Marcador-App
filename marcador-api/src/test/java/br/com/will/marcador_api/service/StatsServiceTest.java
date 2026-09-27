package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.response.StatsResponse;
import br.com.will.marcador_api.entities.ReadingLog;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.repository.BookRepository;
import br.com.will.marcador_api.repository.ReadingLogRepository;
import br.com.will.marcador_api.repository.projections.GenreCountProjection;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StatsServiceTest {

    @Mock
    private ReadingLogRepository readingLogRepository;

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private StatsService statsService;

    private static final ZoneId ZONE_ID = ZoneId.of("America/Sao_Paulo");

    private User user;
    private LocalDate today;
    private LocalDate firstDayOfMonth;
    private LocalDate lastDayOfMonth;
    private LocalDate windowStart;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        today = LocalDate.now(ZONE_ID);
        firstDayOfMonth = today.withDayOfMonth(1);
        lastDayOfMonth = today.withDayOfMonth(today.lengthOfMonth());
        windowStart = today.minusDays(29);
    }

    private ReadingLog buildLog(LocalDate date, int pagesRead) {
        ReadingLog log = new ReadingLog();
        log.setDate(date);
        log.setPagesRead(pagesRead);
        return log;
    }

    @Test
    @DisplayName("Deve somar corretamente as páginas lidas no mês atual")
    void shouldSumPagesReadThisMonth() {
        List<ReadingLog> monthLogs = List.of(
                buildLog(firstDayOfMonth, 30),
                buildLog(today, 20)
        );

        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(firstDayOfMonth), eq(lastDayOfMonth)))
                .thenReturn(monthLogs);
        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(windowStart), eq(today)))
                .thenReturn(List.of());
        when(bookRepository.findMostReadGenre(user.getId())).thenReturn(List.of());
        when(readingLogRepository.sumPagesReadByUser(user)).thenReturn(0L);

        StatsResponse response = statsService.getStats(user);

        assertThat(response.pagesReadThisMonth()).isEqualTo(50);
    }

    @Test
    @DisplayName("Deve retornar null como gênero mais lido quando o usuário não possui livros")
    void shouldReturnNullGenreWhenNoBooks() {
        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(firstDayOfMonth), eq(lastDayOfMonth)))
                .thenReturn(List.of());
        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(windowStart), eq(today)))
                .thenReturn(List.of());
        when(bookRepository.findMostReadGenre(user.getId())).thenReturn(List.of());
        when(readingLogRepository.sumPagesReadByUser(user)).thenReturn(0L);

        StatsResponse response = statsService.getStats(user);

        assertThat(response.mostReadGenre()).isNull();
    }

    @Test
    @DisplayName("Deve retornar o gênero mais lido a partir da projeção do repositório")
    void shouldReturnMostReadGenre() {
        GenreCountProjection projection = new GenreCountProjection() {
            @Override
            public String getGenre() {
                return "FANTASY";
            }

            @Override
            public Long getCnt() {
                return 5L;
            }
        };

        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(firstDayOfMonth), eq(lastDayOfMonth)))
                .thenReturn(List.of());
        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(windowStart), eq(today)))
                .thenReturn(List.of());
        when(bookRepository.findMostReadGenre(user.getId())).thenReturn(List.of(projection));
        when(readingLogRepository.sumPagesReadByUser(user)).thenReturn(0L);

        StatsResponse response = statsService.getStats(user);

        assertThat(response.mostReadGenre()).isEqualTo("FANTASY");
    }

    @Test
    @DisplayName("Deve retornar média diária 0 quando não há registros na janela de 30 dias")
    void shouldReturnZeroAverageWhenNoLogsInWindow() {
        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(firstDayOfMonth), eq(lastDayOfMonth)))
                .thenReturn(List.of());
        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(windowStart), eq(today)))
                .thenReturn(List.of());
        when(bookRepository.findMostReadGenre(user.getId())).thenReturn(List.of());
        when(readingLogRepository.sumPagesReadByUser(user)).thenReturn(0L);

        StatsResponse response = statsService.getStats(user);

        assertThat(response.averagePagesPerDay()).isZero();
    }

    @Test
    @DisplayName("Deve calcular a média diária com base apenas nos dias em que houve leitura")
    void shouldCalculateAveragePagesPerDayBasedOnActiveDays() {
        // 3 dias ativos: 10 + 20 + 30 = 60 páginas / 3 dias ativos = 20.0
        List<ReadingLog> windowLogs = List.of(
                buildLog(today, 10),
                buildLog(today.minusDays(1), 20),
                buildLog(today.minusDays(2), 30)
        );

        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(firstDayOfMonth), eq(lastDayOfMonth)))
                .thenReturn(List.of());
        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(windowStart), eq(today)))
                .thenReturn(windowLogs);
        when(bookRepository.findMostReadGenre(user.getId())).thenReturn(List.of());
        when(readingLogRepository.sumPagesReadByUser(user)).thenReturn(60L);

        StatsResponse response = statsService.getStats(user);

        assertThat(response.averagePagesPerDay()).isEqualTo(20.0);
    }

    @Test
    @DisplayName("Deve arredondar a média diária para uma casa decimal")
    void shouldRoundAveragePagesPerDayToOneDecimal() {
        // 2 dias ativos, total 25 páginas -> média 12.5
        List<ReadingLog> windowLogs = List.of(
                buildLog(today, 15),
                buildLog(today.minusDays(1), 10)
        );

        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(firstDayOfMonth), eq(lastDayOfMonth)))
                .thenReturn(List.of());
        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(windowStart), eq(today)))
                .thenReturn(windowLogs);
        when(bookRepository.findMostReadGenre(user.getId())).thenReturn(List.of());
        when(readingLogRepository.sumPagesReadByUser(user)).thenReturn(25L);

        StatsResponse response = statsService.getStats(user);

        assertThat(response.averagePagesPerDay()).isEqualTo(12.5);
    }

    @Test
    @DisplayName("Deve retornar o total de páginas lidas vindo diretamente do repositório")
    void shouldReturnTotalPagesRead() {
        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(firstDayOfMonth), eq(lastDayOfMonth)))
                .thenReturn(List.of());
        when(readingLogRepository.findByUserAndDateBetween(eq(user), eq(windowStart), eq(today)))
                .thenReturn(List.of());
        when(bookRepository.findMostReadGenre(user.getId())).thenReturn(List.of());
        when(readingLogRepository.sumPagesReadByUser(user)).thenReturn(3847L);

        StatsResponse response = statsService.getStats(user);

        assertThat(response.totalPagesRead()).isEqualTo(3847L);
    }
}