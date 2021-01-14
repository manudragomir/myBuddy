package ro.mybuddy.server.post.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

/**
 * Model used to specify the size and the index of a page of posts
 */
@Data
@RequiredArgsConstructor
public class Page {
    public Integer nrOrd;
    public Integer size;
}
