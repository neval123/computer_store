package pl.pbs.computerstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.model.Product;

import java.util.Optional;

public interface ProductService {
    Optional<Product> getProduct(Long id);
    Product setProduct(Product product);
    void deleteProduct(Long id);
    Page<Product> getProducts(Pageable pageable);
    Page<Product> getProductsByCategoryOrderByNameAsc(Category c, Pageable pageable);
    Page<Product> getProductsByCategoryOrderByNameDesc(Category c, Pageable pageable);
    Page<Product> getProductsByCategoryOrderByPriceDesc(Category c, Pageable pageable);
    Page<Product> getProductsByCategoryOrderByPriceAsc(Category c, Pageable pageable);
    Page<Product> searchByName(String name, Pageable pageable);
    Page<Product> getProductsOrderByNameDesc(Pageable pageable);
    Page<Product> getProductsOrderByNameAsc(Pageable pageable);
    Page<Product> getProductsOrderByPriceDesc(Pageable pageable);
    Page<Product> getProductsOrderByPriceAsc(Pageable pageable);
    Page<Product> getProductsBySearchedName(String name,Pageable pageable);
    Page<Product> getProductsByKeywordName(String name,Pageable pageable);
    Page<Product> getProductsByNameAndKeywordName(String text, Pageable pageable);
}
