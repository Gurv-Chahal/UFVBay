package mainfiles.entity;

import jakarta.persistence.*;

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
