package com.vanderlinde.rrss.dto.community.Forum;

import lombok.Data;

@Data
public class ForumUpdatePostRequest {

    private String newTitle ;
    private String newText ;
    private int postId ;

}
