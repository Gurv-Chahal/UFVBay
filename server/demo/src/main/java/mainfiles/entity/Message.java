// src/main/java/mainfiles/entity/Message.java

package mainfiles.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;


// entity class for messages table in database

@Entity
@Table(name = "messages", indexes = {
        @Index(columnList = "senderName"),
        @Index(columnList = "receiverName"),
        @Index(columnList = "timestamp")
})
@Getter
@Setter
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderName;

    private String receiverName;

    @Column(length = 1000)
    private String message;

    @CreatedDate
    private LocalDateTime timestamp;


    // Constructors
    public Message() {
    }

    public Message(String senderName, String receiverName, String message, LocalDateTime timestamp) {
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.message = message;
        this.timestamp = timestamp;
    }

}
