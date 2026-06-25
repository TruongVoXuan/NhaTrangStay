package com.truongvx64cntt.nhatrangstay.config;

import java.util.List;

import com.truongvx64cntt.nhatrangstay.entity.User;
import com.truongvx64cntt.nhatrangstay.security.JwtAuthenticationFilter;
import com.truongvx64cntt.nhatrangstay.service.CustomOAuth2UserService;
import com.truongvx64cntt.nhatrangstay.service.JwtService;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        private final CustomOAuth2UserService customOAuth2UserService;
        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final JwtService jwtService;

        public SecurityConfig(
                        CustomOAuth2UserService customOAuth2UserService,
                        JwtAuthenticationFilter jwtAuthenticationFilter,
                        JwtService jwtService) {
                this.customOAuth2UserService = customOAuth2UserService;
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
                this.jwtService = jwtService;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                // CSRF disable cho API
                                .csrf(csrf -> csrf.disable())

                                // CORS
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                                // Stateless JWT
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                // Fix lỗi 403 redirect login
                                .exceptionHandling(exception -> exception
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                                                        response.getWriter()
                                                                        .write("Access Denied: Please login first.");
                                                }))

                                // AUTH RULES (QUAN TRỌNG)
                                .authorizeHttpRequests(auth -> auth

                                                // OPTIONS
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .requestMatchers(HttpMethod.PUT, "/api/posts/*/lock")
                                                .hasAuthority("ROLE_ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/posts/*/unlock")
                                                .hasAuthority("ROLE_ADMIN")

                                                // PUBLIC APIs
                                                .requestMatchers(
                                                                "/",
                                                                "/home",
                                                                "/login/**",
                                                                "/oauth2/**",
                                                                "/swagger-ui/**",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui.html",
                                                                "/h2-console/**",
                                                                "/api/test/**",
                                                                "/api/reviews/post/**",
                                                                "/api/posts/**",
                                                                "/api/reviews/**",
                                                                "/api/home/**")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.PUT, "/api/users/change-password")
                                                .authenticated()

                                                // PROFILE (BẮT BUỘC LOGIN)
                                                .requestMatchers("/api/auth/profile").authenticated()
                                                .requestMatchers("/api/rental-procedures/**").authenticated()
                                                // ALL OTHER AUTH ROUTES PUBLIC (login, signup...)
                                                .requestMatchers("/api/auth/**").permitAll()

                                                .anyRequest().authenticated())

                                // JWT FILTER
                                .addFilterBefore(jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class)

                                // OAUTH GOOGLE LOGIN
                                .oauth2Login(oauth2 -> oauth2
                                                .userInfoEndpoint(withDefaults())
                                                .successHandler((request, response, authentication) -> {

                                                        OAuth2User oAuth2User = (OAuth2User) authentication
                                                                        .getPrincipal();

                                                        String registrationId = ((OAuth2AuthenticationToken) authentication)
                                                                        .getAuthorizedClientRegistrationId();

                                                        User user = customOAuth2UserService
                                                                        .processOAuth2User(oAuth2User, registrationId);

                                                        String token = jwtService.generateToken(
                                                                        user.getId(),
                                                                        user.getEmail(),
                                                                        user.getUsername(),
                                                                        user.getRole().name());

                                                        String redirectUrl = "http://localhost:3000/login/oauth2/code/google?token="
                                                                        + token;

                                                        response.sendRedirect(redirectUrl);
                                                }))

                                // H2 CONSOLE FIX
                                .headers(headers -> headers.frameOptions(frame -> frame.disable()));

                return http.build();
        }

        // ================= CORS =================
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration config = new CorsConfiguration();

                config.setAllowCredentials(true);
                config.setAllowedOriginPatterns(List.of("*"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowedMethods(List.of(
                                "GET", "POST", "PUT", "DELETE", "OPTIONS"));

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);

                return source;
        }

        // ================= PASSWORD =================
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public RestTemplate restTemplate() {
                return new RestTemplate();
        }

}