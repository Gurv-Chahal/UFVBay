package mainfiles.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TestTable")
public class entityOne {
  

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long testid;


  @Column
  private String testColumn;


  @Column
  private String testColumnTwo;
  
}
