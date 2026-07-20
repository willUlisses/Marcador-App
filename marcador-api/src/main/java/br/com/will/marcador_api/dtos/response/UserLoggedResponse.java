package br.com.will.marcador_api.dtos.response;

import br.com.will.marcador_api.entities.User;

public record UserLoggedResponse(
        String username,
        String email,
        String role
) {
    public static UserLoggedResponse from(User user) {
        return new UserLoggedResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRole().getVALUE()
        );
    }
}
