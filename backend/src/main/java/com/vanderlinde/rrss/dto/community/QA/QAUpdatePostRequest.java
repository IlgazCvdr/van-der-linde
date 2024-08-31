package com.vanderlinde.rrss.dto.community.QA;

import lombok.Data;

@Data
public class QAUpdatePostRequest {

    private String newTitle ;
    private String newText ;
    private int postId ;
}
