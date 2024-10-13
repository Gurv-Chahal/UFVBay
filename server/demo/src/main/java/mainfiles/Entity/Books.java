package mainfiles.entity;

import jakarta.persistence.*;


/*
This is an entity which creates a table called book in the database,
the variables are created into columns which is going to be information we want to store.
This class specifically holds the information about all the books in the database. 
*/

@Entity
@Table(name = "Book")
public class Books {
  

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long bookId;


  @Column(nullable = false)
  private String name;


  @Column(nullable = false)
  private String author;

  @Column
  private String classes;
  
}
