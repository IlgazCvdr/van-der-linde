package com.vanderlinde.rrss.dto.community.QA;

import lombok.Data;

@Data
public class AnswerCreateRequest {

    private String title;
    private String text;
    private int answerTo ;
}
