package br.com.will.marcador_api.dtos.response;

import br.com.will.marcador_api.entities.User;

public record AuthResponse(
        Long id,
        String username,
        String email,
        String role,
        String token
) {
    public static AuthResponse from(User user, String token) {
        return new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getVALUE(),
                token
        );
    }

}
