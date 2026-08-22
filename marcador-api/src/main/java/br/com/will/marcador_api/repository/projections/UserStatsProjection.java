package br.com.will.marcador_api.repository;

public interface UserStatsProjection {
    Long getBooksRead();
    Long getBooksInQueue();
    Long getTotalPagesRead();
}
