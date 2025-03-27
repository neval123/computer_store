package pl.pbs.computerstore.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.repository.CategoryRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
public class CategoryServiceTest {
    @MockBean
    private CategoryRepository mockCategoryRepository;
    @Autowired
    private CategoryService categoryService;
    @Test
    public void setCategoryTest() throws Exception {
        Category category = new Category();
        category.setName("Klawiatury");
        when(mockCategoryRepository.save(any(Category.class))).thenReturn(category);
        Category categorySaved = categoryService.setCategory(category);
        assertEquals(category,categorySaved);
    }
    @Test
    public void getCategoryTest() throws Exception {
        Category category = new Category();
        category.setName("Klawiatury");
        category.setCategoryId(1L);
        when(mockCategoryRepository.findById(any(Long.class))).thenReturn(Optional.of(category));
        Optional<Category> categorySaved = categoryService.getCategory(1L);
        assertEquals(category.getName(),categorySaved.get().getName());
    }
    @Test
    public void deleteCategoryTest() throws Exception{
        Long categoryId = 1L;
        categoryService.deleteCategory(categoryId);
        verify(mockCategoryRepository).deleteById(categoryId);
    }

}
