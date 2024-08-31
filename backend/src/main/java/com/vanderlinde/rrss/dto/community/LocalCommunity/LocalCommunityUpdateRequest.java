package com.vanderlinde.rrss.dto.community.LocalCommunity;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
@Data
public class LocalCommunityUpdateRequest {

    private String newName ;
    private MultipartFile newIcon ;
    private int postId ;

}
