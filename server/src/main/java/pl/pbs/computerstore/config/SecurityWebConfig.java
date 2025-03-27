package pl.pbs.computerstore.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityWebConfig {
    private final JwtAuthFilter jwtAuthFilter;

    @Autowired
    public SecurityWebConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()).authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/category/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/category/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/category/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/category/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/keyword/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/keyword/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/keyword/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/keyword/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/product/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/product/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/product/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/product/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/order").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/order/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/order").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/order/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/order/withitems/**").hasAnyAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/order/{orderId}").hasAnyAuthority("USER","ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/item").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/item/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/item/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/item/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/item/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/user").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/user/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/user/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/user/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/user/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/register", "/login", "/images/**").permitAll()
                        .requestMatchers("/api/**").hasAuthority("ADMIN"))
                .sessionManagement(smc -> smc
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
