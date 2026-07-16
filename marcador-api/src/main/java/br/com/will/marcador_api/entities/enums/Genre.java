package br.com.will.marcador_api.entities.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Genre {

    ROMANCE("ROMANCE"),
    FICTION("FICÇÃO"),
    FACTUAL("FACTUAL"),
    TECHNOLOGY("TECNOLOGIA"),
    PHILOSOPHY("FILOSOFIA"),
    BUSINESS("NEGÓCIOS"),
    BIOGRAPHY("BIOGRAFICO"),
    FINANCE("FINANÇAS"),
    FANTASY("FANTASIA"),
    HORROR("TERROR"),
    POETRY("POESIA"),
    OTHER("OUTRO"),;

    private final String VALUE;
}
