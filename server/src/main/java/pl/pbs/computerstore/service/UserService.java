package pl.pbs.computerstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.pbs.computerstore.model.Product;
import pl.pbs.computerstore.model.User;

import java.util.Optional;

public interface UserService {
    Optional<User> getUser(Long id);
    User setUser(User user);
    void deleteUser(Long id);
    Page<User> getUsers(Pageable pageable);
    Optional<User> findByEmail(String email);
}
