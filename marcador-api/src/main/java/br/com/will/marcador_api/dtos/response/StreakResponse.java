package br.com.will.marcador_api.dtos.response;

public record StreakResponse(
        int currentStreak,
        int highestStreak
) {}