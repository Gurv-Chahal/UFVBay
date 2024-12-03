// src/main/java/mainfiles/service/Implementation/MessageService.java

package mainfiles.service.Implementation;

import mainfiles.entity.Message;
import mainfiles.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    // inject repository interface for database operations
    private final MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }


    // 1. Save the message entity to database and set timestamp

    // transactions ensures all of it goes through or none of it
    @Transactional
    public Message saveMessage(Message message) {

        // add current time as timestamp
        message.setTimestamp(LocalDateTime.now());

        // save message to database using JPA
        Message savedMessage = messageRepository.save(message);
        System.out.println("Saved message: " + savedMessage);

        // return saved message
        return savedMessage;
    }

    // 2. Fetches messages sent by a specific user
    public Page<Message> getMessagesBySender(String senderName, Pageable pageable) {

        // calls query in repo to fetch messages where senderName is matched
        return messageRepository.findBySenderName(senderName, pageable);
    }

    // 3. Fetch messages recieved by a specific user
    public Page<Message> getMessagesByReceiver(String receiverName, Pageable pageable) {

        // use query in repo to fetch messages where recieverName matches
        return messageRepository.findByReceiverName(receiverName, pageable);
    }

    // 4. Retrieve all messages between two users
    public Page<Message> getConversationBetweenUsers(String user1, String user2, Pageable pageable) {

        // call query to fetch messages exchanged between user 1 and user 2
        return messageRepository.findConversationBetweenUsers(user1, user2, pageable);
    }

    // 5. fetch all messages sent to public chatroom
    public Page<Message> getAllPublicMessages(Pageable pageable) {
        return messageRepository.findAllPublicMessages(pageable);
    }



    public List<Message> getFullConversationBetweenUsers(String user1, String user2) {
        // Call a query in the repository to fetch all messages exchanged between the two users
        return messageRepository.findFullConversationBetweenUsers(user1, user2);
    }




}
