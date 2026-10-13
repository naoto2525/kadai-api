package com.example.kadaiapi.mapper;

import com.example.kadaiapi.dto.Dog;
import org.apache.ibatis.annotations.*;

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

    @Delete("DELETE FROM dog WHERE id = #{id}")
    int delete(long id);


    @Update("UPDATE dog SET title = #{title}, content = #{content} WHERE id = #{id}")
    int update(Dog dog);
    }
