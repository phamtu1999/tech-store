package com.techstore.service.product;

import com.techstore.dto.PageResponse;
import com.techstore.dto.product.ProductMinResponse;
import com.techstore.dto.product.ProductResponse;
import com.techstore.entity.product.Product;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.product.ProductListingRow;
import com.techstore.repository.product.ProductRepository;
import com.techstore.repository.review.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private ProductListingRow listingRow;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId("prod-1");
        product.setName("Test Product");
        product.setSlug("test-product");
        product.setPrice(BigDecimal.valueOf(100000));
        product.setActive(true);

        listingRow = new ProductListingRow();
        listingRow.setId("prod-1");
        listingRow.setName("Test Product");
        listingRow.setSlug("test-product");
        listingRow.setPrice(BigDecimal.valueOf(100000));
    }

    @Test
    void getProducts_ShouldReturnPageResponse() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<ProductListingRow> page = new PageImpl<>(List.of(listingRow), pageable, 1);

        when(productRepository.findPublicProductListing(any(), any(), any(), any(), any(), any()))
                .thenReturn(page);

        PageResponse<ProductMinResponse> response = productService.getProducts(null, null, null, null, null, pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals("Test Product", response.getContent().get(0).getName());
    }

    @Test
    void getProductBySlug_ShouldReturnProductResponse() {
        when(productRepository.findBySlug("test-product")).thenReturn(Optional.of(product));
        when(reviewRepository.countByProductIdIn(anyList())).thenReturn(List.of());

        ProductResponse response = productService.getProductBySlug("test-product");

        assertNotNull(response);
        assertEquals("Test Product", response.getName());
    }

    @Test
    void getProductBySlug_ShouldThrowException_WhenNotFound() {
        when(productRepository.findBySlug("unknown")).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> 
                productService.getProductBySlug("unknown"));
        
        assertEquals(ErrorCode.ENTITY_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void getProductById_ShouldReturnProductResponse() {
        when(productRepository.findById("prod-1")).thenReturn(Optional.of(product));
        when(reviewRepository.countByProductIdIn(anyList())).thenReturn(List.of());

        ProductResponse response = productService.getProductById("prod-1");

        assertNotNull(response);
        assertEquals("prod-1", response.getId());
    }
}
