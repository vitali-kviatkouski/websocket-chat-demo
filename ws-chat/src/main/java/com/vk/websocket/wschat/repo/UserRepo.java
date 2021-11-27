package com.vk.websocket.wschat.repo;

import com.vk.websocket.wschat.model.User;
import org.springframework.stereotype.Repository;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepo {
    private List<User> users = List.of(
        new User("admin", "admin"),
        new User("user1", "user1"),
        new User("user2", "user2")
    );

    public Optional<Principal> login(String user, String password) {
        if (users.contains(new User(user, password))) {
            return Optional.of(new Principal() {
                @Override
                public String getName() {
                    return user;
                }

                @Override
                public String toString() {
                    return getName();
                }
            });
        }
        return Optional.empty();
    }
}
