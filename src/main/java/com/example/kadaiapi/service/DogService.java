package com.example.kadaiapi.service;

import com.example.kadaiapi.dto.Dog;
import com.example.kadaiapi.exception.DogArgumentNotValidException;
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

        if(dog.getTitle() == null || dog.getTitle().isEmpty()){
            throw new DogArgumentNotValidException("Title is empty");
        }

        if(dog.getContent() == null || dog.getContent().isEmpty()){
            throw new DogArgumentNotValidException("Content is empty");
        }

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

    public boolean delete (long id){
        if(!dogRepository.delete(id)){
            throw new DogNotFoundException(id);
        }
        return true;
    }

    public Dog update(Dog dog, long id){

        if(dog.getTitle() == null || dog.getTitle().isEmpty()){
            throw new DogArgumentNotValidException("Title is empty");
        }

        if(dog.getContent() == null || dog.getContent().isEmpty()){
            throw new DogArgumentNotValidException("Content is empty");
        }

        Dog targetDog = dogRepository.findById(id);
        if(targetDog == null){
            throw new DogNotFoundException(id);
        }

        dog.setId(id);
        dog.setCreatedAt(targetDog.getCreatedAt());
        return dogRepository.update(dog);
    }

}
