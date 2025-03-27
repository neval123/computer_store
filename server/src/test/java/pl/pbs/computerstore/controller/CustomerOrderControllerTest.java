package pl.pbs.computerstore.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import pl.pbs.computerstore.model.*;
import pl.pbs.computerstore.service.CustomerOrderService;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class CustomerOrderControllerTest {
    private final String apiPath = "/api/order";
    @MockBean
    private CustomerOrderService mockCustomerOrderService;
    @Autowired
    private MockMvc mockMvc;
    private CustomerOrder order1;
    private CustomerOrder order2;
    @BeforeEach
    public void setOrders() throws Exception{
        order1 = new CustomerOrder(
                1,
                250.00,
                Timestamp.valueOf("2023-11-29 10:00:00"),
                Timestamp.valueOf("2023-11-30 10:00:00"),
                Status.REJECTED,
                new User(1L,"jan","mal","test@pl","123",Role.USER),
                Arrays.asList(new CustomerOrderItem())
        );
        order2 = new CustomerOrder(
                2,
                333.00,
                Timestamp.valueOf("2023-11-29 11:00:00"),
                Timestamp.valueOf("2023-11-30 11:00:00"),
                Status.PAID,
                new User(2L,"jan","mal","test@pl","123", Role.USER),
                Arrays.asList(new CustomerOrderItem())
        );
        mockCustomerOrderService.setCustomerOrder(order1);
        mockCustomerOrderService.setCustomerOrder(order2);
        Page<CustomerOrder> page = new PageImpl<>(List.of(order1, order2));

        when(mockCustomerOrderService.getCustomerOrders(any(Pageable.class))).thenReturn(page);

    }
    @Test
    public void getOrders() throws Exception {
        Pageable pageable = PageRequest.of(0, 10);
        mockMvc.perform(get(apiPath).contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[*]").exists())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].orderId").value(order1.getOrderId()))
                .andExpect(jsonPath("$.content[1].orderId").value(order2.getOrderId()));

        verify(mockCustomerOrderService, times(1)).getCustomerOrders(pageable);
        verifyNoMoreInteractions(mockCustomerOrderService);

    }
}
