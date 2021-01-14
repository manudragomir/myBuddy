package ro.mybuddy.server.matcher.model;

import lombok.*;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.List;

/***
 * Request for dog matching that will be compared with dogs characteristics
 */
@Data
@Valid
@RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
public class MatchDogRequest {
    @NotNull @NonNull
    private String purpose1;

    private String purpose2;

    @NotNull @NonNull @Min(0) @Max(200)
    private Integer dimension;

    @NotNull @NonNull
    private List<String> skillsWanted;

    @NotNull @NonNull @Min(0) @Max(4000)
    private Integer price;

    @NotNull @NonNull @Min(0) @Max(10)
    private Integer watchDog;
}
