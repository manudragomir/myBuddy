package ro.mybuddy.server.websockets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.post.model.Post;

import static ro.mybuddy.server.websockets.WebSocketConfiguration.MESSAGE_PREFIX;

@Component
public class EventHandler {

    private final SimpMessagingTemplate websocket;

    @Autowired
    public EventHandler(SimpMessagingTemplate websocket) {
        this.websocket = websocket;
    }

    public void newPost(Post post) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/newPost", post);
    }

    public void deletePost(String post) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/deletePost", post);
    }

    public void updatePost(Post post) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/updatePost", post);
    }

}