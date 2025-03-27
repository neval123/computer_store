package pl.pbs.computerstore.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import pl.pbs.computerstore.model.Category;
import pl.pbs.computerstore.model.User;
import pl.pbs.computerstore.repository.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
public class UserServiceTest {
    @MockBean
    private UserRepository mockUserRepository;
    @Autowired
    private UserService userService;
    @Test
    public void setUserTest() throws Exception {
        User user = new User();
        user.setName("Jan");
        user.setLastName("Malinowski");
        user.setEmail("janmal@wp.pl");
        when(mockUserRepository.save(any(User.class))).thenReturn(user);
        User userSaved = userService.setUser(user);
        assertEquals(user,userSaved);
    }
    @Test
    public void getUserTest() throws Exception {
        User user = new User();
        user.setName("Jan");
        user.setLastName("Malinowski");
        user.setEmail("janmal@wp.pl");
        user.setUserId(1L);
        when(mockUserRepository.findById(any(Long.class))).thenReturn(Optional.of(user));
        Optional<User> userSaved = userService.getUser(1L);
        assertEquals(user.getEmail(),userSaved.get().getEmail());
    }
    @Test
    public void deleteUserTest() throws Exception{
        Long userId = 1L;
        userService.deleteUser(userId);
        verify(mockUserRepository).deleteById(userId);
    }
}
