package mainfiles.controller;

import mainfiles.entity.Message;
import mainfiles.service.Implementation.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private MessageService messageService;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message broadcastMessage(@Payload Message message) {
        messageService.saveMessage(message);
        return message;
    }

    @MessageMapping("/private-message")
    public void sendPrivateMessage(@Payload Message message) {
        messageService.saveMessage(message);
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
    }


    @GetMapping("/api/messages/{username}")
    public List<Message> getUserMessages(@PathVariable String username) {
        List<Message> receivedMessages = messageService.getMessagesByReceiver(username);
        List<Message> sentMessages = messageService.getMessagesBySender(username);
        List<Message> allMessages = new ArrayList<>();
        allMessages.addAll(receivedMessages);
        allMessages.addAll(sentMessages);
        return allMessages;
    }

}
