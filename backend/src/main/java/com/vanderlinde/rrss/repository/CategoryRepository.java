package com.vanderlinde.rrss.repository;


import com.vanderlinde.rrss.model.Category;
import com.vanderlinde.rrss.model.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer>{
    Category findByName(String name);

    boolean existsByName(String name);
}
