package com.truongvx64cntt.nhatrangstay.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostSearchRequest {
    private String keyword;
    private Float minPrice;
    private Float maxPrice;
    private Float minArea;
    private Float maxArea;
    private String location;
    private String commune;
    private Long typeId;
}