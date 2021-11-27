package com.vk.websocket.wschat.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Preconditions;
import com.vk.websocket.wschat.model.Chat;
import com.vk.websocket.wschat.repo.ChatRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
public class ChatsController {
    @Autowired
    private ChatRepo chatRepo;

    @Autowired
    private SimpMessagingTemplate tpl;

    @SubscribeMapping("/chats/all")
    public Chat[] getAllChats(Principal principal) {
        Preconditions.checkNotNull(principal, "Expected authenticated access");
        log.info("Subscribed new user {}", principal);
        return chatRepo.getChats();
    }

    // explain the diff between with and without annotation @SendToUser
    @SubscribeMapping("/username")
    public String getUsername(Principal user) {
        Preconditions.checkNotNull(user, "Expected authenticated access");
        return user.toString();
    }

    // explain the diff between with and without annotation @SendToUser
    @SubscribeMapping("/chats/system")
    public String subscribeToSystem(Principal user) {
        Preconditions.checkNotNull(user, "Expected authenticated access");
        return "this is our bot channel, you'll receive important notifications here";
    }

    @SendToUser("/topic/chats/system") // explain the diff between with and without annotation (no diff)
    @MessageMapping("/chats/system")
    public String messageToSystem(String request, Principal user) {
        Preconditions.checkNotNull(user, "Expected authenticated access");
        log.info("Got message from {}", user);
        if (request.equalsIgnoreCase("support")) {
            return "Sorry, support unavailable";
        }
        if (user.getName().equals("admin")) {
            log.info("Sending admin message to all users from {}", user);
            tpl.convertAndSend("/topic/chats/system", request);
            return "Message sent to all";
        }
        return "did not understood you";
    }


    @SubscribeMapping("/chats/{id}")
    public String[] getAllChats(@DestinationVariable("id") int chatId) throws InterruptedException {
        //TODO: enable
        // Thread.sleep(1000);
        // TODO: authorization here
        log.info("Returning messages");
        // returns directly to user
        // instead could be using /user/chats/id + @SendToUser annotation (though it's slightly different)
        return chatRepo.getMessages(chatId).toArray(new String[]{});
    }

    @MessageMapping("/chats/{id}")
    //@SendTo("/topic/chats/{id}") already works this way
    public String addMessage(@DestinationVariable("id") int chatId,
                             @Header("simpSessionId") String sessionId,
                             Principal user,
                             String msg) {
        log.info("Got message [{}] for chat {} from {}", msg, chatId, user);
        chatRepo.getMessages(chatId).add(msg);
        log.info("Sending to user " + sessionId);
        if (msg.toLowerCase().contains("wtf") || msg.toLowerCase().contains("hell")) {
            // session id require for non-identified user
            tpl.convertAndSendToUser(sessionId, "/topic/chats/system",
                    "We've sent your message, but you should not use such words",
                    createHeaders(sessionId));
        }
        return msg; //instead could use tpl.convertAndSend(/topic/chats/id)
    }

    @MessageMapping("/private/messages/{user}")
    //@SendToUser("/user/{user}/topic/private/messages") <- cannot use this! only the template.convertAndSend
    public void sendPrivateMessage(@DestinationVariable("user") String destUser,
                             Principal senderUser,
                             String msg) {
        log.info("Got personal msg from {} to {}: {}", senderUser, destUser, msg);
        tpl.convertAndSendToUser(destUser, "/topic/private/messages",
                         "From " + senderUser.toString() + ":" + msg);
    }

    @SubscribeMapping("/login")
    public String onLogin(Principal p) {
        return String.valueOf(p != null);
    }

    private MessageHeaders createHeaders(String sessionId) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);
        return headerAccessor.getMessageHeaders();
    }
}
