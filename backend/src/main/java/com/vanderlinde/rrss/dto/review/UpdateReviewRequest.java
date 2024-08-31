package com.vanderlinde.rrss.dto.review;

import jakarta.annotation.Nullable;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Data
public class UpdateReviewRequest {
    private int reviewId;
    private String text;
    private int rating;
    private MultipartFile image;
}
