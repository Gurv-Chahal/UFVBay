package mainfiles.service.impl;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import mainfiles.dto.*;
import mainfiles.repository.*;


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
