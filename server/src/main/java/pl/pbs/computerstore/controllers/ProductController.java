package pl.pbs.computerstore.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pl.pbs.computerstore.model.*;
import pl.pbs.computerstore.service.CategoryService;
import pl.pbs.computerstore.service.KeywordService;
import pl.pbs.computerstore.service.ProductService;

import java.io.Console;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    private ProductService productService;
    private CategoryService categoryService;
    private KeywordService keywordService;

    public ProductController(ProductService productService, CategoryService categoryService, KeywordService keywordService) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.keywordService = keywordService;
    }
    @Value("${app.image.upload.dir}")
    private String uploadDir;


    @GetMapping("/{productId}")
    ResponseEntity<Product> getProduct(@PathVariable Long productId) {
        return ResponseEntity.of(productService.getProduct(productId));
    }

    @PostMapping
    ResponseEntity<Map<String, Long>> createProduct(@Valid @RequestBody Product product,
                                       @RequestParam long categoryId) {
        Category c = categoryService.getCategory(categoryId).orElseThrow();
        product.setCategory(c);
        Product createdProduct = productService.setProduct(product);
        Map<String, Long> responseBody = Collections.singletonMap("productId", createdProduct.getProductId());
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{productId}").buildAndExpand(createdProduct.getProductId()).toUri();
        return ResponseEntity.created(location).body(responseBody);
    }
    @PostMapping("/image/{productId}")
    public ResponseEntity<Void> saveImage(@PathVariable Long productId,
                                          @RequestParam("image") MultipartFile file) {
      //  System.out.println("Saving image");
        //System.out.println(Paths.get("").toAbsolutePath().toString());
        try {
            try (InputStream inputStream = file.getInputStream()) {
                Path filePath = Paths.get(uploadDir).resolve(file.getOriginalFilename());
                System.out.println(filePath);
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            } catch (Exception e) {
                return ResponseEntity.internalServerError().build();
            }
            Optional<Product> p = productService.getProduct(productId);
            if (p.isPresent()) {
                p.get().setImage("\\images\\"+file.getOriginalFilename());
                productService.setProduct(p.get());
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Void> updateProduct(@Valid @RequestBody Product product,
                                              @PathVariable Long productId, @RequestParam Long categoryId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if (isAdmin) {
            Category category = categoryService.getCategory(categoryId).orElseThrow();
            product.setCategory(category);
            productService.setProduct(product);
            return new ResponseEntity<Void>(HttpStatus.OK);

        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        return productService.getProduct(productId).map(product -> {
            productService.deleteProduct(productId);
            return new ResponseEntity<Void>(HttpStatus.OK);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    Page<Product> getProducts(@RequestParam(name = "page", defaultValue = "0") int page,
                              @RequestParam(name = "size", defaultValue = "12") int size,
                              @RequestParam(name = "type", defaultValue = "") String type) {
        Pageable pageable = PageRequest.of(page, size);
        switch (type) {
            case "alpha":
                return productService.getProductsOrderByNameAsc(pageable);
            case "desc_alpha":
                return productService.getProductsOrderByNameDesc(pageable);
            case "price_low":
                return productService.getProductsOrderByPriceAsc(pageable);
            case "price_high":
                return productService.getProductsOrderByPriceDesc(pageable);
            default:
                return productService.getProducts(pageable);
        }
    }

    @GetMapping("/bycategory/{categoryId}")
    Page<Product> getProductsByCategory(@PathVariable Long categoryId, @RequestParam(name = "page", defaultValue = "0") int page,
                                        @RequestParam(name = "size", defaultValue = "12") int size,
                                        @RequestParam(name = "type", defaultValue = "") String sortType) {
        Pageable pageable = PageRequest.of(page, size);
        Category c = categoryService.getCategory(categoryId).orElseThrow();
        switch (sortType) {
            case "alpha":
                return productService.getProductsByCategoryOrderByNameAsc(c, pageable);
            case "desc_alpha":
                return productService.getProductsByCategoryOrderByNameDesc(c, pageable);
            case "price_low":
                return productService.getProductsByCategoryOrderByPriceAsc(c, pageable);
            case "price_high":
                return productService.getProductsByCategoryOrderByPriceDesc(c, pageable);
            default:
                return productService.getProductsByCategoryOrderByNameAsc(c, pageable);
        }
    }

    @GetMapping("/bysearch")
    Page<Product> getProductsByNameAndKeywordName(@RequestParam(name = "name") String name, @RequestParam(name = "page", defaultValue = "0") int page,
                                                  @RequestParam(name = "size", defaultValue = "4") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productService.getProductsByNameAndKeywordName(name, pageable);
    }

    @GetMapping("/bykeyword")
    Page<Product> getProductsByKeywordName(@RequestParam(name = "name") String name, @RequestParam(name = "page", defaultValue = "0") int page,
                                           @RequestParam(name = "size", defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productService.getProductsByKeywordName(name, pageable);
    }
}
