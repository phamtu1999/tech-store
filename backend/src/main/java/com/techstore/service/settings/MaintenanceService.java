package com.techstore.service.settings;

import com.techstore.entity.product.Product;
import com.techstore.entity.product.ProductAttribute;
import com.techstore.repository.product.ProductAttributeRepository;
import com.techstore.repository.product.ProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final ProductRepository productRepository;
    private final ProductAttributeRepository attributeRepository;

    @Transactional
    public String populateAllProductSpecs() {
        // Optimization: Use Batch processing instead of N+1 queries
        List<Product> products = productRepository.findAll();
        List<ProductAttribute> allNewSpecs = new ArrayList<>();
        
        // 1. Bulk delete all existing attributes to save time
        attributeRepository.deleteAllInBatch();
        
        for (Product product : products) {
            String name = product.getName().toLowerCase();
            String category = (product.getCategory() != null ? product.getCategory().getName() : "").toLowerCase();

            if (name.contains("iphone")) {
                allNewSpecs.add(createAttr(product, "Màn hình", "6.1 inch, Super Retina XDR OLED, 120Hz"));
                allNewSpecs.add(createAttr(product, "Vi xử lý", "Apple A18 Pro (3 nm)"));
                allNewSpecs.add(createAttr(product, "RAM", "8GB"));
                allNewSpecs.add(createAttr(product, "Bộ nhớ trong", "256GB / 512GB"));
                allNewSpecs.add(createAttr(product, "Camera sau", "48MP chính, 12MP siêu rộng, 12MP tele"));
                allNewSpecs.add(createAttr(product, "Pin", "4,422 mAh, Sạc nhanh 30W"));
            } else if (name.contains("samsung") || category.contains("điện thoại")) {
                allNewSpecs.add(createAttr(product, "Màn hình", "6.7 inch, Dynamic AMOLED 2X, 120Hz, HDR10+"));
                allNewSpecs.add(createAttr(product, "Vi xử lý", "Snapdragon 8 Gen 3 for Galaxy"));
                allNewSpecs.add(createAttr(product, "RAM", "12GB LPDDR5X"));
                allNewSpecs.add(createAttr(product, "Bộ nhớ trong", "256GB UFS 4.0"));
                allNewSpecs.add(createAttr(product, "Camera sau", "50MP chính, 12MP siêu rộng, 10MP tele"));
                allNewSpecs.add(createAttr(product, "Pin", "5,000 mAh, Sạc nhanh 45W"));
            } else if (category.contains("laptop") || name.contains("laptop") || name.contains("macbook")) {
                boolean isMac = name.contains("macbook");
                allNewSpecs.add(createAttr(product, "CPU", isMac ? "Apple M3 Pro chip" : "Intel Core i7-13700H (14 nhân, 20 luồng)"));
                allNewSpecs.add(createAttr(product, "RAM", isMac ? "16GB Unified Memory" : "16GB DDR5 4800MHz"));
                allNewSpecs.add(createAttr(product, "Ổ cứng", "512GB SSD NVMe PCIe Gen 4"));
                allNewSpecs.add(createAttr(product, "VGA", isMac ? "14-core GPU" : "NVIDIA GeForce RTX 4060 8GB GDDR6"));
                allNewSpecs.add(createAttr(product, "Màn hình", isMac ? "14.2-inch Liquid Retina XDR" : "15.6\" QHD (2560 x 1440), 165Hz, 100% sRGB"));
            } else {
                allNewSpecs.add(createAttr(product, "Tình trạng", "Hàng mới chính hãng 100%"));
                allNewSpecs.add(createAttr(product, "Bảo hành", "12 tháng trên toàn quốc"));
                allNewSpecs.add(createAttr(product, "Phụ kiện", "Hộp, cáp sạc, sách hướng dẫn"));
            }
        }

        // 2. Perform a single batch insert for all attributes (EXTREMELY FAST)
        attributeRepository.saveAll(allNewSpecs);

        return "Successfully optimized and updated specifications for " + products.size() + " products.";
    }

    private ProductAttribute createAttr(Product p, String name, String value) {
        return ProductAttribute.builder()
                .product(p)
                .attributeName(name)
                .attributeValue(value)
                .build();
    }
}
