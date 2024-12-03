package mainfiles.controller;

import mainfiles.entity.User;
import mainfiles.dto.UserDTO;
import mainfiles.mapper.UserMapper;
import mainfiles.repository.UserRepository;
import mainfiles.utility.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private final UserUtil userUtil;

    public UserController(UserUtil userUtil) {
        this.userUtil = userUtil;
    }


    // Endpoint to update user profile
    @PutMapping("/users/update")
    public ResponseEntity<UserDTO> updateUserProfile(@RequestBody UserDTO updatedUserDTO) {
        // retrieve the current logged-in user's ID
        Long userId = userUtil.getCurrentUserId();

        // find the user in the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // update user profile fields
        if (updatedUserDTO.getName() != null) {user.setName(updatedUserDTO.getName());}
        if (updatedUserDTO.getUsername() != null) {user.setUsername(updatedUserDTO.getUsername());}
        if (updatedUserDTO.getEmail() != null) {user.setEmail(updatedUserDTO.getEmail());}

        // save updated user to the database
        User updatedUser = userRepository.save(user);

        // map the updated user to a DTO
        UserDTO userDTO = UserMapper.mapToUserDTO(updatedUser);
        return ResponseEntity.ok(userDTO);
    }


    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getName(),
                        user.getUsername(),
                        user.getEmail()
                ))
                .collect(Collectors.toList());
    }
}
