package com.techstore.dto.category;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryResponse {
    Long id;
    String name;
    String slug;
    String description;
    String icon;
    String imageUrl;
    Integer sortOrder;
    Long parentId;
    String parentName;
    Long productCount;
    LocalDateTime createdAt;
    List<CategoryResponse> children;
}
