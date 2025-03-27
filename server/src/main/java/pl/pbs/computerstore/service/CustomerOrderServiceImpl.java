package pl.pbs.computerstore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.pbs.computerstore.model.CustomerOrder;
import pl.pbs.computerstore.model.Status;
import pl.pbs.computerstore.model.User;
import pl.pbs.computerstore.repository.CustomerOrderRepository;
import pl.pbs.computerstore.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerOrderServiceImpl implements CustomerOrderService {
    private CustomerOrderRepository customerOrderRepository;
    private UserRepository userRepository;
    public CustomerOrderServiceImpl(CustomerOrderRepository customerOrderRepository, UserRepository userRepository) {
        this.customerOrderRepository = customerOrderRepository;
        this.userRepository = userRepository;
    }
    @Override
    public Optional<CustomerOrder> getCustomerOrder(Long id) {
        return customerOrderRepository.findById(id);
    }

    @Override
    public CustomerOrder setCustomerOrder(CustomerOrder customerOrder) {
        return customerOrderRepository.save(customerOrder);
    }

    @Override
    public void deleteCustomerOrder(Long id) {
        customerOrderRepository.deleteById(id);
    }

    @Override
    public Page<CustomerOrder> getCustomerOrders(Pageable pageable) {
        return customerOrderRepository.findAll(pageable);
    }

    @Override
    public Page<CustomerOrder> getCustomerOrdersByUser(User user, Pageable pageable) {
        return customerOrderRepository.findByUser(user, pageable);
    }

    @Override
    public Page<CustomerOrder> getActiveCustomerOrders(long id, Pageable pageable){
        User s = userRepository.findById(id).orElseThrow();
        List<Status> statuses = List.of(Status.PAID, Status.SENT, Status.REJECTED);
        return customerOrderRepository.findByUserAndStatusIn(s, statuses,pageable);
    }
    @Override
    public Page<CustomerOrder> getAllCustomerOrders(Pageable pageable){
        List<Status> statuses = List.of(Status.PAID, Status.SENT, Status.REJECTED, Status.COLLECTED);
        return customerOrderRepository.findByStatusIn(statuses,pageable);
    }
    @Override
    public CustomerOrder getCustomerOrderToCollectByUserId(long id) {
        return customerOrderRepository.getCollectedCustomerOrderByUser(id);
    }

    @Override
    public Page<CustomerOrder> searchByName(String name, Pageable pageable) {
        return null;
    }
}
