package com.vanderlinde.rrss.controller;

import com.vanderlinde.rrss.dto.community.Forum.ForumCreatePostRequest;
import com.vanderlinde.rrss.dto.community.DeleteRequest;
import com.vanderlinde.rrss.dto.community.Forum.ForumReplyCreatePostRequest;
import com.vanderlinde.rrss.dto.community.Forum.ForumUpdatePostRequest;
import com.vanderlinde.rrss.dto.community.LocalCommunity.LocalCommunityCreatePostRequest;
import com.vanderlinde.rrss.dto.community.LocalCommunity.LocalCommunityCreateRequest;
import com.vanderlinde.rrss.dto.community.LocalCommunity.LocalCommunityUpdatePostRequest;
import com.vanderlinde.rrss.dto.community.LocalCommunity.LocalCommunityUpdateRequest;
import com.vanderlinde.rrss.dto.community.QA.AnswerCreateRequest;
import com.vanderlinde.rrss.dto.community.QA.QAUpdatePostRequest;
import com.vanderlinde.rrss.dto.community.QA.QuestionCreateRequest;
import com.vanderlinde.rrss.repository.ForumPostRepository;
import com.vanderlinde.rrss.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/community")
public class CommunityController {

    @Autowired
    private CommunityService communityService ;

    @PostMapping("/forum/create-post")
    public ResponseEntity<String> createForumPost(@RequestBody ForumCreatePostRequest req) {
        return communityService.createForumPost(req);
    }

    @DeleteMapping("/forum/delete-post")
    public ResponseEntity<String> deleteForumPost(@RequestBody DeleteRequest req) {
        return communityService.deleteForumPost(req);
    }

    @PostMapping("/forum/update-post")
    public ResponseEntity<String> updateForumPost(@RequestBody ForumUpdatePostRequest req) {
        return communityService.updateForumPost(req);
    }

    @GetMapping("/forum/get-forum-posts")
    public ResponseEntity<?> getForumPosts() {return communityService.getForumPosts() ;}


    @GetMapping("/forum/get-forum-post")
    public ResponseEntity<?> getForumPost(@RequestParam int postId) {

        return communityService.getForumPost(postId) ;
    }
    @PostMapping("/forum/rate-forum-post")
    public ResponseEntity<String> rateForumPost(@RequestParam ("rate") int rate,@RequestParam("postId") int postId) {
        return communityService.rateForumPost(rate,postId) ;
    }

    @PostMapping("/forum/create-reply-post")
    public ResponseEntity<String> createReplyPost(@RequestBody ForumReplyCreatePostRequest req) {
        return communityService.createForumReplyPost(req);}

    @DeleteMapping("/forum/delete-reply-post")
    public ResponseEntity<String> deleteReplyPost(@RequestBody DeleteRequest req) {
        return communityService.deleteForumReplyPost(req);
    }

    @PostMapping("/forum/update-reply-post")
    public ResponseEntity<String> updateReplyPost(@RequestBody ForumUpdatePostRequest req) {
        return communityService.updateForumReplyPost(req);
    }
    @GetMapping("/forum/get-forum-reply-post")
    public ResponseEntity<?> getForumReplyPost(@RequestParam int postId) {
        return communityService.getForumReplyPost(postId) ;
    }

    @PostMapping("/forum/rate-forum-reply-post")
    public ResponseEntity<String> rateForumReplyPost(@RequestParam ("rate") int rate,@RequestParam("postId") int postId) {
        return communityService.rateForumReplyPost(rate,postId) ;
    }

    @GetMapping("/Q&A/get-questions")
    public ResponseEntity<?> getQuestions() {
        return communityService.getQuestionPosts();
    }

    @GetMapping("/Q&A/get-question")
    public ResponseEntity<?> getQuestion(@RequestParam int questionId) {
        return communityService.getQuestion(questionId);
    }

    @PostMapping("/Q&A/create-question")
    public ResponseEntity<String> createQuestionPost(@RequestBody QuestionCreateRequest req) {
        return communityService.createQuestionPost(req) ;
    }

    @PostMapping("/Q&A/delete-question")
    public ResponseEntity<String> createQuestionPost(@RequestBody DeleteRequest req) {
        return communityService.deleteQuestionPost(req) ;
    }

    @PostMapping("/Q&A/update-question")
    public ResponseEntity<String> updateQuestionPost(@RequestBody QAUpdatePostRequest req) {
        return communityService.updateQuestionPost(req) ;
    }

    @PostMapping("/Q&A/rate-question")
    public ResponseEntity<String> rateQuestionPost(@RequestParam ("rate") int rate,@RequestParam("postId") int postId) {
        return communityService.rateQuestionPost(rate,postId) ;
    }

    @PostMapping("/Q&A/create-answer")
    public ResponseEntity<String> createAnswerPost(@RequestBody AnswerCreateRequest req) {
        return communityService.createAnswerPost(req) ;
    }

