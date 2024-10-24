package mainfiles.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


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

  // reference variable to interface, can reference an object of any class that implements 
  // AuthService interface
  private AuthService authservice;


  // Build Register RESTAPI

  // method is of type ResponseEntity which is a class provided by spring that represents
  // an http response. it allows us to customize http response. In this case we are returning
  // a string and a http response.
  // @PostMapping - used to HTTP POST, which is sending data to a server

  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody RegisterDTO registerDTO) {
    
    // calls the register method from authservice interface which is implemented in authserviceimpl
    // 'String response' holds the message returned by register() method
    // which is in this case "User registered sucessfully"
    String response = authservice.register(registerDTO);

    // return string from register method and the httpstatus CREATED
    return new ResponseEntity<>(response, HttpStatus.CREATED);
  }




  // Build Login RESTAPI
  @PostMapping("/login")
  // @RequestBody binds incoming data to java object (typically in JSON)
  public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {

      // same as above but for login
      String response = authservice.login(loginDTO);
      return new ResponseEntity<>(response, HttpStatus.OK);
      
  }

}