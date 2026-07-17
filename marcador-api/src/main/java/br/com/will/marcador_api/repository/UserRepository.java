package br.com.will.marcador_api.repository;

import br.com.will.marcador_api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}
