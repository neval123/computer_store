package pl.pbs.computerstore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.pbs.computerstore.model.CustomerOrder;
import pl.pbs.computerstore.model.CustomerOrderItem;
import pl.pbs.computerstore.model.Product;
import pl.pbs.computerstore.repository.CustomerOrderItemRepository;
import pl.pbs.computerstore.repository.CustomerOrderRepository;
import pl.pbs.computerstore.repository.UserRepository;

import java.util.Optional;

@Service
public class CustomerOrderItemServiceImpl implements CustomerOrderItemService {
    private CustomerOrderItemRepository customerOrderItemRepository;
    private CustomerOrderRepository customerOrderRepository;
    private UserRepository userRepository;
    public CustomerOrderItemServiceImpl(CustomerOrderItemRepository customerOrderItemRepository, CustomerOrderRepository customerOrderRepository, UserRepository userRepository) {
        this.customerOrderItemRepository = customerOrderItemRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.userRepository = userRepository;
    }
    @Override
    public Optional<CustomerOrderItem> getCustomerOrderItem(Long id) {
        return customerOrderItemRepository.findById(id);
    }

    @Override
    public CustomerOrderItem setCustomerOrderItem(CustomerOrderItem customerOrderItem) {
        return customerOrderItemRepository.save(customerOrderItem);
    }

    @Override
    public void deleteCustomerOrderItem(Long id) {
        customerOrderItemRepository.deleteById(id);
    }

    @Override
    public Page<CustomerOrderItem> getCustomerOrderItems(Pageable pageable) {
        return customerOrderItemRepository.findAll(pageable);
    }

    @Override
    public Page<CustomerOrderItem> getCustomerOrderItemsByProduct(Product product, Pageable pageable) {
        return customerOrderItemRepository.findByProduct(product,pageable);
    }

    @Override
    public Page<CustomerOrderItem> getCustomerOrderItemsByOrder(CustomerOrder customerOrder, Pageable pageable) {
        return customerOrderItemRepository.findByCustomerOrder(customerOrder, pageable);
    }

    @Override
    public Optional<CustomerOrderItem> getCustomerOrderItemByCustomerOrderAndProduct(CustomerOrder customerOrder, Product product) {
        return customerOrderItemRepository.findCustomerOrderItemByCustomerOrderAndProduct(customerOrder, product);
    }
}
