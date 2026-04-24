package com.techstore.controller.product;

import com.techstore.dto.PageResponse;
import com.techstore.dto.product.ProductMinResponse;
import com.techstore.dto.product.ProductResponse;
import com.techstore.security.JwtService;
import com.techstore.security.RateLimiterService;
import com.techstore.service.auth.SessionManagementService;
import com.techstore.service.product.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for simplicity in unit tests
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private RedisConnectionFactory redisConnectionFactory;

    @MockBean
    private RateLimiterService rateLimiterService;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private SessionManagementService sessionManagementService;

    @Test
    void getProducts_ShouldReturnOk() throws Exception {
        PageResponse<ProductMinResponse> pageResponse = PageResponse.of(new PageImpl<>(List.of(), PageRequest.of(0, 10), 0));
        
        when(productService.getProducts(any(), any(), any(), any(), any(), any()))
                .thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/products")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").exists());
    }

    @Test
    void getProductBySlug_ShouldReturnProduct() throws Exception {
        ProductResponse productResponse = ProductResponse.builder()
                .name("Test Product")
                .slug("test-product")
                .build();

        when(productService.getProductBySlug("test-product")).thenReturn(productResponse);

        mockMvc.perform(get("/api/v1/products/test-product")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.name").value("Test Product"));
    }
}
