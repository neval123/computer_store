package pl.pbs.computerstore.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import pl.pbs.computerstore.model.CustomerOrder;
import pl.pbs.computerstore.model.CustomerOrderItem;
import pl.pbs.computerstore.model.Status;
import pl.pbs.computerstore.repository.CustomerOrderItemRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
public class CustomerOrderItemServiceTest {
    @MockBean
    private CustomerOrderItemRepository mockCustomerOrderItemRepository;
    @Autowired
    private CustomerOrderItemService customerOrderItemService;
    @Test
    public void setCustomerOrderItemTest() throws Exception {
        CustomerOrderItem customerOrderItem = new CustomerOrderItem();
        customerOrderItem.setItemId(1L);
        customerOrderItem.setCustomerOrder(new CustomerOrder());
        when(mockCustomerOrderItemRepository.save(any(CustomerOrderItem.class))).thenReturn(customerOrderItem);
        CustomerOrderItem customerOrderItemSaved = customerOrderItemService.setCustomerOrderItem(customerOrderItem);
        assertEquals(customerOrderItem.getItemId(),customerOrderItemSaved.getItemId());
    }
    @Test
    public void getCustomerOrderItemTest() throws Exception {
        CustomerOrderItem customerOrderItem = new CustomerOrderItem();
        customerOrderItem.setItemId(1L);
        customerOrderItem.setCustomerOrder(new CustomerOrder());
        when(mockCustomerOrderItemRepository.findById(any(Long.class))).thenReturn(Optional.of(customerOrderItem));
        Optional<CustomerOrderItem> customerOrderItemSaved = customerOrderItemService.getCustomerOrderItem(1L);
        assertEquals(customerOrderItem.getCustomerOrder(),customerOrderItemSaved.get().getCustomerOrder());
    }
    @Test
    public void deleteCustomerOrderItemTest() throws Exception{
        Long customerOrderItemId = 1L;
        customerOrderItemService.deleteCustomerOrderItem(customerOrderItemId);
        verify(mockCustomerOrderItemRepository).deleteById(customerOrderItemId);
    }
}
