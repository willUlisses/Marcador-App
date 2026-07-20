package br.com.will.marcador_api.dtos.body;

public record PatchUserBody(
        String email,
        String username) {
}
