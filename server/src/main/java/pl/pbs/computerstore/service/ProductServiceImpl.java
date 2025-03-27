package pl.pbs.computerstore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.model.Product;
import pl.pbs.computerstore.repository.ProductRepository;

import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService{
    private ProductRepository productRepository;
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    @Override
    public Optional<Product> getProduct(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Product setProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public Page<Product> getProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public Page<Product> getProductsByCategoryOrderByNameAsc(Category c, Pageable pageable) {
        return productRepository.findByCategoryOrderByNameAsc(c,pageable);
    }


    @Override
    public Page<Product> getProductsByCategoryOrderByNameDesc(Category c, Pageable pageable) {
        return productRepository.findByCategoryOrderByNameDesc(c, pageable);
    }

    @Override
    public Page<Product> getProductsByCategoryOrderByPriceDesc(Category c, Pageable pageable) {
        return productRepository.findByCategoryOrderByPriceDesc(c, pageable);
    }

    @Override
    public Page<Product> getProductsByCategoryOrderByPriceAsc(Category c, Pageable pageable) {
        return productRepository.findByCategoryOrderByPriceAsc(c, pageable);
    }

    @Override
    public Page<Product> searchByName(String name, Pageable pageable) {
        return null;
    }

    @Override
    public Page<Product> getProductsOrderByNameDesc(Pageable pageable) {
        return productRepository.findAllByOrderByNameDesc(pageable);
    }

    @Override
    public Page<Product> getProductsOrderByNameAsc(Pageable pageable) {
        return productRepository.findAllByOrderByNameAsc(pageable);
    }

    @Override
    public Page<Product> getProductsOrderByPriceDesc(Pageable pageable) {
        return productRepository.findAllByOrderByPriceDesc(pageable);
    }

    @Override
    public Page<Product> getProductsOrderByPriceAsc(Pageable pageable) {
        return productRepository.findAllByOrderByPriceAsc(pageable);
    }

    @Override
    public Page<Product> getProductsBySearchedName(String name, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    @Override
    public Page<Product> getProductsByKeywordName(String name, Pageable pageable) {
        return productRepository.findByKeywordsNameContainingIgnoreCase(name, pageable);
    }

    @Override
    public Page<Product> getProductsByNameAndKeywordName(String text, Pageable pageable) {
        return productRepository.findByNameOrByKeywordsName(text, pageable);
    }

}
