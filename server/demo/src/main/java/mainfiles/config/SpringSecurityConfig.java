package mainfiles.config;


import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

// Need @Configuration annotation to indicate to spring that the class provides configuration for security settings
@Configuration
@AllArgsConstructor
public class SpringSecurityConfig {


    // @Bean tells spring to manage the method in spring container
    @Bean
    // static because we don't need an instance of is, PasswordEncoder is imported from Spring
    // because we need to return what type of password encryption we want to use
    public static PasswordEncoder passwordEncoder() {

        // we are using BCrypt because it is strong, simple, and common password encryption
        return new BCryptPasswordEncoder();
    }


    @Bean
    // SecurityFilterChain is a part of Spring Security dependency, it creates security filters to incoming
    // http requests. HttpSecurity allows customization of security behaviour of Http requests.
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // CSRF is disabled so we dont get stupid errors, although might enable it later
        http.csrf().disable()

                // this method configures authorization for HTTP requests
                // lambda expression is appropriate here, it takes a parameter called authorize (type is inferred)
                .authorizeHttpRequests((authorize) -> {

                    // permit all that are registering. They do not need authorization
                    authorize.requestMatchers("/auth/register").permitAll();

                    // require authentication for any user trying to access endpoints
                    authorize.anyRequest().authenticated();

                    // enable HTTP Basic authentication, this prompts the user for username/password
                    // in browser pop up
                }).httpBasic(Customizer.withDefaults());

        // build and return configured SecurityFilterChain
        return http.build();
    }



    @Bean
    // AuthenticationManager is an interface responsible for handling authentication requests
    // AuthenticationConfiguration provides configuration settings related to authentication
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        // creates and provides authenticationmanager which allows spring to perform authentication operations
        return configuration.getAuthenticationManager();
    }



}
