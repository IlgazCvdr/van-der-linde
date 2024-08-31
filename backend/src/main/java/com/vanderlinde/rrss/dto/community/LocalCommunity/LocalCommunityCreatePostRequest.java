package com.vanderlinde.rrss.dto.community.LocalCommunity;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
@Data
public class LocalCommunityCreatePostRequest {

    private String title;
    private String text;
    private MultipartFile image ;
    private int fromCommunity ;

}
