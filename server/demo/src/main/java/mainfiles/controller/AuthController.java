package mainfiles.controller;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import lombok.AllArgsConstructor;


import mainfiles.service.AuthService;
import mainfiles.dto.*;


/* 
In this class is where we implement the register and login REST api,
this is why its marked @RestController. restcontroller handles http requests
allowing rest apis to function
*/



@RestController
@CrossOrigin("*")
@AllArgsConstructor
@RequestMapping("/auth")
public class AuthController {

  // reference variable to interface, can reference an object of any class that implements AuthService interface
  private AuthService authservice;

  /* 1. Build Register RESTAPI
   method is of type ResponseEntity which is a class provided by spring that represents
   an http response. it allows us to customize http response. In this case we are returning
   a string and a http response.
   @PostMapping - used to HTTP POST, which is sending data to a server
   */

  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody RegisterDTO registerDTO) {
    
    /* calls the register method from authservice interface which is implemented in authserviceimpl 'String
    response' holds the message returned by register() method which is in this case "User registered sucessfully" */
    String response = authservice.register(registerDTO);

    // return string from register method and the httpstatus CREATED
    return new ResponseEntity<>(response, HttpStatus.CREATED);
  }




  // 2. Build Login RESTAPI
  @PostMapping("/login")
  // @RequestBody binds incoming data to java object (typically in JSON)
  public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginDTO loginDTO) {

      String token = authservice.login(loginDTO);

      // jwt code
      JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
      jwtAuthResponse.setAccessToken(token);

      return new ResponseEntity<>(jwtAuthResponse, HttpStatus.OK);
      
  }

}