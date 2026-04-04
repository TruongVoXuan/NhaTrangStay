package com.truongvx64cntt.nhatrangstay.entity;

import com.truongvx64cntt.nhatrangstay.enums.OtpType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OtpVerifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    private String otp;

    @Enumerated(EnumType.STRING)
    OtpType type;

    private String targetValue;

    private String newName;

    private Instant expired_at;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;
}