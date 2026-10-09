package com.example.kadaiapi.service;

import com.example.kadaiapi.dto.Dog;
import com.example.kadaiapi.exception.DogNotFoundException;
import com.example.kadaiapi.repository.DogRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class DogService {
    private final DogRepository dogRepository;

    public DogService(DogRepository dogRepository) {
        this.dogRepository = dogRepository;
    }

    public List<Dog> findAll() {
        return dogRepository.findAll();
    }
    public Dog saveDog(Dog dog){
        dogRepository.insertDog(dog);
        return dog;
    }

    public Dog findById(long id){
        Dog dog = dogRepository.findById(id);

        if(dog == null){
            throw new DogNotFoundException(id);
        }
        return dog;
    }

}
