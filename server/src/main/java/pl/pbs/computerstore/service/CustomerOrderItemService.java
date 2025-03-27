package pl.pbs.computerstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.pbs.computerstore.model.CustomerOrder;
import pl.pbs.computerstore.model.CustomerOrderItem;
import pl.pbs.computerstore.model.Product;

import java.util.Optional;

public interface CustomerOrderItemService {
        Optional<CustomerOrderItem> getCustomerOrderItem(Long id);
        CustomerOrderItem setCustomerOrderItem(CustomerOrderItem customerOrderItem);
        void deleteCustomerOrderItem(Long id);
        Page<CustomerOrderItem> getCustomerOrderItems(Pageable pageable);
        Page<CustomerOrderItem> getCustomerOrderItemsByProduct(Product product, Pageable pageable);
        Page<CustomerOrderItem> getCustomerOrderItemsByOrder(CustomerOrder customerOrder, Pageable pageable);
        Optional<CustomerOrderItem> getCustomerOrderItemByCustomerOrderAndProduct(CustomerOrder customerOrder, Product product);
}
