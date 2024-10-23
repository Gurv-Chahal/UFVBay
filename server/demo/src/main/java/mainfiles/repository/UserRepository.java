package mainfiles.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import mainfiles.entity.*;

/* 
This is an important class because it gives us some basic built in methods that we need
such as findbyId, deletebyId, and other methods that check if something already exists in database.
it does this by extending the spring jparepository by importing it.
*/


// in the '<>' must provide the entity class and the type of the primary key
public interface UserRepository extends JpaRepository<User, Long> {

  // exists by username method
  public boolean existsByUsername(String username);

  // exists by email method
  public boolean existsByEmail(String email);

}