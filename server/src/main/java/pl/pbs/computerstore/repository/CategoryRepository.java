package pl.pbs.computerstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.model.Keyword;
import pl.pbs.computerstore.model.Product;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
     Page<Category> findAllByOrderByNameAsc(Pageable pageable);
     Page<Category> findByKeywordsContaining(Keyword keyword, Pageable pageable);
     Category findByProductsContaining(Product product);
     Optional<Category> findByNameContainingIgnoreCase(String name);
}
