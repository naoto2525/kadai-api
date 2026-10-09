package com.example.kadaiapi.mapper;

import com.example.kadaiapi.dto.Dog;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;


@Mapper
public interface DogMapper {
    @Select("SELECT id, title, content, created_at From dog ORDER BY created_at DESC")
    List<Dog> findAll();

    @Insert("INSERT INTO dog ( title, content) VALUES (#{title}, #{content})")
    @Options(useGeneratedKeys = true, keyProperty = "id,createdAt", keyColumn = "id,created_at")

    int insert(Dog dog);


    @Select("SELECT id, title, content, created_at FROM dog WHERE id = #{id}")
    Dog findById(long id);
}
