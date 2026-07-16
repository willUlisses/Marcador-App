package br.com.will.marcador_api.entities.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ReadingStatus {

    WANT_TO_READ("QUERO_LER"),
    READING("LENDO"),
    COMPLETED("COMPLETADO"),
    DROPPED("ABANDONADO");

    private final String VALUE;

}
