package mainfiles.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/*
This is an entity which creates a table called User in the database,
the variables are created into columns which is going to be information we want to store.
This class specifically holds the information about all the users in the database. 
*/


// getter and setter lombok
@Getter
@Setter

// constructor lombok
@AllArgsConstructor
@NoArgsConstructor

// label class as JPA Entity meaning its mapped to a table in a relational database
@Entity

// label class as a table called users
@Table(name = "users")
public class User {


  // column called id, which automatically increments when new things are added
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // column called name, cannot be null
  @Column(nullable = false)
  private String name;

  // column called username, cannot be null, must be unique
  @Column(nullable = false, unique = true)
  private String username;

  // column called email, cannot be null, must be unique
  @Column(nullable = false, unique = true)
  private String email;

  // column called password, cannot be null
  @Column(nullable = false)
  private String password;


}
