package com.techstore.service.settings;

import com.techstore.dto.product.ProductRequest;
import com.techstore.entity.brand.Brand;
import com.techstore.entity.category.Category;
import com.techstore.exception.AppException;
import com.techstore.exception.ErrorCode;
import com.techstore.repository.brand.BrandRepository;
import com.techstore.repository.category.CategoryRepository;
import com.techstore.repository.product.ProductRepository;
import com.techstore.service.product.ProductAdminService;
import com.techstore.utils.SlugUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExcelService {
    private final ProductRepository productRepository;
    private final ProductAdminService productAdminService;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public byte[] exportProducts() {
        List<com.techstore.entity.product.Product> products = productRepository.findAll();
        
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Products");

            // Header Row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Tên sản phẩm", "Mô tả", "Danh mục", "Thương hiệu", "SKU", "Giá", "Tồn kho", "Màu sắc", "Kích thước", "Hình ảnh"};
            
            CellStyle headerCellStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerCellStyle.setFont(headerFont);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerCellStyle);
            }

            int rowIdx = 1;
            for (com.techstore.entity.product.Product product : products) {
                // For each variant, create a row (consistent with import logic which handled 1 variant per row)
                if (product.getVariants() != null) {
                    for (com.techstore.entity.product.ProductVariant variant : product.getVariants()) {
                        Row row = sheet.createRow(rowIdx++);
                        row.createCell(0).setCellValue(product.getName());
                        row.createCell(1).setCellValue(product.getDescription());
                        row.createCell(2).setCellValue(product.getCategory() != null ? product.getCategory().getName() : "");
                        row.createCell(3).setCellValue(product.getBrand() != null ? product.getBrand().getName() : "");
                        row.createCell(4).setCellValue(variant.getSku());
                        row.createCell(5).setCellValue(variant.getPrice() != null ? variant.getPrice().doubleValue() : 0);
                        row.createCell(6).setCellValue(variant.getStockQuantity());
                        row.createCell(7).setCellValue(variant.getColor() != null ? variant.getColor() : "");
                        row.createCell(8).setCellValue(variant.getSize() != null ? variant.getSize() : "");
                        
                        // Export image URLs as comma-separated string
                        if (product.getImages() != null && !product.getImages().isEmpty()) {
                            String images = product.getImages().stream()
                                    .map(com.techstore.entity.product.ProductImage::getImageUrl)
                                    .reduce((a, b) -> a + "," + b)
                                    .orElse("");
                            row.createCell(9).setCellValue(images);
                        }
                    }
                }
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            log.error("Error exporting products to Excel", e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    public void importProducts(MultipartFile file) {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                try {
                    ProductRequest request = mapRowToProductRequest(row);
                    if (request != null) {
                        productAdminService.createProduct(request);
                    }
                } catch (Exception e) {
                    log.error("Error importing row {}: {}", i, e.getMessage());
                    // Continue with next row
                }
            }
        } catch (IOException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    private ProductRequest mapRowToProductRequest(Row row) {
        String name = getCellValueAsString(row.getCell(0));
        if (name == null || name.isEmpty()) return null;

        String description = getCellValueAsString(row.getCell(1));
        String categoryName = getCellValueAsString(row.getCell(2));
        String brandName = getCellValueAsString(row.getCell(3));
        
        // Resolve Category
        Category category = categoryRepository.findByNameIgnoreCase(categoryName)
                .orElseGet(() -> {
                    String slug = SlugUtils.makeSlug(categoryName);
                    return categoryRepository.findBySlug(slug)
                            .orElseGet(() -> categoryRepository.save(Category.builder()
                                    .name(categoryName)
                                    .slug(slug)
                                    .build()));
                });

        // Resolve Brand
        Brand brand = brandRepository.findByNameIgnoreCase(brandName)
                .orElseGet(() -> {
                    String slug = SlugUtils.makeSlug(brandName);
                    return brandRepository.findBySlug(slug)
                            .orElseGet(() -> brandRepository.save(Brand.builder()
                                    .name(brandName)
                                    .slug(slug)
                                    .build()));
                });

        // Variant info
        String sku = getCellValueAsString(row.getCell(4));
        BigDecimal price = getCellValueAsBigDecimal(row.getCell(5));
        int stock = (int) getCellValueAsDouble(row.getCell(6));
        String color = getCellValueAsString(row.getCell(7));
        String size = getCellValueAsString(row.getCell(8));
        String imageUrlsStr = getCellValueAsString(row.getCell(9));

        List<String> imageUrls = new ArrayList<>();
        if (imageUrlsStr != null && !imageUrlsStr.isEmpty()) {
            for (String url : imageUrlsStr.split(",")) {
                imageUrls.add(url.trim());
            }
        }

        ProductRequest.VariantRequest variant = new ProductRequest.VariantRequest();
        variant.setSku(sku != null ? sku : SlugUtils.makeSlug(name) + "-" + System.currentTimeMillis());
        variant.setName(name);
        variant.setPrice(price != null ? price : BigDecimal.ZERO);
        variant.setStockQuantity(stock);
        variant.setColor(color);
        variant.setSize(size);
        variant.setSortOrder(0);

        List<ProductRequest.VariantRequest> variants = new ArrayList<>();
        variants.add(variant);

        return ProductRequest.builder()
                .name(name)
                .description(description)
                .categoryId(category.getId())
                .brandId(brand.getId())
                .variants(variants)
                .imageUrls(imageUrls)
                .build();
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) return null;
        if (cell.getCellType() == CellType.NUMERIC) {
            return String.valueOf((long) cell.getNumericCellValue());
        }
        return cell.getStringCellValue();
    }

    private double getCellValueAsDouble(Cell cell) {
        if (cell == null) return 0;
        if (cell.getCellType() == CellType.NUMERIC) return cell.getNumericCellValue();
        try {
            return Double.parseDouble(cell.getStringCellValue());
        } catch (Exception e) {
            return 0;
        }
    }

    private BigDecimal getCellValueAsBigDecimal(Cell cell) {
        return BigDecimal.valueOf(getCellValueAsDouble(cell));
    }
}
