package br.com.will.marcador_api.controller;

import br.com.will.marcador_api.dtos.body.CreateGoalBody;
import br.com.will.marcador_api.dtos.response.ReadingGoalResponse;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.service.ReadingGoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/marcador/goals")
@RequiredArgsConstructor
public class ReadingGoalController {

    private final ReadingGoalService readingGoalService;

    @GetMapping
    public ResponseEntity<ReadingGoalResponse> getGoalProgress(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "year", required = false) Integer year) {

        int targetYear = (year != null) ? year : LocalDate.now().getYear();
        return ResponseEntity.ok(readingGoalService.getGoalProgress(user, targetYear));
    }

    @PutMapping("/{year}")
    public ResponseEntity<ReadingGoalResponse> saveGoal(
            @AuthenticationPrincipal User user,
            @PathVariable("year") Integer year,
            @RequestBody @Valid CreateGoalBody body) {

        return ResponseEntity.ok(readingGoalService.createGoal(user, year, body));
    }

    @DeleteMapping("/{year}")
    public ResponseEntity<Void> deleteGoal(
            @AuthenticationPrincipal User user,
            @PathVariable("year") Integer year) {

        readingGoalService.deleteGoal(user, year);
        return ResponseEntity.noContent().build();
    }

}
