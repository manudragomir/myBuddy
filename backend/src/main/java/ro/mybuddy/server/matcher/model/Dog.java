package ro.mybuddy.server.matcher.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper =  true)
public class Dog extends Animal {
    private String purpose1;
    private String purpose2;
    private Integer intelligence;
    private Integer watchdog;
}
