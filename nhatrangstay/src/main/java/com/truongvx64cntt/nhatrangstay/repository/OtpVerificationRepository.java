package com.truongvx64cntt.nhatrangstay.repository;

import com.truongvx64cntt.nhatrangstay.entity.OtpVerifications;
import com.truongvx64cntt.nhatrangstay.enums.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerifications, Long> {
    Optional<OtpVerifications> findByTargetValue(String targetValue);

    Optional<OtpVerifications> findByTargetValueAndOtpAndType(String targetValue, String otp, OtpType type);

}
