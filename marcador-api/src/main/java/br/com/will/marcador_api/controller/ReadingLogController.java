package br.com.will.marcador_api.controller;

import br.com.will.marcador_api.dtos.response.StatsResponse;
import br.com.will.marcador_api.dtos.response.StreakResponse;
import br.com.will.marcador_api.dtos.response.WeeklyProgressResponse;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.service.ReadingLogService;
import br.com.will.marcador_api.service.StatsService;
import br.com.will.marcador_api.service.StreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/marcador/reading-logs")
@RequiredArgsConstructor
public class ReadingLogController {

    private final ReadingLogService readingLogService;
    private final StatsService statsService;
    private final StreakService streakService;

    @GetMapping("/weekly")
    public ResponseEntity<WeeklyProgressResponse> getWeeklyProgressData(@AuthenticationPrincipal User user) {
        return new ResponseEntity<>(readingLogService.getWeeklyProgress(user), HttpStatus.OK);
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(statsService.getStats(user));
    }

    @GetMapping("/streak")
    public ResponseEntity<StreakResponse> getStreak(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(streakService.getStreaks(user));
    }
}
