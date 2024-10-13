package mainfiles.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import mainfiles.entity.*;

/* this is an important class because it gives us some basic built in methods that we need
such as findbyId, deletebyId, and other methods that check if something already exists in database.
it does this by extending the built in jparepository by importing it.
*/

public interface UserRepository extends JpaRepository<User, Long> {

}