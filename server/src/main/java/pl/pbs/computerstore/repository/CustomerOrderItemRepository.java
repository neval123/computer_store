package pl.pbs.computerstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pbs.computerstore.model.CustomerOrder;
import pl.pbs.computerstore.model.CustomerOrderItem;
import pl.pbs.computerstore.model.Product;

import java.util.Optional;

@Repository
public interface CustomerOrderItemRepository extends JpaRepository<CustomerOrderItem,Long> {
    Page<CustomerOrderItem> findByProduct(Product product, Pageable pageable);
    Page<CustomerOrderItem> findByCustomerOrder(CustomerOrder order, Pageable pageable);
    Optional<CustomerOrderItem> findCustomerOrderItemByCustomerOrderAndProduct(CustomerOrder order, Product product);
}
