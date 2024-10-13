package mainfiles.service.impl;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import mainfiles.dto.*;
import mainfiles.repository.*;


/*
The purpose of the service class is to write the actual implementation of the code/business logic.
This class is called AuthServiceImpl because we will writing the implementation of the authentication logic,
Meaning the implementation of login/registration. 
*/

@Service
@AllArgsConstructor
public class AuthServiceImpl {

  // has functionality such as checking if username/email already exists in database
  // UserRepository is a class which extends JPARepository built in method
  private UserRepository userRepository;

  public String register(RegisterDTO registerDTO) {
    return null;
  }

  public String login(LoginDTO loginDTO) {
    return null;
  }
  
}
