package com.techstore.repository.category;

import com.techstore.entity.category.Category;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    List<Category> findByParentIsNullOrderBySortOrderAsc(); // Get root categories ordered
    List<Category> findAllByOrderBySortOrderAsc();
    java.util.Optional<Category> findByName(String name);
    java.util.Optional<Category> findByNameIgnoreCase(String name);
    java.util.Optional<Category> findBySlug(String slug);
}
