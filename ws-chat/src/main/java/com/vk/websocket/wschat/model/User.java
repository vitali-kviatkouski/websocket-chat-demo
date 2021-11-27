package com.vk.websocket.wschat.model;

import lombok.Value;

@Value
public class User {
    final String login;
    final String password;
}
