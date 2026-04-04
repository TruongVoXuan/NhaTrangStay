package com.truongvx64cntt.nhatrangstay.config;

import com.truongvx64cntt.nhatrangstay.entity.User;
import com.truongvx64cntt.nhatrangstay.enums.Provider;
import com.truongvx64cntt.nhatrangstay.enums.Role;
import com.truongvx64cntt.nhatrangstay.enums.UserStatus;
import com.truongvx64cntt.nhatrangstay.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {

            // 🔥 CHECK TRƯỚC KHI INSERT
            if (userRepository.existsByEmail("admin@nhatrangstay.com")) {
                System.out.println("Admin đã tồn tại, bỏ qua tạo mới.");
                return;
            }

            User admin = new User();
            admin.setEmail("admin@nhatrangstay.com");
            admin.setUsername("Super Admin");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setRole(Role.ADMIN);
            admin.setStatus(UserStatus.ACTIVE);
            admin.setProvider(Provider.LOCAL);

            userRepository.save(admin);

            System.out.println("---------------------------------------------");
            System.out.println("DA TAO USER MAU: admin@nhatrangstay.com / 123456");
            System.out.println("---------------------------------------------");
        };
    }
}