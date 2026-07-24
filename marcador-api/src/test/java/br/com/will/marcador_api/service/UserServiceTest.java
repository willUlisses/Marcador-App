package br.com.will.marcador_api.service;

import br.com.will.marcador_api.dtos.body.ChangePasswordBody;
import br.com.will.marcador_api.dtos.body.PatchUserBody;
import br.com.will.marcador_api.dtos.response.UserResponse;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.entities.enums.Roles;
import br.com.will.marcador_api.exception.BadRequestException;
import br.com.will.marcador_api.exception.NotFoundException;
import br.com.will.marcador_api.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;


    @Nested
    @DisplayName("Update User method Tests")
    class UpdateUser {

        @Test
        @DisplayName("Must successfully update user data")
        void updateUser_Success() {
            User mockUser = new User();
            mockUser.setId(1L);
            mockUser.setUsername("testUser");
            mockUser.setEmail("testUser@email.com");
            mockUser.setRole(Roles.ROLE_USER);

            PatchUserBody body = new PatchUserBody("updatedUser@email.com", "updatedUser");

            Mockito.when(userRepository.findByUsername("updatedUser")).thenReturn(Optional.empty());
            Mockito.when(userRepository.existsByEmail("updatedUser@email.com")).thenReturn(false);
            Mockito.when(userRepository.save(Mockito.any(User.class))).thenAnswer(i -> i.getArgument(0));

            UserResponse response = userService.updateUser(mockUser, body);

            Assertions.assertNotNull(response);
            Assertions.assertEquals("updatedUser", response.username());
            Assertions.assertEquals("updatedUser@email.com", response.email());

            Mockito.verify(userRepository).save((mockUser));
        }

        @Test
        @DisplayName("Must throw BadRequestException when searching for a username that already exists.")
        void updateUser_UsernameAlreadyExists() {
            User mockUser = new User();
            mockUser.setId(1L);
            mockUser.setUsername("testUser");

            PatchUserBody body = new PatchUserBody("updatedUser@email.com", "updatedUser");

            Mockito.when(userRepository.findByUsername("updatedUser")).thenReturn(Optional.of(Mockito.mock(User.class)));

            Assertions.assertThrows(BadRequestException.class, () -> userService.updateUser(mockUser, body));

            Mockito.verify(userRepository, Mockito.never()).save(Mockito.any(User.class));
        }

        @Test
        @DisplayName("must throw BadRequestException when searching for a email that already exists.")
        void updateUser_EmailAlreadyExists() {
            User mockUser = new User();
            mockUser.setId(1L);
            mockUser.setEmail("testUser@email.com");

            PatchUserBody body = new PatchUserBody("updatedUser@email.com", "updatedUser");

            Mockito.when(userRepository.findByUsername("updatedUser")).thenReturn(Optional.empty());
            Mockito.when(userRepository.existsByEmail("updatedUser@email.com")).thenReturn(true);

            Assertions.assertThrows(BadRequestException.class, () -> userService.updateUser(mockUser, body));

            Mockito.verify(userRepository, Mockito.never()).save(Mockito.any(User.class));
        }
    }

    @Nested
    @DisplayName("Change Account Password method Tests")
    class DeleteUser {

        @Test
        @DisplayName("Must successfully change account password")
        void changePassword_Success() {
            User mockUser = new User();
            mockUser.setId(1L);
            mockUser.setPassword("hashedOldPasswordTest");

            ChangePasswordBody body = new ChangePasswordBody("oldPasswordTest", "newPasswordTest");

            Mockito.when(passwordEncoder
                    .matches("oldPasswordTest", "hashedOldPasswordTest"))
                    .thenReturn(true);

            Mockito.when(passwordEncoder
                    .matches("newPasswordTest", "hashedOldPasswordTest"))
                    .thenReturn(false);

            userService.changePassword(mockUser, body);

            Mockito.verify(passwordEncoder).encode("newPasswordTest");
            Mockito.verify(userRepository).save(mockUser);
        }

        @Test
        @DisplayName("Must throw BadRequestException when the current password doesn't match")
        void changePassword_CurrentPasswordDoesNotMatch() {
            User mockUser = new User();
            mockUser.setId(1L);
            mockUser.setPassword("hashedOldPasswordTest");

            ChangePasswordBody body = new ChangePasswordBody("wrongOldPasswordTest", "newPasswordTest");

            Mockito.when(passwordEncoder
                    .matches("wrongOldPasswordTest", "hashedOldPasswordTest"))
                    .thenReturn(false);

            Assertions.assertThrows(BadRequestException.class, () -> userService.changePassword(mockUser, body));

            Mockito.verify(passwordEncoder, Mockito.never()).encode(Mockito.anyString());
            Mockito.verify(userRepository, Mockito.never()).save(Mockito.any(User.class));
        }

        @Test
        @DisplayName("Must throw BadRequestException when the currentPassword matches with the new password")
        void changePassword_CurrentPasswordMatchesWithNewPassword() {
            User mockUser = new User();
            mockUser.setId(1L);
            mockUser.setPassword("hashedOldPasswordTest");

            ChangePasswordBody body = new ChangePasswordBody("oldPasswordTest", "equalNewPasswordTest");


            Mockito.when(passwordEncoder
                    .matches("oldPasswordTest", "hashedOldPasswordTest"))
                    .thenReturn(true);

            Mockito.when(passwordEncoder
                    .matches("equalNewPasswordTest", "hashedOldPasswordTest"))
                    .thenReturn(true);

            Assertions.assertThrows(BadRequestException.class, () -> userService.changePassword(mockUser, body));

            Mockito.verify(passwordEncoder, Mockito.never()).encode(Mockito.anyString());
            Mockito.verify(userRepository, Mockito.never()).save(Mockito.any(User.class));
        }
    }

    @Nested
    @DisplayName("Delete User method Tests")
    class ChangePassword {

        @Test
        @DisplayName("Must delete a user successfully")
        void deleteUser_Success() {
            User mockUser = new User();
            mockUser.setId(1L);

            Mockito.when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

            userService.deleteUserById(1L);

            Mockito.verify(userRepository).deleteById(1L);
        }

        @Test
        @DisplayName("Must throw NotFoundException if the user to be deleted doesn't exist")
        void deleteUser_UserToBeDeletedDoesNotExist() {
            User mockUser = new User();
            mockUser.setId(1L);

            Mockito.when(userRepository.findById(1L)).thenReturn(Optional.empty());

            Assertions.assertThrows(NotFoundException.class, () -> userService.deleteUserById(1L));

            Mockito.verify(userRepository, Mockito.never()).deleteById(1L);
        }

    }

}
