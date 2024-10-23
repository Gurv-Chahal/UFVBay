package mainfiles.service.impl;

import org.springframework.stereotype.Service;
import mainfiles.entity.User;

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
  // here we have a reference to an object of the class UserRepository
  private UserRepository userRepository;

  // have reference to an object of the class RegisterDTO
  public String register(RegisterDTO registerDTO) {
    
    // 1. Check if username already exists in database by using UserRepository
    // in () we access registerDTO class then using . operator we get the getter method to private username field
    if (userRepository.existsByUsername(registerDTO.getUsername())) {
      // when invalid parameters are passed we should throw a runtime exception
      throw new RuntimeException("This Username has already been taken");
    }

    // 2. check if email already exists in the database by using UserRepository
    // in () we access registerDTO class then using . operator we get the getter method to private email field
    if (userRepository.existsByEmail(registerDTO.getEmail())) {
      // when invalid parameters are passed we should throw a runtime exception
      throw new RuntimeException("This email is already in use");
    }

    // create instance of User class called user
    User user = new User();



    // call getUsername on registerDTO object to retrieve the username user has entered during
    // registration. Then pass this username to setUsername method which will then update it 
    // in user entity, which then maps it to the database.
    user.setUsername(registerDTO.getUsername());

    // same as above but for password
    user.setPassword(registerDTO.getPassword());

    // same as above but for email
    user.setEmail(registerDTO.getEmail());

    // same as above but for name
    user.setName(registerDTO.getName());


    // 1. checks if the user is a new entity or existing one.
    // 2. insert or update the record in the users table in the database based on the properties
    // of the user object
    userRepository.save(user);


    return "User registered sucessfully";
  }


  // have reference to an object of the class LoginDTO
  public String login(LoginDTO loginDTO) {
    
    loginDTO.getUsernameOrEmail();
    loginDTO.getPassword();
    
    return "User logged in successfully";
  }
  
}
