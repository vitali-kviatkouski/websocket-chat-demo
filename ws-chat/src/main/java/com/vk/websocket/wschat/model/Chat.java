package com.vk.websocket.wschat.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class Chat {
    private int id;
    private String name;
}
