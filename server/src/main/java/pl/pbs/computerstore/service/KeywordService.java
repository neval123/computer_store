package pl.pbs.computerstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.model.Keyword;
import pl.pbs.computerstore.model.Product;

import java.util.Optional;

public interface KeywordService {
    Optional<Keyword> getKeyword(Long id);
    Keyword setKeyword(Keyword keyword);
    void deleteKeyword(Long id);
    Page<Keyword> getKeywords(Pageable pageable);
    Page<Keyword> getKeywordsByCategory(Category category,Pageable pageable);
    Page<Keyword> getKeywordsByProduct(Product product, Pageable pageable);
    Page<Keyword> getKeywordsByNameAsc(Pageable pageable);
}
