package com.example.kadaiapi.repository;

import com.example.kadaiapi.dto.Dog;
import com.example.kadaiapi.exception.DogNotFoundException;
import com.example.kadaiapi.mapper.DogMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DogRepository {
    private final DogMapper dogMapper;


    public DogRepository(DogMapper dogMapper) {
        this.dogMapper = dogMapper;
    }

    public List<Dog> findAll() {
        return dogMapper.findAll();
    }

    public int insertDog(Dog dog){
        return dogMapper.insert(dog);
    }
    public Dog findById(long id){
        return dogMapper.findById(id);
    }

    public boolean delete (long id){
        return dogMapper.delete(id) == 1;
    }

    public Dog update (Dog dog){
        if(dogMapper.update(dog) == 0){
            throw new DogNotFoundException(dog.getId());
        }
        return dog;
    }
}


