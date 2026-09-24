package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.body.CreateGoalBody;
import br.com.will.marcador_api.dtos.response.ReadingGoalResponse;
import br.com.will.marcador_api.entities.ReadingGoal;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.exception.NotFoundException;
import br.com.will.marcador_api.repository.ReadingGoalRepository;
import br.com.will.marcador_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReadingGoalService {

    private final ReadingGoalRepository readingGoalRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReadingGoalResponse createGoal(User user, Integer year, CreateGoalBody createGoalBody) {
        var goal = readingGoalRepository.findByUserIdAndYear(user.getId(), year)
                .orElseGet(() -> {
                        User userLogged = userRepository.findById(user.getId())
                                .orElseThrow(() -> new NotFoundException("User not found"));
                        return ReadingGoal
                                .builder()
                                .user(userLogged)
                                .year(year)
                                .build();
                });

        goal.setTargetBooks(createGoalBody.targetBooks());
        readingGoalRepository.save(goal);

        return getGoalProgress(user, year);
    }

    @Transactional(readOnly = true)
    public ReadingGoalResponse getGoalProgress(User user, Integer year) {
        ReadingGoal goal = readingGoalRepository.findByUserIdAndYear(user.getId(), year)
                .orElseThrow(() -> new NotFoundException("Meta de leitura não configurada para o ano de " + year));

        Long completedBooks = readingGoalRepository.countCompletedBooksByUserIdAndYear(user.getId(), year);

        return ReadingGoalResponse.of(year, goal.getTargetBooks(), completedBooks);
    }

    @Transactional
    public void deleteGoal(User user, Integer year) {
        ReadingGoal goal = readingGoalRepository.findByUserIdAndYear(user.getId(), year)
                .orElseThrow(() -> new NotFoundException("Meta de leitura não encontrada para o ano de " + year));

        readingGoalRepository.delete(goal);
    }



}
