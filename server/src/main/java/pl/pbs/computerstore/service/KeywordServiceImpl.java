package pl.pbs.computerstore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.model.Keyword;
import pl.pbs.computerstore.model.Product;
import pl.pbs.computerstore.repository.KeywordRepository;

import java.util.Optional;

@Service
public class KeywordServiceImpl implements KeywordService{
    private KeywordRepository keywordRepository;
    public KeywordServiceImpl(KeywordRepository keywordRepository) {
        this.keywordRepository = keywordRepository;
    }
    @Override
    public Optional<Keyword> getKeyword(Long id) {
        return keywordRepository.findById(id);
    }

    @Override
    public Keyword setKeyword(Keyword keyword) {
        return keywordRepository.save(keyword);
    }

    @Override
    public void deleteKeyword(Long id) {
        keywordRepository.deleteById(id);
    }

    @Override
    public Page<Keyword> getKeywords(Pageable pageable) {
        return keywordRepository.findAll(pageable);
    }
    @Override
    public Page<Keyword> getKeywordsByCategory(Category category, Pageable pageable) {
        return keywordRepository.findByCategoriesContaining(category, pageable);
    }

    @Override
    public Page<Keyword> getKeywordsByProduct(Product product, Pageable pageable) {
        return keywordRepository.findByProductsContaining(product, pageable);
    }

    @Override
    public Page<Keyword> getKeywordsByNameAsc(Pageable pageable) {
        return keywordRepository.findAllByOrderByNameAsc(pageable);
    }
}
