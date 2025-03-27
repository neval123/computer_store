package pl.pbs.computerstore.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import pl.pbs.computerstore.service.CategoryService;
import pl.pbs.computerstore.service.UserService;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {
    private final String loginPath = "/login";
    private final String registerPath = "/register";

    @Autowired
    private MockMvc mockMvc;
    @Test
    public void register() throws Exception {
        MvcResult result = mockMvc.perform(post(registerPath)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"janmalinowski2001@gmail.com\", \"password\":\"testtest\"," +
                                "\"name\":\"Jan\",\"lastName\":\"Malinowski\",\"role\":\"ADMIN\"}"))
                .andExpect(status().isOk())
                .andReturn();
    }
    @Test
    public void loginAndGetToken() throws Exception {
        MvcResult result = mockMvc.perform(post(loginPath)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"testtest@gmail.com\", \"password\":\"testtest\"}"))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn();
        String token = result.getResponse().toString();

    }

}
