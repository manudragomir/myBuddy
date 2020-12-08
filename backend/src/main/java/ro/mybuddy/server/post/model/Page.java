package ro.mybuddy.server.post.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class Page {
    public Integer nrOrd;
    public Integer size;
}
