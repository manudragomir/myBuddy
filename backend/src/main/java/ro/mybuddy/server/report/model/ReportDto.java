package ro.mybuddy.server.report.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class ReportDto {
    private String postId;

    @NonNull
    private String message;

    @NonNull
    private String username;
}
