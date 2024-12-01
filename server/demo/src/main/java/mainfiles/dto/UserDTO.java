package mainfiles.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String name;
    private String username;
    private String email;

    public UserDTO(String username, boolean b) {
    }
}
