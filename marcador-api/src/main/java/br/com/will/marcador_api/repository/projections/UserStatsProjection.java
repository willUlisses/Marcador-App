package br.com.will.marcador_api.repository.projections;

public interface UserStatsProjection {
    Long getBooksRead();
    Long getBooksInQueue();
    Long getTotalPagesRead();
}
