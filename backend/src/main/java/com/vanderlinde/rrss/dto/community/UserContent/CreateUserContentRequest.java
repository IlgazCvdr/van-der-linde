package com.vanderlinde.rrss.dto.community.UserContent;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CreateUserContentRequest {

    private String title ;
    private String text ;
    private MultipartFile image ;

}
