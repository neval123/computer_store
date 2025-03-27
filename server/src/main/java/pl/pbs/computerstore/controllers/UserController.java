package pl.pbs.computerstore.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pl.pbs.computerstore.model.Product;
import pl.pbs.computerstore.model.User;
import pl.pbs.computerstore.service.ProductService;
import pl.pbs.computerstore.service.UserService;

import java.net.URI;
import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    ResponseEntity<User> getUser(@PathVariable Long userId) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User u = userService.findByEmail((String) auth.getName()).orElseThrow();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if (u.getUserId() == userId || isAdmin) {
            return ResponseEntity.of(userService.getUser(userId));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping
    ResponseEntity<Void> createUser(@Valid @RequestBody User user) {

        User createdUser = userService.setUser(user);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{userId}").buildAndExpand(createdUser.getUserId()).toUri();
        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Void> updateUser(@Valid @RequestBody User user,
                                           @PathVariable Long userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User u = userService.findByEmail((String) auth.getName()).orElseThrow();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        if (u.getUserId() == userId || isAdmin) {
            User oldUser = userService.getUser(userId).orElse(null);
            if (oldUser != null) {
                if (!isAdmin) {
                    user.setRole(oldUser.getRole());
                } else {
                    if (user.getRole() == null) {
                        user.setRole(oldUser.getRole());
                    }
                }
                user.setPassword(oldUser.getPassword());
                user.setEmail(oldUser.getEmail());
                user.setUserId(userId);
                userService.setUser(user);
                return new ResponseEntity<Void>(HttpStatus.OK);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        return userService.getUser(userId).map(user -> {
            userService.deleteUser(userId);
            return new ResponseEntity<Void>(HttpStatus.OK);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    Page<User> getUsers(@RequestParam(name = "page", defaultValue = "0") int page,
                        @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.getUsers(pageable);
    }
}
