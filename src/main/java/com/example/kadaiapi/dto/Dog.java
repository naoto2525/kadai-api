package com.example.kadaiapi.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Dog {

    private long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
}
