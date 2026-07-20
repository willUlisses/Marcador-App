package br.com.will.marcador_api.dtos.response;

import br.com.will.marcador_api.entities.User;

public record UserResponse(
        String username,
        String email,
        String role
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRole().getVALUE()
        );
    }
}
