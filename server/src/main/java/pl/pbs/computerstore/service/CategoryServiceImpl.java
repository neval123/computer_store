package pl.pbs.computerstore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.model.Keyword;
import pl.pbs.computerstore.model.Product;
import pl.pbs.computerstore.repository.CategoryRepository;
import pl.pbs.computerstore.repository.ProductRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService{
    private CategoryRepository categoryRepository;
    private ProductRepository productRepository;
    public CategoryServiceImpl(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }
    @Override
    public Optional<Category> getCategory(Long id) {
        return categoryRepository.findById(id);
    }
    @Override
    public Category setCategory(Category category) {
        return categoryRepository.save(category);
    }
    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
    @Override
    public Page<Category> getCategoriesByNameAsc(Pageable pageable) {
        return categoryRepository.findAllByOrderByNameAsc(pageable);
    }
    @Override
    public Category getCategoryByProduct(Product product) {
        return categoryRepository.findByProductsContaining(product);
    }
    @Override
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByNameContainingIgnoreCase(name);
    }
    // pozostałe metody
    @Override
    public boolean canRemoveKeywords(Long categoryId, List<Keyword> keywords) {
        Category category = categoryRepository.findById(categoryId).orElseThrow();
        List<Product> products = productRepository.findByCategoryOrderByNameAsc(category,null).toList();
        for (Product product : products) {
            for (Keyword keywordToRemove : keywords) {
                for (Keyword productKeyword : product.getKeywords()) {
                    if (productKeyword.getKeywordId()==keywordToRemove.getKeywordId()) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    @Override
    public Page<Category> getCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }
    @Override
    public Page<Category> getCategoriesByKeyword(Keyword keyword, Pageable pageable) {
        return categoryRepository.findByKeywordsContaining(keyword,pageable);
    }

}
