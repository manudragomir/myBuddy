package ro.mybuddy.server.matcher.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchResponse {
    @NotNull @NonNull
    List<Dog> dogs;
}
