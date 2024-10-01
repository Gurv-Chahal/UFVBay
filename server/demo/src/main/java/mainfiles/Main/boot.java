package mainfiles.Main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("mainfiles.Entity")
public class boot {

	public static void main(String[] args) {
		SpringApplication.run(boot.class, args);
	}

}
