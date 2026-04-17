package com.techstore.repository.brand;

import com.techstore.entity.brand.Brand;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    boolean existsBySlug(String slug);
    java.util.Optional<Brand> findByName(String name);
    java.util.Optional<Brand> findByNameIgnoreCase(String name);
    java.util.Optional<Brand> findBySlug(String slug);
}
