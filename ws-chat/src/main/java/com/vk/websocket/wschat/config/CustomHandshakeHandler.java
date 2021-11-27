package com.vk.websocket.wschat.config;

import com.vk.websocket.wschat.repo.UserRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.security.Principal;
import java.util.Map;

import static org.springframework.web.context.request.RequestAttributes.SCOPE_REQUEST;

@Slf4j
public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    private UserRepo userRepo = new UserRepo();

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        var params = UriComponentsBuilder.fromHttpRequest(request).build().getQueryParams();
        var login = params.getFirst("login");
        var pwd = params.getFirst("password");
        var user = userRepo.login(login, pwd);
        return user.orElse(null);
    }
}
