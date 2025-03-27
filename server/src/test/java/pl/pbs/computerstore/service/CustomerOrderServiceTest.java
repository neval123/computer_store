package pl.pbs.computerstore.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import pl.pbs.computerstore.model.CustomerOrder;
import pl.pbs.computerstore.model.Status;
import pl.pbs.computerstore.repository.CustomerOrderRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
public class CustomerOrderServiceTest {
    @MockBean
    private CustomerOrderRepository mockCustomerOrderRepository;
    @Autowired
    private CustomerOrderService customerOrderService;
    @Test
    public void setOrderTest() throws Exception {
        CustomerOrder customerOrder = new CustomerOrder();
        customerOrder.setOrderId(1L);
        customerOrder.setStatus(Status.PAID);
        when(mockCustomerOrderRepository.save(any(CustomerOrder.class))).thenReturn(customerOrder);
        CustomerOrder customerOrderSaved = customerOrderService.setCustomerOrder(customerOrder);
        assertEquals(customerOrder.getOrderId(),customerOrderSaved.getOrderId());
    }
    @Test
    public void getOrderTest() throws Exception {
        CustomerOrder customerOrder = new CustomerOrder();
        customerOrder.setOrderId(1L);
        customerOrder.setStatus(Status.PAID);
        when(mockCustomerOrderRepository.findById(any(Long.class))).thenReturn(Optional.of(customerOrder));
        Optional<CustomerOrder> customerOrderSaved = customerOrderService.getCustomerOrder(1L);
        assertEquals(customerOrder.getStatus(),customerOrderSaved.get().getStatus());
    }
    @Test
    public void deleteOrderTest() throws Exception{
        Long customerOrderId = 1L;
        customerOrderService.deleteCustomerOrder(customerOrderId);
        verify(mockCustomerOrderRepository).deleteById(customerOrderId);
    }
}
