package com.vanderlinde.rrss.dto.community.LocalCommunity;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
@Data
public class LocalCommunityCreateRequest {

    private String name ;
    private MultipartFile icon ;

}
