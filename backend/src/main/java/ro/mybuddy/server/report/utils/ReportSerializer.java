package ro.mybuddy.server.report.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import ro.mybuddy.server.report.model.Report;

import java.io.IOException;

public class ReportSerializer extends JsonSerializer<Report> {
    @Override
    public void serialize(Report value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartObject();

        gen.writeNumberField("id", value.getId());

        gen.writeObjectFieldStart("post");
        gen.writeStringField("id", value.getPost().getId());
        gen.writeEndObject();

        gen.writeObjectFieldStart("user");
        gen.writeStringField("username", value.getUser().getUsername());
        gen.writeEndObject();

        gen.writeStringField("message", value.getMessage());

        gen.writeEndObject();
    }
}
