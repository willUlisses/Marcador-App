package br.com.will.marcador_api.dtos.response;

import lombok.Builder;

@Builder
public record ExceptionResponse(
        String message,
        Integer statusCode
) {
}
