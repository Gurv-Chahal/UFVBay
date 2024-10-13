package mainfiles.service;

import mainfiles.dto.*;

public interface AuthService {

  
  public String register(RegisterDTO registerDTO);

  public String login(LoginDTO loginDTO);

} 