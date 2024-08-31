package com.vanderlinde.rrss.dto.review;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CreateReviewRequest {

    private int productId;
    private String text;
    private int rating;
    private MultipartFile image ;

}
