package com.techstore.dto.category;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponse {
    Long id;
    String name;
    String slug;
    String description;
    String icon;
    String imageUrl;
    boolean active;
    Integer sortOrder;
    Long parentId;
    String parentName;
    Long productCount;
    LocalDateTime createdAt;
    List<CategoryResponse> children;
}
