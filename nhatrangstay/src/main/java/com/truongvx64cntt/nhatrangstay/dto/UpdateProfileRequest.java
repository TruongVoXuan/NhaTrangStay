package com.truongvx64cntt.nhatrangstay.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String username;
    private String email;
    private String phone;
}
