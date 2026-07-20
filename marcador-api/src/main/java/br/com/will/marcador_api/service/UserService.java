package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.body.ChangePasswordBody;
import br.com.will.marcador_api.dtos.body.PatchUserBody;
import br.com.will.marcador_api.dtos.response.UserResponse;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.exception.BadRequestException;
import br.com.will.marcador_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse updateUser(User user, PatchUserBody body) {
        if (userRepository.findByUsername(body.username()).isPresent()) throw new BadRequestException("A user with this username already exists");

        Optional.ofNullable(body.username()).ifPresent(user::setUsername);

        if (body.email() != null && !Objects.equals(body.email(), user.getEmail())) {
            if (userRepository.existsByEmail(body.email())) throw new BadRequestException("Email already in use.");

            user.setEmail(body.email());
        }

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void changePassword(User user, ChangePasswordBody body) {
        if (!passwordEncoder.matches(body.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match.");
        }

        if (passwordEncoder.matches(body.newPassword(), user.getPassword())) {
            throw new BadRequestException("New password cannot be the same as the current password.");
        }

        user.setPassword(passwordEncoder.encode(body.newPassword()));

        userRepository.save(user);
    }

    @Transactional
    public void deleteUserById(Long userId) {
        if (userRepository.findById(userId).isPresent()) {
            userRepository.deleteById(userId);
        } else throw new BadRequestException("User not found.");
    }


}
