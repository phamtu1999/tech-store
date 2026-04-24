package com.techstore.service.product;

import com.techstore.dto.product.ProductRequest;
import com.techstore.entity.brand.Brand;
import com.techstore.entity.category.Category;
import com.techstore.entity.product.Product;
import com.techstore.exception.AppException;
import com.techstore.repository.brand.BrandRepository;
import com.techstore.repository.category.CategoryRepository;
import com.techstore.repository.product.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductAdminServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private BrandRepository brandRepository;

    @InjectMocks
    private ProductAdminService productAdminService;

    private ProductRequest productRequest;
    private Category category;
    private Brand brand;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId("CAT1");
        category.setName("Electronics");
        category.setSlug("electronics");

        brand = new Brand();
        brand.setId("BR1");
        brand.setName("Sony");
        brand.setSlug("sony");

        productRequest = new ProductRequest();
        productRequest.setName("Xperia 1");
        productRequest.setCategoryId("CAT1");
        productRequest.setBrandId("BR1");
        productRequest.setDescription("Best phone");
        productRequest.setActive(true);
        
        List<ProductRequest.VariantRequest> variants = new ArrayList<>();
        ProductRequest.VariantRequest v1 = new ProductRequest.VariantRequest();
        v1.setSku("X1-BLACK");
        v1.setName("Black");
        v1.setPrice(new BigDecimal("1000"));
        v1.setStockQuantity(10);
        variants.add(v1);
        productRequest.setVariants(variants);

        List<ProductRequest.AttributeRequest> attributes = new ArrayList<>();
        ProductRequest.AttributeRequest a1 = new ProductRequest.AttributeRequest();
        a1.setName("RAM");
        a1.setValue("12GB");
        attributes.add(a1);
        productRequest.setAttributes(attributes);

        List<String> imageUrls = new ArrayList<>();
        imageUrls.add("http://image1.jpg");
        productRequest.setImageUrls(imageUrls);
    }

    @Test
    void createProduct_ShouldSaveProduct() {
        when(categoryRepository.findById("CAT1")).thenReturn(Optional.of(category));
        when(brandRepository.findById("BR1")).thenReturn(Optional.of(brand));

        productAdminService.createProduct(productRequest);

        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void updateProduct_ShouldUpdateExistingProduct() {
        Product existingProduct = new Product();
        existingProduct.setId("P1");
        existingProduct.setName("Old Name");
        existingProduct.setVariants(new HashSet<>());
        existingProduct.setAttributes(new HashSet<>());
        existingProduct.setImages(new HashSet<>());

        when(productRepository.findById("P1")).thenReturn(Optional.of(existingProduct));
        when(categoryRepository.findById("CAT1")).thenReturn(Optional.of(category));
        when(brandRepository.findById("BR1")).thenReturn(Optional.of(brand));
        when(productRepository.findBySlug(any())).thenReturn(Optional.empty());

        productAdminService.updateProduct("P1", productRequest);

        assertEquals("Xperia 1", existingProduct.getName());
        verify(productRepository, times(1)).save(existingProduct);
    }

    @Test
    void deleteProduct_ShouldDeleteWhenExists() {
        when(productRepository.existsById("P1")).thenReturn(true);

        productAdminService.deleteProduct("P1");

        verify(productRepository, times(1)).deleteById("P1");
    }

    @Test
    void deleteProduct_ShouldThrowWhenNotFound() {
        when(productRepository.existsById("P1")).thenReturn(false);

        assertThrows(AppException.class, () -> productAdminService.deleteProduct("P1"));
    }
}
