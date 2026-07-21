package br.com.will.marcador_api.controller;

import br.com.will.marcador_api.dtos.body.ChangePasswordBody;
import br.com.will.marcador_api.dtos.body.PatchUserBody;
import br.com.will.marcador_api.dtos.response.UserResponse;
import br.com.will.marcador_api.entities.User;
import br.com.will.marcador_api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    //TODO: PATCH updateUser(User user, PatchUserBody body)
    @PatchMapping("/update")
    public ResponseEntity<UserResponse> updateUser(@AuthenticationPrincipal User user,
                                                   @RequestBody PatchUserBody body) {
        return new ResponseEntity<>(userService.updateUser(user, body), HttpStatus.OK);
    }

    //TODO: PATCH changePassword(User user, ChangePasswordBody body)
    @PatchMapping("/change-password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal User user,
                                               @RequestBody @Valid ChangePasswordBody body) {
        userService.changePassword(user, body);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //TODO: DELETE deleteUserById(@PathVariable Long userId)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUserById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
