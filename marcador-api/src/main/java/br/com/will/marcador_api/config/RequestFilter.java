package br.com.will.marcador_api.config;

import br.com.will.marcador_api.repository.UserRepository;
import br.com.will.marcador_api.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class RequestFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = extrairToken(request);

        if (token != null) {
            String subject = tokenService.extrairSubject(token);

            if (subject != null) {
                userRepository.findById(Long.parseLong(subject)).ifPresent(user -> {
                    var authenticationToken = new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                });
            }
        }
        filterChain.doFilter(request, response);
    }

    private String extrairToken(HttpServletRequest request) {
        String tokenHeader = request.getHeader("Authorization");
        if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
            return tokenHeader.replace("Bearer ", "");
        } else return null;
    }


}
