package mainfiles.repository;

import mainfiles.Entity.Books;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
    For explanation on how JpaRepository works look at UserRepository class comments.
    This method will be to find books associated with a specific user
 */

@Repository
public interface BooksRepository extends JpaRepository<Books, Long> {
}
