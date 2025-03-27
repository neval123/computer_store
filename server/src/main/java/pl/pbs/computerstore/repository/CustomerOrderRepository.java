package pl.pbs.computerstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.pbs.computerstore.model.CustomerOrder;
import pl.pbs.computerstore.model.Status;
import pl.pbs.computerstore.model.User;

import java.util.List;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder,Long> {
    Page<CustomerOrder> findByUser(User user, Pageable pageable);
    Page<CustomerOrder> findByUserAndStatusIn(User user, List<Status> statuses, Pageable pageable);
    Page<CustomerOrder> findByStatusIn(List<Status> statuses, Pageable pageable);
    @Query("SELECT o FROM CustomerOrder o WHERE o.user.userId = ?1 AND o.status = 'COLLECTED'")
    CustomerOrder getCollectedCustomerOrderByUser(long id);
}
