package pl.pbs.computerstore.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.pbs.computerstore.model.User;
import pl.pbs.computerstore.service.UserService;
import pl.pbs.computerstore.validation.ValidationService;

import java.util.Optional;

@RestController
@RequestMapping("/")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;
    private final ValidationService<User> validator;
    public AuthController(AuthService authService, UserService userService, ValidationService<User> validator) {
        this.authService = authService;
        this.userService = userService;
        this.validator = validator;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register (@RequestBody User user){
        validator.validate(user);
        Optional<User> maybeUser = userService.findByEmail(user.getEmail());
        if(maybeUser.isEmpty()){
            return  ResponseEntity.ok(authService.register(user));
        }else{
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("{\"error\":\"Istnieje już konto powiązane z tym adresem e-mail. Rejestracja nie powiodła się.\"}");
        }

    }
    @PostMapping("/login")
    public ResponseEntity<String> login (@RequestBody AuthRequest request) throws Exception{
        return  ResponseEntity.ok(authService.authenticate(request));
    }
}
