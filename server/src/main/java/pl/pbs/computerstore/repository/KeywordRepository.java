package pl.pbs.computerstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.model.Keyword;
import pl.pbs.computerstore.model.Product;

@Repository
public interface KeywordRepository extends JpaRepository<Keyword, Long> {
    Page<Keyword> findAllByOrderByNameAsc(Pageable pageable);
    Page<Keyword> findByCategoriesContaining(Category category, Pageable pageable);
    Page<Keyword> findByProductsContaining(Product product, Pageable pageable);

}

