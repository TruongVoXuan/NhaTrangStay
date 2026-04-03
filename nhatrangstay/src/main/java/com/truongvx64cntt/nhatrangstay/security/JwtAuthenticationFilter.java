package com.truongvx64cntt.nhatrangstay.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.truongvx64cntt.nhatrangstay.entity.User;
import com.truongvx64cntt.nhatrangstay.repository.UserRepository;
import com.truongvx64cntt.nhatrangstay.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService,
            UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            try {
                String token = header.substring(7);

                System.out.println(">>> JWT FILTER RUN");
                System.out.println("Token: " + token);

                String email = jwtService.extractEmail(token);
                System.out.println("Email from token: " + email);

                User user = userRepository.findByEmail(email).orElse(null);
                System.out.println("User found: " + user);

                if (user != null) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));

                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else {
                    System.out.println("❌ USER NOT FOUND");
                }

            } catch (Exception e) {
                System.out.println("JWT ERROR: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

}
