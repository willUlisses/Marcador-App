package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.body.CreateGoalBody;
import br.com.will.marcador_api.dtos.response.ReadingGoalResponse;
import br.com.will.marcador_api.entities.ReadingGoal;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.exception.NotFoundException;
import br.com.will.marcador_api.repository.ReadingGoalRepository;
import br.com.will.marcador_api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReadingGoalServiceTest {

    @Mock
    private ReadingGoalRepository readingGoalRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReadingGoalService readingGoalService;

    private User user;
    private ReadingGoal readingGoal;
    private final Integer year = 2026;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        readingGoal = ReadingGoal.builder()
                .id(10L)
                .user(user)
                .year(year)
                .targetBooks(12)
                .build();
    }

    @Nested
    @DisplayName("Testes para createGoal")
    class CreateGoalTests {

        @Test
        @DisplayName("Deve criar uma nova meta quando não existir meta prévia no ano")
        void shouldCreateNewGoalWhenGoalDoesNotExist() {
            CreateGoalBody body = new CreateGoalBody(15);

            when(readingGoalRepository.findByUserIdAndYear(user.getId(), year))
                    .thenReturn(Optional.empty()) // Busca inicial no orElseGet
                    .thenReturn(Optional.of(readingGoal)); // Busca dentro do getGoalProgress

            when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
            when(readingGoalRepository.save(any(ReadingGoal.class))).thenReturn(readingGoal);
            when(readingGoalRepository.countCompletedBooksByUserIdAndYear(user.getId(), year)).thenReturn(5L);

            ReadingGoalResponse response = readingGoalService.createGoal(user, year, body);

            assertNotNull(response);
            assertEquals(year, response.year());
            verify(readingGoalRepository, times(1)).save(any(ReadingGoal.class));
            verify(userRepository, times(1)).findById(user.getId());
        }

        @Test
        @DisplayName("Deve atualizar a meta existente quando já houver registro no ano")
        void shouldUpdateGoalWhenGoalAlreadyExists() {
            CreateGoalBody body = new CreateGoalBody(20);

            when(readingGoalRepository.findByUserIdAndYear(user.getId(), year))
                    .thenReturn(Optional.of(readingGoal));
            when(readingGoalRepository.save(any(ReadingGoal.class))).thenReturn(readingGoal);
            when(readingGoalRepository.countCompletedBooksByUserIdAndYear(user.getId(), year)).thenReturn(5L);

            ReadingGoalResponse response = readingGoalService.createGoal(user, year, body);

            assertNotNull(response);
            assertEquals(20, readingGoal.getTargetBooks());
            verify(userRepository, never()).findById(anyLong()); // Não deve buscar usuário se a meta já existe
            verify(readingGoalRepository, times(1)).save(readingGoal);
        }

        @Test
        @DisplayName("Deve lançar NotFoundException ao tentar criar meta para usuário inexistente")
        void shouldThrowNotFoundExceptionWhenUserDoesNotExist() {
            CreateGoalBody body = new CreateGoalBody(10);

            when(readingGoalRepository.findByUserIdAndYear(user.getId(), year)).thenReturn(Optional.empty());
            when(userRepository.findById(user.getId())).thenReturn(Optional.empty());

            assertThrows(NotFoundException.class, () -> readingGoalService.createGoal(user, year, body));
            verify(readingGoalRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Testes para getGoalProgress")
    class GetGoalProgressTests {

        @Test
        @DisplayName("Deve retornar o progresso da meta com sucesso quando a meta existir")
        void shouldReturnGoalProgressSuccessfully() {
            when(readingGoalRepository.findByUserIdAndYear(user.getId(), year)).thenReturn(Optional.of(readingGoal));
            when(readingGoalRepository.countCompletedBooksByUserIdAndYear(user.getId(), year)).thenReturn(6L);

            ReadingGoalResponse response = readingGoalService.getGoalProgress(user, year);

            assertNotNull(response);
            assertEquals(year, response.year());
            assertEquals(12, response.targetBooks());
            assertEquals(6L, response.completedBooks());
        }

        @Test
        @DisplayName("Deve lançar NotFoundException quando a meta não for encontrada para o ano")
        void shouldThrowNotFoundExceptionWhenGoalNotFound() {
            when(readingGoalRepository.findByUserIdAndYear(user.getId(), year)).thenReturn(Optional.empty());

            NotFoundException exception = assertThrows(NotFoundException.class,
                    () -> readingGoalService.getGoalProgress(user, year));

            assertEquals("Meta de leitura não configurada para o ano de " + year, exception.getMessage());
            verify(readingGoalRepository, never()).countCompletedBooksByUserIdAndYear(anyLong(), anyInt());
        }
    }

    @Nested
    @DisplayName("Testes para deleteGoal")
    class DeleteGoalTests {

        @Test
        @DisplayName("Deve deletar a meta com sucesso quando ela existir")
        void shouldDeleteGoalSuccessfully() {
            when(readingGoalRepository.findByUserIdAndYear(user.getId(), year)).thenReturn(Optional.of(readingGoal));
            doNothing().when(readingGoalRepository).delete(readingGoal);

            assertDoesNotThrow(() -> readingGoalService.deleteGoal(user, year));

            verify(readingGoalRepository, times(1)).delete(readingGoal);
        }

        @Test
        @DisplayName("Deve lançar NotFoundException ao tentar deletar uma meta inexistente")
        void shouldThrowNotFoundExceptionWhenDeletingNonExistingGoal() {
            when(readingGoalRepository.findByUserIdAndYear(user.getId(), year)).thenReturn(Optional.empty());

            NotFoundException exception = assertThrows(NotFoundException.class,
                    () -> readingGoalService.deleteGoal(user, year));

            assertEquals("Meta de leitura não encontrada para o ano de " + year, exception.getMessage());
            verify(readingGoalRepository, never()).delete(any());
        }
    }
}