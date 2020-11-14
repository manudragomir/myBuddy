package ro.mybuddy.server.post.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import ro.mybuddy.server.tag.model.Tag;

import java.io.IOException;

public class TagSerializer extends JsonSerializer<Tag> {

    @Override
    public void serialize(Tag value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartObject();
        gen.writeStringField("name",value.getName());
        gen.writeEndObject();
    }
}