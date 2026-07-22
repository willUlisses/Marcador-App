package br.com.will.marcador_api.dtos.response;

import br.com.will.marcador_api.entities.Reflection;

public record ReflectionResponse(
        Long id,
        String title,
        String description
) {
    public static ReflectionResponse from(Reflection reflection) {
        return new ReflectionResponse(
                reflection.getId(),
                reflection.getTitle(),
                reflection.getDescription()
        );
    }

}
