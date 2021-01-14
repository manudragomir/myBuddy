package ro.mybuddy.server.post.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.tag.model.Tag;

import java.io.IOException;

/**
 * Serializer used to convert a post to JSON format
 */
public class PostSerializer extends JsonSerializer<Post> {
    @Override
    public void serialize(Post value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartObject();
        gen.writeStringField("id",value.getId());
        gen.writeObjectFieldStart("user");
        gen.writeStringField("username",value.getUser().getUsername());
        gen.writeEndObject();
        gen.writeStringField("type",value.getType().toString());
        if(value.getBody()!=null)
            gen.writeStringField("body",value.getBody());
        gen.writeStringField("date",value.getDate().toString());
        if(value.getLongitude()!=null)
            gen.writeStringField("longitude",value.getLongitude().toString());
        if(value.getLatitude()!=null)
            gen.writeStringField("latitude",value.getLatitude().toString());
        gen.writeArrayFieldStart("tags");
        for(Tag tag: value.getTags())
            gen.writeString(tag.getName());
        gen.writeEndArray();
        gen.writeEndObject();
    }
}
