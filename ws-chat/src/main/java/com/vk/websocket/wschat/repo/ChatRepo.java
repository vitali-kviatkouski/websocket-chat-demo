package com.vk.websocket.wschat.repo;

import com.vk.websocket.wschat.model.Chat;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ChatRepo {
    private Chat[] chats = new Chat[] {
        new Chat(1, "Chat about cats"),
        new Chat(2, "Chat about dogs"),
        new Chat(3, "Chat about java")
    };

    private Map<Integer, List<String>> msgs = Map.of(
            1, new ArrayList<>(List.of("Cats are best!", "they are so cute", "but not friendly")),
            2, new ArrayList<>(List.of("Dogs are best!", "they are so smart", "and very friendly")),
            3, new ArrayList<>(List.of("Java is best!", "Hibernate", "design patterns..."))
    );

    public Chat[] getChats() {
        return chats;
    }

    public List<String> getMessages(int id) {
        return msgs.get(id);
    }
}
