package ro.mybuddy.server.post.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * Model used to represent a radius for filtering posts by location
 */
@Data
@AllArgsConstructor
public class Range {
    @NotNull
    @Min(value=-90, message = "Longitude must be higher than -90")
    @Max(value=90, message = "Longitude must be lower than 90")
    Double longitude;
    @NotNull
    @Min(value=-90, message = "Longitude must be higher than -90")
    @Max(value=90, message = "Longitude must be lower than 90")
    Double latitude;
    @NotNull
    Double range;
}
