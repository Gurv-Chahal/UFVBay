package mainfiles.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import mainfiles.service.AuthService;
import mainfiles.dto.*;


/* 
In this class is where we implement the register and login REST api,
this is why its marked @RestController
*/


// combines @controller and @responsebody so you dont have to use @responsebody on every
// method. It also handles to http requests so we can do things like @GetMapping
@RestController
// its a base api you have to access first for example UFVBay.com/auth/login
@RequestMapping("/auth")
public class AuthController {

  private AuthService authservice;


  // Build Register RESTAPI
  public ResponseEntity<String> register(RegisterDTO registerDTO) {
    return null;
  }

  // Build Login RESTAPI
  public ResponseEntity<String> login(LoginDTO loginDTO) {
    return null;
  }

}