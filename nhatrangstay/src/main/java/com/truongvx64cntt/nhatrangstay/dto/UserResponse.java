package com.truongvx64cntt.nhatrangstay.dto;

import com.truongvx64cntt.nhatrangstay.entity.OtpVerifications;
import com.truongvx64cntt.nhatrangstay.enums.Provider;
import com.truongvx64cntt.nhatrangstay.enums.Role;
import com.truongvx64cntt.nhatrangstay.enums.UserStatus;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String phone;
    private Provider provider;
    private UserStatus status;
    private Role role;
}
