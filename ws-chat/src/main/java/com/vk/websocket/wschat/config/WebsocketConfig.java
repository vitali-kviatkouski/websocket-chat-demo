package com.vk.websocket.wschat.config;

import com.vk.websocket.wschat.interceptors.SecurityInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Configuration
@EnableScheduling
@EnableWebSocketMessageBroker
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {
    @Autowired
    private SecurityInterceptor interceptor;

    @Value("${external.broker.enabled}")
    private boolean externalBrokerEnabled;

    @Value("${security.interceptor.enabled}")
    private boolean securityInterceptorEnabled;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chats-websocket")
                .setHandshakeHandler(new CustomHandshakeHandler())
                .setAllowedOriginPatterns("*").withSockJS();
        registry.addEndpoint("/chats-websocket")
                .setHandshakeHandler(new CustomHandshakeHandler())
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        if (externalBrokerEnabled) {
            registry.enableStompBrokerRelay("/topic")
                    .setRelayHost("localhost").setRelayPort(61613)
                    .setUserDestinationBroadcast("/topic/unresolved.user.dest")
                    .setUserRegistryBroadcast("/topic/registry.broadcast");
        } else {
            registry.enableSimpleBroker("/topic");
        }
        registry.setUserDestinationPrefix("/user");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        if (securityInterceptorEnabled) {
            registration.interceptors(interceptor);
        }
    }
}
