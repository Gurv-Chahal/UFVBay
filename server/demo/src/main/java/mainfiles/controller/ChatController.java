package mainfiles.controller;

import mainfiles.entity.Message;
import mainfiles.service.Implementation.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

// controller handles communication between websockets and front end api requests

@Controller
public class ChatController {


    // SimpMessagingTemplate is apart of spring and used to send websocket messages
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    // Injecting MessageService class as a field
    @Autowired
    private MessageService messageService;




    // 1. Handles public messages sent via websocket and broadcasts them to every user this is for chatroom

    // MessageMapping maps websocket messages sent to /message api
    @MessageMapping("/message")
    // @Payload extracts message data from a websocket request such as sendername, message, timestamp
    public void broadcastMessage(@Payload Message message) {

        // calls the saveMessage method to save this message to the database and add uniqueID
        Message savedMessage = messageService.saveMessage(message);

        // then brodcast this saved message to all websocket clients subscribed to /chatroom/public
        // which is the public chatroom
        simpMessagingTemplate.convertAndSend("/chatroom/public", savedMessage); // Broadcast
    }



    // 2. send private messages between users and make sure both sender and reciever see messages

    // maps websocket messages sent to /private-message api
    @MessageMapping("/private-message")
    //@payload extracts message data
    public void sendPrivateMessage(@Payload Message message) {
        // save the message in database
        Message savedMessage = messageService.saveMessage(message); // Save with timestamp and ID
        // Send the message to private reciever in private channel /user/{username}/private
        simpMessagingTemplate.convertAndSendToUser(savedMessage.getReceiverName(), "/private", savedMessage);
        // Also send back to sender to update the local uI
        simpMessagingTemplate.convertAndSendToUser(savedMessage.getSenderName(), "/private", savedMessage);
    }


    // 3. Fetch paginated list of public messages from the database for public messaging

    // maps http get request to api/public-messages
    @GetMapping("/api/public-messages")
    @ResponseBody
    public List<Message> getPublicMessages(
            // extract query parameters for pagination and set default value
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        // creates a pageable request with sorting by timestamp
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());

        //call get all public messages and store in page object
        Page<Message> publicMessages = messageService.getAllPublicMessages(pageable);
        System.out.println("Fetched " + publicMessages.getContent().size() + " public messages");

        // return and extract list of messages from page object
        return publicMessages.getContent();
    }



    // 4. Fetch all messages sent and recieved for authenticated user

    // map to http request api-messages
    @GetMapping("/api/messages")
    @ResponseBody
    public List<Message> getUserMessages(
            // extract query parameters for pagination and set default value for how many messages to be extracted
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        // retrieve authentication details of the current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // get username of the authenticated user
        String username = authentication.getName();

        // fetch messages in a paginated manner and sort by timestamp
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());

        // fetch messages where the user is the reciever
        Page<Message> receivedMessages = messageService.getMessagesByReceiver(username, pageable);

        // ftch messages where user is the sender
        Page<Message> sentMessages = messageService.getMessagesBySender(username, pageable);

        // create a List of Messages
        List<Message> allMessages = new ArrayList<>();

        // combine all recieved and sent messages into one list
        allMessages.addAll(receivedMessages.getContent());
        allMessages.addAll(sentMessages.getContent());

        // sort by timestamp
        allMessages.sort((m1, m2) -> m2.getTimestamp().compareTo(m1.getTimestamp()));
        System.out.println("Fetched " + allMessages.size() + " messages for user " + username);
        return allMessages;
    }



    // 5. fetches a paginated conversation history between the authenticated user1 and user2
    @GetMapping("/api/conversation/{user2}")
    @ResponseBody
    public List<Message> getConversation(
            // capture user2 paramater in query
            @PathVariable String user2,

            // set default number of messages in conversation history
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        // retrieve authentication details
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // extract username
        String user1 = authentication.getName();

        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        // fetch messages between user1 and user2
        Page<Message> conversation = messageService.getConversationBetweenUsers(user1, user2, pageable);
        System.out.println("Fetched conversation between " + user1 + " and " + user2 + ": " + conversation.getContent().size() + " messages");
        return conversation.getContent();
    }
}
