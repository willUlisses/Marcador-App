package br.com.will.marcador_api.dtos.response;

public record StatsResponse(
        int pagesReadThisMonth,
        String mostReadGenre,
        double averagePagesPerDay,
        int currentStreak
) {}
