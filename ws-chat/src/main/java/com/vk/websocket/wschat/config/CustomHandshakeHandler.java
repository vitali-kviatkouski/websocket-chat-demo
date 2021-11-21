package com.vk.websocket.wschat.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.security.SecureRandom;
import java.util.Map;
import java.util.Random;

@Slf4j
public class CustomHandshakeHandler extends DefaultHandshakeHandler {
    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        RandomPrincipal randomPrincipal = new RandomPrincipal();
        log.info("Joined " + randomPrincipal);
        return randomPrincipal;
    }

    @Data
    private static class RandomPrincipal implements Principal {
        private static final String[] NAMES = new String[] {"wolf", "giraffe", "lion", "eagle", "wartog", "mouse"};
        private static Random R = new SecureRandom();

        private String name = NAMES[R.nextInt(NAMES.length)] + R.nextInt(200);

        @Override
        public String getName() {
            return name;
        }

        @Override
        public String toString() {
            return name;
        }
    }
}
