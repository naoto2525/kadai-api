package com.example.kadaiapi.controller;


import com.example.kadaiapi.dto.Dog;
import com.example.kadaiapi.service.DogService;
import org.apache.ibatis.annotations.Delete;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/dogs")
public class DogController {
    private final DogService dogService;

    public DogController(DogService dogService) {
        this.dogService = dogService;
    }
    @GetMapping
    public ResponseEntity<List<Dog>> findAllDogs() {
    List<Dog> dogs = dogService.findAll();

//    return new ResponseEntity<>(dogs, HttpStatus.OK);
        return ResponseEntity.ok(dogs);
    }
    @PostMapping
    public ResponseEntity<Dog> saveDog(@RequestBody Dog dog,
                                       UriComponentsBuilder uriBuilder) {
        Dog createdDog = dogService.saveDog(dog);

        URI location = uriBuilder.path("/api/dogs/{id}").buildAndExpand(createdDog.getId()).toUri();

//        HttpHeaders headers = new HttpHeaders();
//        headers.setLocation(location);
//
//        return new ResponseEntity<>(createdDog, headers, HttpStatus.CREATED);
        return ResponseEntity.created(location).body(createdDog);

    }

    @GetMapping("/{id}")
    public ResponseEntity<Dog> findById(@PathVariable Long id) {
        Dog dog = dogService.findById(id);
        return ResponseEntity.ok(dog);

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id){
    dogService.delete(id);

    return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dog> update(@PathVariable long id, @RequestBody Dog dog){

        dogService.update(dog, id);

        return ResponseEntity.ok(dog);

    }
}
