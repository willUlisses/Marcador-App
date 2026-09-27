package br.com.will.marcador_api.dtos.response;

public record MonthlyBookCountDTO(
        String monthLabel,
        int monthNumber,
        int year,
        long booksCompleted
) {}