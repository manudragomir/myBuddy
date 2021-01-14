package ro.mybuddy.server.websockets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.post.model.Post;

import static ro.mybuddy.server.websockets.WebSocketConfiguration.MESSAGE_PREFIX;

/**
 * Class used to perform some actions when certain events are happening
 */
@Component
public class EventHandler {

    private final SimpMessagingTemplate websocket;

    @Autowired
    public EventHandler(SimpMessagingTemplate websocket) {
        this.websocket = websocket;
    }

    /**
     * Send post to every other user when a specific user adds a post
     * @param post Post added
     */
    public void newPost(Post post) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/newPost", post);
    }

    /**
     * Send post to every other user when a specific user deletes a post
     * @param post Post deleted
     */
    public void deletePost(String post) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/deletePost", post);
    }

    /**
     * Send post to every other user when a specific user updates a post
     * @param post Post updated
     */
    public void updatePost(Post post) {
        this.websocket.convertAndSend(
                MESSAGE_PREFIX + "/updatePost", post);
    }

}