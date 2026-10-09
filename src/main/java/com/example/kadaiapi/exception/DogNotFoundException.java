package com.example.kadaiapi.exception;

public class DogNotFoundException extends RuntimeException {
    public DogNotFoundException(long id) {
        super("指定されたIDのノートが見つかりません:" + id);
    }
}
