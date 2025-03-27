package pl.pbs.computerstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.model.Keyword;
import pl.pbs.computerstore.model.Product;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    Optional<Category> getCategory(Long id);
    Category setCategory(Category category);
    void deleteCategory(Long id);
    Page<Category> getCategories(Pageable pageable);
    Page<Category> getCategoriesByKeyword(Keyword keyword, Pageable pageable);
    Page<Category> getCategoriesByNameAsc(Pageable pageable);
    Category getCategoryByProduct(Product product);
    Optional<Category> getCategoryByName(String name);
    boolean canRemoveKeywords(Long categoryId, List<Keyword> keywords);
}
