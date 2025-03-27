package pl.pbs.computerstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.pbs.computerstore.model.CustomerOrder;
import pl.pbs.computerstore.model.User;

import java.util.Optional;

public interface CustomerOrderService {
    Optional<CustomerOrder> getCustomerOrder(Long id);
    CustomerOrder setCustomerOrder(CustomerOrder customerOrder);
    void deleteCustomerOrder(Long id);
    Page<CustomerOrder> getCustomerOrders(Pageable pageable);
    Page<CustomerOrder> getCustomerOrdersByUser(User user, Pageable pageable);
    Page<CustomerOrder> getActiveCustomerOrders(long id, Pageable pageable);
    Page<CustomerOrder> getAllCustomerOrders(Pageable pageable);
    CustomerOrder getCustomerOrderToCollectByUserId(long id);
    Page<CustomerOrder> searchByName(String name, Pageable pageable);

}
