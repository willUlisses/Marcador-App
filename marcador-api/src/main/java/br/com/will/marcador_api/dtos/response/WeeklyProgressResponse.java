package br.com.will.marcador_api.dtos.response;

import br.com.will.marcador_api.dtos.body.DailyReadingDTO;

import java.util.List;

public record WeeklyProgressResponse(Integer weeklyTotalPages, List<DailyReadingDTO> days) {
}
