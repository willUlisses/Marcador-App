package br.com.will.marcador_api.dtos.response;

import java.util.List;

public record MonthlyBooksResponse(
        int currentYear,
        List<MonthlyBookCountDTO> months
) {}