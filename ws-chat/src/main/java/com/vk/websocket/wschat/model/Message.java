package com.vk.websocket.wschat.model;

import lombok.Value;

@Value
public class Message {
    private String user;
    private String message;

    public static Message m(String user, String message) {
        return new Message(user, message);
    }
    public static Message m(String message) {
        return m(null, message);
    }

}
