package com.techstore.dto.category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
    private String name;
    private String slug;
    private String description;
    private Long parentId;
    private String icon;
    private String imageUrl;
    private boolean active;
    private Integer sortOrder;
}
