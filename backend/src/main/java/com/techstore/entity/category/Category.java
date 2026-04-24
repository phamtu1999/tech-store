package com.techstore.entity.category;

import com.techstore.entity.base.BaseEntity;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "children", "parent"})
public class Category extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    private String description;

    private String icon;

    private String imageUrl;

    private Integer sortOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent")
    @Builder.Default
    private List<Category> children = new java.util.ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    // Soft delete strategy or setting parent to null on delete can be handled in Service layer
}
