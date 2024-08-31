package com.vanderlinde.rrss.dto.community.LocalCommunity;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
@Data
public class LocalCommunityUpdatePostRequest {

    private String newTitle;
    private String newText;
    private int postId ;
    private MultipartFile newImage ;

}
