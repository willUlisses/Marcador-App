package br.com.will.marcador_api.repository;

import br.com.will.marcador_api.entities.Reflection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReflectionsRepository extends JpaRepository<Reflection, Long> {
}
