package ro.mybuddy.server.post.model;

import lombok.Data;
import ro.mybuddy.server.post.utils.TypePost;
import ro.mybuddy.server.tag.model.Tag;

import java.util.List;

@Data
public class FilterPrototype {
    public List<Tag> listTags;
    public TypePost type;
    public String username;
    public Page page;
    public Range range;
}
