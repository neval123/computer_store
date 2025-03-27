package pl.pbs.computerstore.auth;

import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.pbs.computerstore.config.JwtService;
import pl.pbs.computerstore.model.Role;
import pl.pbs.computerstore.model.User;
import pl.pbs.computerstore.repository.UserRepository;

import java.io.Console;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        var token = jwtService.generateToken(user);
        return "{\"token\":"+"\""+token+"\"}";
    }
    public String authenticate(AuthRequest request) throws Exception{
        return authenticate(request.getEmail(), request.getPassword());
    }
    public String authenticate(@NotNull String email, @NotNull String password) throws Exception {
        try {
            var user = userRepository.findByEmail(email).orElseThrow();
            if (passwordEncoder.matches(password, user.getPassword())) {
                var token = jwtService.generateToken(user);
                return "{\"token\":" + "\"" + token + "\"}";
            }else{
                return "Uwierzytelnianie uzytkownika : " + email + " nie powiodło się";
            }
        } catch (Exception e) {
            throw new Exception("Uwierzytelnianie uzytkownika: " + email + " nie powiodło się");
        }
    }
}
