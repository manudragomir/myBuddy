package ro.mybuddy.server.matcher.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.Objects;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Dog{
    private Integer id;
    private String name;
    private String altName;
    private Integer weight;
    private List<String> skills;
    private Integer avgPrice;
    private Integer popularity;
    private String purpose1;
    private String purpose2;
    private Integer intelligence;
    private Integer watchdog;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Dog dog = (Dog) o;
        return id.equals(dog.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
