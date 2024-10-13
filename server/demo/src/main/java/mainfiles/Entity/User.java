package mainfiles.entity;

import jakarta.persistence.*;


/*
This is an entity which creates a table called User in the database,
the variables are created into columns which is going to be information we want to store.
This class specifically holds the information about all the users in the database. 
*/


@Entity
@Table(name = "users")
public class User {


  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true)
  private String username;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;


}
