package mainfiles.service.Implementation;

import mainfiles.entity.Message;
import mainfiles.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message saveMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }

    public List<Message> getMessagesBySender(String senderName) {
        return messageRepository.findBySenderName(senderName);
    }

    public List<Message> getMessagesByReceiver(String receiverName) {
        return messageRepository.findByReceiverName(receiverName);
    }
}
