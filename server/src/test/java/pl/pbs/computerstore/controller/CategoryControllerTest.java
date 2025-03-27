package pl.pbs.computerstore.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.test.web.servlet.MvcResult;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.service.CategoryService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class CategoryControllerTest {
    private final String apiPath = "/api/category";
    @MockBean
    private CategoryService mockCategoryService;
    @Autowired
    private MockMvc mockMvc;
    @Test
    public void getCategories() throws Exception {
        Category category = new Category(1, "Procesory");
        Category category2 = new Category(2, "Karty graficzne");
        Page<Category> page = new PageImpl<>(List.of(category,category2));
        when(mockCategoryService.getCategories(any(Pageable.class))).thenReturn(page);
        mockMvc.perform(get(apiPath).contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[*]").exists())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].categoryId").value(category.getCategoryId()))
                .andExpect(jsonPath("$.content[0].name").value(category.getName()))
                .andExpect(jsonPath("$.content[1].categoryId").value(category2.getCategoryId()))
                .andExpect(jsonPath("$.content[1].name").value(category2.getName()));
        verify(mockCategoryService, times(1)).getCategories(any(Pageable.class));
        verifyNoMoreInteractions(mockCategoryService);
    }
    @Test
    public void getCategory() throws Exception{
        Category category = new Category(3, "Klawiatury");
        mockCategoryService.setCategory(category);
        when(mockCategoryService.getCategory(3L)).thenReturn(Optional.of(category));

        mockMvc.perform(get(apiPath+"/3").contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn();
    }
    @Test
    public void loginAsAdminAndCreateCategory() throws Exception{
        MvcResult result = mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"testtest@gmail.com\", \"password\":\"testtest\"}"))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn();
        String responseString = result.getResponse().getContentAsString();
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> responseMap = objectMapper.readValue(responseString,Map.class);
        String token = responseMap.get("token");

        mockMvc.perform(post(apiPath)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Laptopy\"}")
                        .header("Authorization","Bearer "+token))
                .andDo(print())
                .andExpect(status().isCreated())
                .andReturn();
    }
}
