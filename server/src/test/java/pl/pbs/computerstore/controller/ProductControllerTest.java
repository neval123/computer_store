package pl.pbs.computerstore.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.model.CustomerOrderItem;
import pl.pbs.computerstore.model.Product;
import pl.pbs.computerstore.service.ProductService;

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
public class ProductControllerTest {
    private final String apiPath = "/api/product";
    @MockBean
    private ProductService mockProductService;
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void getProducts() throws Exception {
        Product p = new Product(1, "Intel Core i7","Procesor",null,150,new Category(), Arrays.asList(new CustomerOrderItem()));
        Product p2 = new Product(2, "Intel Core i5", "Procesor",null,100,new Category(), Arrays.asList(new CustomerOrderItem()));
        Page<Product> page = new PageImpl<>(List.of(p,p2));
        when(mockProductService.getProducts(any(Pageable.class))).thenReturn(page);
        mockMvc.perform(get(apiPath).contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[*]").exists())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].productId").value(p.getProductId()))
                .andExpect(jsonPath("$.content[0].name").value(p.getName()))
                .andExpect(jsonPath("$.content[1].productId").value(p2.getProductId()))
                .andExpect(jsonPath("$.content[1].name").value(p2.getName()));
        verify(mockProductService, times(1)).getProducts(any(Pageable.class));
        verifyNoMoreInteractions(mockProductService);
    }
}
