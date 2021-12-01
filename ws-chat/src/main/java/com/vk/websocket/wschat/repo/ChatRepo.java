package com.vk.websocket.wschat.repo;

import com.vk.websocket.wschat.model.Chat;
import com.vk.websocket.wschat.model.Message;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.vk.websocket.wschat.model.Message.m;

@Repository
public class ChatRepo {
    private Chat[] chats = new Chat[] {
        new Chat(1, "Chat about cats"),
        new Chat(2, "Chat about dogs"),
        new Chat(3, "Chat about java")
    };

    private Map<Integer, List<Message>> msgs = Map.of(
            1, new ArrayList<>(List.of(m("Cats are best!"), m("they are so cute"), m("but not friendly"))),
            2, new ArrayList<>(List.of(m("Dogs are best!"), m("they are so smart"), m("and very friendly"))),
            3, new ArrayList<>(List.of(m("Java is best!"), m("Hibernate"), m("design patterns...")))
    );

    public Chat[] getChats() {
        return chats;
    }

    public List<Message> getMessages(int id) {
        return msgs.get(id);
    }
}
