// src/main/java/mainfiles/repository/MessageRepository.java

package mainfiles.repository;

import mainfiles.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

// repository interface for interacting with message entity


@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // fetches all mesages sent by a user
    Page<Message> findBySenderName(String senderName, Pageable pageable);
    // fetches all messages recieved by a user
    Page<Message> findByReceiverName(String receiverName, Pageable pageable);

    // Retrieves conversations between two users
    // using query for multiple conditions
    @Query("SELECT m FROM Message m WHERE " +
            // condition 1 - match message sent by user1 and recieved by user 2
            "(m.senderName = :user1 AND m.receiverName = :user2) " +
            // OR match messages sent by user2 and recieved by user 1
            "OR (m.senderName = :user2 AND m.receiverName = :user1) " +
            // oreder them by timestamp
            "ORDER BY m.timestamp DESC")
    Page<Message> findConversationBetweenUsers(String user1, String user2, Pageable pageable);

    // Fetch all public messages with pagination
    // query - filter where reciever name is set to chatroom order by timestamp
    @Query("SELECT m FROM Message m WHERE m.receiverName = 'CHATROOM' ORDER BY m.timestamp DESC")
    Page<Message> findAllPublicMessages(Pageable pageable);
}
