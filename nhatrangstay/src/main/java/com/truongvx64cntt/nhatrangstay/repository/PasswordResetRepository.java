package com.truongvx64cntt.nhatrangstay.repository;

import com.truongvx64cntt.nhatrangstay.entity.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetRepository extends JpaRepository<PasswordReset, Long> {

    Optional<PasswordReset> findByUser_Email(String userEmail);

    Optional<PasswordReset> findByResetToken(String resetToken);

}