package mainfiles.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import mainfiles.entity.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/* 
This is an important class because it gives us some basic built in methods that we need
such as findbyId, deletebyId, and other methods that check if something already exists in database.
it does this by extending the spring jparepository by importing it.
*/


// in the '<>' must provide the entity class and the type of the primary key
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  // exists by username method
  public boolean existsByUsername(String username);

  // exists by email method
  public boolean existsByEmail(String email);

  // Spring Data JPA automatically creates a query to find a User entity where either the username or email matches the values.
  public Optional<User> findByUsernameOrEmail(String username, String email);

}