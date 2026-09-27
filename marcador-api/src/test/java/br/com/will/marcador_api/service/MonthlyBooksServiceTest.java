package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.response.MonthlyBookCountDTO;
import br.com.will.marcador_api.dtos.response.MonthlyBooksResponse;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MonthlyBooksServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private MonthlyBooksService monthlyBooksService;

    private static final ZoneId ZONE_ID = ZoneId.of("America/Sao_Paulo");
    private static final int MONTHS_WINDOW = 7;

    private User user;
    private YearMonth currentYearMonth;
    private YearMonth startYearMonth;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        currentYearMonth = YearMonth.now(ZONE_ID);
        startYearMonth = currentYearMonth.minusMonths(MONTHS_WINDOW - 1);
    }

    private MonthlyBookCountDTO findMonth(MonthlyBooksResponse response, YearMonth target) {
        return response.months().stream()
                .filter(m -> m.year() == target.getYear() && m.monthNumber() == target.getMonthValue())
                .findFirst()
                .orElseThrow(() -> new AssertionError("Mês " + target + " não encontrado na resposta"));
    }

    @Test
    @DisplayName("Deve retornar sempre 7 meses, mesmo sem nenhum livro concluído")
    void shouldAlwaysReturnSevenMonths() {
        when(bookRepository.findCompletedAtByUserAndDateRange(eq(user.getId()), any(), any()))
                .thenReturn(List.of());

        MonthlyBooksResponse response = monthlyBooksService.getMonthlyBooksRead(user);

        assertThat(response.months()).hasSize(MONTHS_WINDOW);
        assertThat(response.months()).allSatisfy(month -> assertThat(month.booksCompleted()).isZero());
    }

    @Test
    @DisplayName("Deve retornar os meses em ordem cronológica, do mais antigo para o mais recente")
    void shouldReturnMonthsInChronologicalOrder() {
        when(bookRepository.findCompletedAtByUserAndDateRange(eq(user.getId()), any(), any()))
                .thenReturn(List.of());

        MonthlyBooksResponse response = monthlyBooksService.getMonthlyBooksRead(user);

        YearMonth expectedCursor = startYearMonth;
        for (MonthlyBookCountDTO month : response.months()) {
            assertThat(month.monthNumber()).isEqualTo(expectedCursor.getMonthValue());
            assertThat(month.year()).isEqualTo(expectedCursor.getYear());
            expectedCursor = expectedCursor.plusMonths(1);
        }
    }

    @Test
    @DisplayName("O último mês da lista deve ser sempre o mês atual")
    void lastMonthShouldAlwaysBeCurrentMonth() {
        when(bookRepository.findCompletedAtByUserAndDateRange(eq(user.getId()), any(), any()))
                .thenReturn(List.of());

        MonthlyBooksResponse response = monthlyBooksService.getMonthlyBooksRead(user);

        MonthlyBookCountDTO lastMonth = response.months().get(response.months().size() - 1);

        assertThat(lastMonth.monthNumber()).isEqualTo(currentYearMonth.getMonthValue());
        assertThat(lastMonth.year()).isEqualTo(currentYearMonth.getYear());
        assertThat(response.currentYear()).isEqualTo(currentYearMonth.getYear());
    }

    @Test
    @DisplayName("Deve contar corretamente múltiplos livros concluídos no mesmo mês")
    void shouldCountMultipleBooksInSameMonth() {
        LocalDateTime completion1 = currentYearMonth.atDay(2).atStartOfDay();
        LocalDateTime completion2 = currentYearMonth.atDay(15).atTime(10, 30);
        LocalDateTime completion3 = currentYearMonth.atDay(28).atTime(18, 0);

        when(bookRepository.findCompletedAtByUserAndDateRange(eq(user.getId()), any(), any()))
                .thenReturn(List.of(completion1, completion2, completion3));

        MonthlyBooksResponse response = monthlyBooksService.getMonthlyBooksRead(user);

        MonthlyBookCountDTO currentMonthDto = findMonth(response, currentYearMonth);
        assertThat(currentMonthDto.booksCompleted()).isEqualTo(3);
    }

    @Test
    @DisplayName("Deve distribuir corretamente livros concluídos em meses diferentes da janela")
    void shouldDistributeBooksAcrossDifferentMonths() {
        YearMonth twoMonthsAgo = currentYearMonth.minusMonths(2);
        YearMonth fiveMonthsAgo = currentYearMonth.minusMonths(5);

        LocalDateTime completionCurrent = currentYearMonth.atDay(1).atStartOfDay();
        LocalDateTime completionTwoMonthsAgo = twoMonthsAgo.atDay(10).atStartOfDay();
        LocalDateTime completionFiveMonthsAgo1 = fiveMonthsAgo.atDay(5).atStartOfDay();
        LocalDateTime completionFiveMonthsAgo2 = fiveMonthsAgo.atDay(20).atStartOfDay();

        when(bookRepository.findCompletedAtByUserAndDateRange(eq(user.getId()), any(), any()))
                .thenReturn(List.of(
                        completionCurrent,
                        completionTwoMonthsAgo,
                        completionFiveMonthsAgo1,
                        completionFiveMonthsAgo2
                ));

        MonthlyBooksResponse response = monthlyBooksService.getMonthlyBooksRead(user);

        assertThat(findMonth(response, currentYearMonth).booksCompleted()).isEqualTo(1);
        assertThat(findMonth(response, twoMonthsAgo).booksCompleted()).isEqualTo(1);
        assertThat(findMonth(response, fiveMonthsAgo).booksCompleted()).isEqualTo(2);
    }

    @Test
    @DisplayName("Deve consultar o repositório com o intervalo de datas correto: do 1º dia do mês mais antigo até o fim do mês atual")
    void shouldQueryRepositoryWithCorrectDateRange() {
        LocalDateTime expectedStart = startYearMonth.atDay(1).atStartOfDay();
        LocalDateTime expectedEnd = currentYearMonth.atEndOfMonth().atTime(23, 59, 59);

        when(bookRepository.findCompletedAtByUserAndDateRange(user.getId(), expectedStart, expectedEnd))
                .thenReturn(List.of());

        monthlyBooksService.getMonthlyBooksRead(user);

        verify(bookRepository).findCompletedAtByUserAndDateRange(user.getId(), expectedStart, expectedEnd);
    }

    @Test
    @DisplayName("Meses sem nenhum livro concluído devem aparecer com contagem 0, nunca ausentes")
    void monthsWithoutBooksShouldAppearAsZero() {
        LocalDateTime onlyCompletion = currentYearMonth.atDay(1).atStartOfDay();

        when(bookRepository.findCompletedAtByUserAndDateRange(eq(user.getId()), any(), any()))
                .thenReturn(List.of(onlyCompletion));

        MonthlyBooksResponse response = monthlyBooksService.getMonthlyBooksRead(user);

        YearMonth cursor = startYearMonth;
        while (cursor.isBefore(currentYearMonth)) {
            assertThat(findMonth(response, cursor).booksCompleted()).isZero();
            cursor = cursor.plusMonths(1);
        }
    }
}