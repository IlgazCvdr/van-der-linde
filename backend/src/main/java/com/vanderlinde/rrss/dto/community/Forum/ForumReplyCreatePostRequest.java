package com.vanderlinde.rrss.dto.community.Forum;

import lombok.Data;

@Data
public class ForumReplyCreatePostRequest {

    private String title;
    private String text;
    private int replyTo ;
}