    @GetMapping("/Q&A/get-answer")
    public ResponseEntity<?> getAnswer(@RequestParam int answerId) {
        return communityService.getAnswer(answerId);
    }

    @PostMapping("/Q&A/delete-answer")
    public ResponseEntity<String> deleteAnswerPost(@RequestBody DeleteRequest req) {
        return communityService.deleteAnswerPost(req) ;
    }

    @PostMapping("/Q&A/update-answer")
    public ResponseEntity<String> updateAnswerPost(@RequestBody QAUpdatePostRequest req) {
        return communityService.updateAnswerPost(req) ;
    }

    @PostMapping("/Q&A/rate-answer")
    public ResponseEntity<String> rateAnswerPost(@RequestParam ("rate") int rate,@RequestParam("postId") int postId) {
        return communityService.rateAnswerPost(rate,postId) ;
    }

    @PostMapping("/LocalCommunities/create-local-community")
    public ResponseEntity<String> createLocalCommunity(@RequestParam("name") String name,
                                                       @RequestParam(value = "image",required = false)MultipartFile image) throws IOException {
        LocalCommunityCreateRequest req = new LocalCommunityCreateRequest() ;
        req.setName(name);
        req.setIcon(image);
        return communityService.createLocalCommunity(req) ;
    }

    @PostMapping("/LocalCommunities/delete-local-community")
    public ResponseEntity<String> deleteLocalCommunity(@RequestBody DeleteRequest req) {
        return communityService.deleteLocalCommunity(req) ;
    }

    @PostMapping("/LocalCommunities/update-local-community")
    public ResponseEntity<String> updateLocalCommunity(@RequestParam("name") String name,
                                                       @RequestParam("postId") int postId,
                                                       @RequestParam(value = "image",required = false)MultipartFile image) throws IOException {
        LocalCommunityUpdateRequest req = new LocalCommunityUpdateRequest() ;
        req.setNewName(name);
        req.setPostId(postId);
        req.setNewIcon(image);
        return communityService.updateLocalCommunity(req) ;
    }

    @GetMapping("/LocalCommunities/get-local-communities")
    public ResponseEntity<?> getLocalCommunities() {return communityService.getLocalCommunities() ;}

    @GetMapping("/LocalCommunities/get-local-community")
    public ResponseEntity<?> getLocalCommunity(@RequestParam int communityId) {
        return communityService.getLocalCommunity(communityId) ;
    }

    @GetMapping("/LocalCommunities/get-image")
    public ResponseEntity<?> getLocalCommunityImage(@RequestParam int communityId) {
        return communityService.getLocalCommunityImage(communityId);
    }

    @PostMapping("/LocalCommunities/create-local-community-post")
    public ResponseEntity<String> createLocalCommunityPost(@RequestParam("title")String title,
                                                           @RequestParam("text")String text,
                                                           @RequestParam(value = "image",required = false) MultipartFile image,
                                                           @RequestParam("fromCommunity")int fromCommunity)throws IOException {
        LocalCommunityCreatePostRequest req = new LocalCommunityCreatePostRequest() ;
        req.setTitle(title);
        req.setText(text);
        req.setImage(image);
        req.setFromCommunity(fromCommunity);
        return communityService.createLocalCommunityPost(req) ;
    }

    @PostMapping("/LocalCommunities/delete-local-community-post")
    public ResponseEntity<String> deleteLocalCommunityPost(@RequestBody DeleteRequest req) {
        return communityService.deleteLocalCommunityPost(req) ;
    }

    @PostMapping("/LocalCommunities/update-local-community-post")
    public ResponseEntity<String> updateLocalCommunityPost(@RequestParam("title")String title,
                                                           @RequestParam("text")String text,
                                                           @RequestParam("postId")int postId,
                                                           @RequestParam(value = "image",required = false) MultipartFile image
                                                           )throws IOException {
        LocalCommunityUpdatePostRequest req = new LocalCommunityUpdatePostRequest() ;
        req.setNewTitle(title);
        req.setNewText(text);
        req.setNewImage(image);
        req.setPostId(postId);
        return communityService.updateLocalCommunityPost(req) ;
    }

    @GetMapping("/LocalCommunities/get-local-community-post")
    public ResponseEntity<?> getLocalCommunityPost(@RequestParam int communityPostId) {
        return communityService.getLocalCommunityPost(communityPostId) ;
    }

    @GetMapping("/LocalCommunities/get-local-community-post-image")
    public ResponseEntity<?> getLocalCommunityPostImage(@RequestParam int communityPostId) {
        return communityService.getLocalCommunityPostImage(communityPostId);
    }

    @PostMapping("/LocalCommunities/rate-local-community-post")
    public ResponseEntity<String> rateLocalCommunityPost(@RequestParam ("rate") int rate,@RequestParam("postId") int postId) {
        return communityService.rateLocalCommunityPost(rate,postId) ;
    }

}
