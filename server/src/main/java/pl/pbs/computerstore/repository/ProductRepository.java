package pl.pbs.computerstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.pbs.computerstore.model.*;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryOrderByNameAsc(Category category, Pageable pageable);
    Page<Product> findByCategoryOrderByNameDesc(Category category, Pageable pageable);
    Page<Product> findByCategoryOrderByPriceAsc(Category category, Pageable pageable);
    Page<Product> findByCategoryOrderByPriceDesc(Category category, Pageable pageable);
    Page<Product> findAllByOrderByNameAsc(Pageable pageable);
    Page<Product> findAllByOrderByNameDesc(Pageable pageable);
    Page<Product> findAllByOrderByPriceAsc(Pageable pageable);
    Page<Product> findAllByOrderByPriceDesc(Pageable pageable);
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN p.keywords k WHERE LOWER(p.name) " +
            "LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(k.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Product> findByNameOrByKeywordsName(String search, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Product> findByKeywordsNameContainingIgnoreCase(String name, Pageable pageable);
}
