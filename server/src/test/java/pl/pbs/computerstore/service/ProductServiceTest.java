package pl.pbs.computerstore.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.model.Product;
import pl.pbs.computerstore.repository.ProductRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
public class ProductServiceTest {
    @MockBean
    private ProductRepository mockProductRepository;
    @Autowired
    private ProductService productService;
    @Test
    public void setProductTest() throws Exception {
        Product product = new Product();
        product.setName("Intel Core i7 14700KF");
        when(mockProductRepository.save(any(Product.class))).thenReturn(product);
        Product productSaved = productService.setProduct(product);
        assertEquals(product,productSaved);
    }
    @Test
    public void getProductTest() throws Exception {
        Product product = new Product();
        product.setName("Intel Core i7 14700KF");
        product.setProductId(1L);
        when(mockProductRepository.findById(any(Long.class))).thenReturn(Optional.of(product));
        Optional<Product> productSaved = productService.getProduct(1L);
        assertEquals(product.getName(),productSaved.get().getName());
    }
    @Test
    public void deleteProductTest() throws Exception{
        Long productId = 1L;
        productService.deleteProduct(productId);
        verify(mockProductRepository).deleteById(productId);
    }
}
