package com.truongvx64cntt.nhatrangstay.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequestADMIN {
    @NotBlank
    private String currentPassword;

    @NotBlank(message = "new password không được để trống")
    private String newPassword;

}