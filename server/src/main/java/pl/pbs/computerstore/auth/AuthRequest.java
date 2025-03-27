package pl.pbs.computerstore.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AuthRequest {
    @Email(message = "Niepoprawny format adresu email")
    private String email;
    @NotNull(message = "Nie podano hasła")
    @Size(min=8,max=32,message ="Hasło musi składać się z przynajmniej 8 znaków i nie przekraczać 32")
    private String password;

    public AuthRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
    public AuthRequest() {
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


}
