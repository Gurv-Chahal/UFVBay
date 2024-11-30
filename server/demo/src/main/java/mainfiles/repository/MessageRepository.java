package mainfiles.repository;

import mainfiles.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReceiverName(String receiverName);
    List<Message> findBySenderName(String senderName);
}
