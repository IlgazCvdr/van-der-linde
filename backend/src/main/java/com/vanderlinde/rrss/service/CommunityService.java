package com.vanderlinde.rrss.service;

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
import com.vanderlinde.rrss.model.*;
import com.vanderlinde.rrss.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityService {

    @Autowired
    private ForumPostRepository forumPostRepository;

    @Autowired
    private ForumReplyPostRepository forumReplyPostRepository;

    @Autowired
    private QuestionRepository questionRepository ;

    @Autowired
    private AnswerRepository answerRepository ;

    @Autowired
    private CommunityRepository communityRepository ;

    @Autowired
    private LocalCommunityPostRepository localCommunityPostRepository ;

    @Autowired
    private UserRepository userRepository ;

    public ResponseEntity<String> createForumPost(@RequestBody ForumCreatePostRequest req) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        ForumPost newPost = new ForumPost(req.getTitle(), req.getText(), user.get());
        forumPostRepository.save(newPost);
        return ResponseEntity.ok("Forum Post created successfully");
    }

    public ResponseEntity<String> createForumReplyPost(@RequestBody ForumReplyCreatePostRequest req) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        ForumReplyPost newPost = new ForumReplyPost(req.getTitle(), req.getText(), user.get());

        Optional<ForumPost> optionalForumPost = forumPostRepository.findById(req.getReplyTo()) ;
        if (optionalForumPost.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found") ;

        newPost.setReplyTo(optionalForumPost.get());
        forumReplyPostRepository.save(newPost);
        return ResponseEntity.ok("Forum Reply post created successfully");
    }

    public ResponseEntity<String> createQuestionPost(@RequestBody QuestionCreateRequest req) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        QuestionPost newPost = new QuestionPost(req.getTitle(), req.getText(), user.get());
        questionRepository.save(newPost);
        return ResponseEntity.ok("Question Post created successfully");
    }

    public ResponseEntity<?> getForumPosts(){
        List<ForumPost> forumPosts = forumPostRepository.findAll();
        return ResponseEntity.ok(forumPosts);
    }

    public ResponseEntity<?> getQuestionPosts(){
        List<QuestionPost> questions = questionRepository.findAll();
        return ResponseEntity.ok(questions);
    }

    public ResponseEntity<?> getLocalCommunities(){
        List<LocalCommunity> localCommunities = communityRepository.findAll();
        return ResponseEntity.ok(localCommunities);
    }

    public ResponseEntity<?> getQuestion(@RequestParam int questionId){
        Optional<QuestionPost> optionalQuestion = questionRepository.findById(questionId);
        if(optionalQuestion.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found");
        return ResponseEntity.ok(optionalQuestion.get());
    }

    public ResponseEntity<String> createAnswerPost(@RequestBody AnswerCreateRequest req) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        AnswerPost newPost = new AnswerPost(req.getTitle(), req.getText(), user.get());

        Optional<QuestionPost> optionalQuestionPost = questionRepository.findById(req.getAnswerTo()) ;
        if (optionalQuestionPost.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found") ;

        newPost.setAnswerTo(optionalQuestionPost.get());
        answerRepository.save(newPost);
        return ResponseEntity.ok("Answer post created successfully");
    }

    public ResponseEntity<?> getAnswer(@RequestParam int answerId){
        Optional<AnswerPost> optionalAnswer = answerRepository.findById(answerId);
        if(optionalAnswer.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Answer post found") ;
        AnswerPost answerPost = optionalAnswer.get() ;
        return ResponseEntity.ok(answerPost);
    }

    public ResponseEntity<String> createLocalCommunity(LocalCommunityCreateRequest req) throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");

        LocalCommunity newCommunity = new LocalCommunity(req.getName()) ;

        if (req.getIcon() != null && !req.getIcon().isEmpty()) {
            newCommunity.setIcon(req.getIcon().getBytes());
        }

        communityRepository.save(newCommunity);
        return ResponseEntity.ok("Community created successfully");

    }

    public ResponseEntity<String> createLocalCommunityPost(LocalCommunityCreatePostRequest req) throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        if(user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");

        LocalCommunityPost newCommunityPost = new LocalCommunityPost(req.getTitle(),req.getText(),user.get()) ;

        if (req.getImage() != null && !req.getImage().isEmpty()) {
            newCommunityPost.setImage(req.getImage().getBytes());
        }

        Optional<LocalCommunity> optionalCommunity = communityRepository.findById(req.getFromCommunity()) ;

        if (optionalCommunity.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Community not found") ;
        newCommunityPost.setFromCommunity(optionalCommunity.get());

        localCommunityPostRepository.save(newCommunityPost);
        return ResponseEntity.ok("Local Community post created successfully");

    }

    public ResponseEntity<String> deleteForumPost(@RequestBody DeleteRequest req) {

        Optional<ForumPost> optionalPost = forumPostRepository.findById(req.getDeleteId()) ;
        if (optionalPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No forum post found") ;

        forumPostRepository.deleteById(req.getDeleteId());
        return ResponseEntity.ok("Forum post deleted successfully");
    }

    public ResponseEntity<String>deleteForumReplyPost(@RequestBody DeleteRequest req) {

        Optional<ForumReplyPost> optionalPost = forumReplyPostRepository.findById(req.getDeleteId()) ;
        if (optionalPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No forum reply post  found") ;

        forumReplyPostRepository.deleteById(req.getDeleteId());
        return ResponseEntity.ok("Forum reply post deleted successfully");
    }

    public ResponseEntity<String>deleteQuestionPost(@RequestBody DeleteRequest req) {

        Optional<QuestionPost> optionalPost = questionRepository.findById(req.getDeleteId()) ;
        if (optionalPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Question Post found") ;

        questionRepository.deleteById(req.getDeleteId());
        return ResponseEntity.ok("Question Post deleted successfully");
    }

    public ResponseEntity<String>deleteAnswerPost(@RequestBody DeleteRequest req) {

        Optional<AnswerPost> optionalPost = answerRepository.findById(req.getDeleteId()) ;
        if (optionalPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Answer post found") ;

        answerRepository.deleteById(req.getDeleteId());
        return ResponseEntity.ok("Answer post deleted successfully");
    }

    public ResponseEntity<String>deleteLocalCommunity(@RequestBody DeleteRequest req) {

        Optional<LocalCommunity> optionalCommunity = communityRepository.findById(req.getDeleteId()) ;
        if (optionalCommunity.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Community found") ;

        communityRepository.deleteById(req.getDeleteId());
        return ResponseEntity.ok("Community deleted successfully");

    }

    public ResponseEntity<String>deleteLocalCommunityPost(@RequestBody DeleteRequest req) {

        Optional<LocalCommunityPost> optionalCommunityPost = localCommunityPostRepository.findById(req.getDeleteId()) ;
        if (optionalCommunityPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Local Community post found") ;

        localCommunityPostRepository.deleteById(req.getDeleteId());
        return ResponseEntity.ok("Local Community post deleted successfully");

    }

    public ResponseEntity<String> updateForumPost(@RequestBody ForumUpdatePostRequest req) {

        Optional<ForumPost> optionalFormPost = forumPostRepository.findById(req.getPostId()) ;

        if (optionalFormPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No post found") ;

        ForumPost forumPost = optionalFormPost.get() ;
        forumPost.setTitle(req.getNewTitle());
        forumPost.setText(req.getNewText());

        forumPostRepository.save(forumPost) ;
        return ResponseEntity.ok("Forum Post updated successfully");
    }

    public ResponseEntity<String> updateForumReplyPost(@RequestBody ForumUpdatePostRequest req) {

        Optional<ForumReplyPost> optionalFormPost = forumReplyPostRepository.findById(req.getPostId()) ;

        if (optionalFormPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No reply post found") ;

        ForumReplyPost forumReplyPost = optionalFormPost.get() ;
        forumReplyPost.setTitle(req.getNewTitle());
        forumReplyPost.setText(req.getNewText());

        forumReplyPostRepository.save(forumReplyPost) ;
        return ResponseEntity.ok("Forum Reply post updated successfully");
    }

    public ResponseEntity<String> updateQuestionPost(@RequestBody QAUpdatePostRequest req) {

        Optional<QuestionPost> optionalQuestionPost = questionRepository.findById(req.getPostId()) ;
        if (optionalQuestionPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Question post found") ;

        QuestionPost questionPost = optionalQuestionPost.get() ;
        questionPost.setTitle(req.getNewTitle());
        questionPost.setText(req.getNewText());

        questionRepository.save(questionPost) ;
        return ResponseEntity.ok("Question post updated successfully");
    }

    public ResponseEntity<String> updateAnswerPost(@RequestBody QAUpdatePostRequest req) {

        Optional<AnswerPost> optionalAnswerPost = answerRepository.findById(req.getPostId()) ;

        if (optionalAnswerPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Answer post found") ;

        AnswerPost answerPost = optionalAnswerPost.get() ;
        answerPost.setTitle(req.getNewTitle());
        answerPost.setText(req.getNewText());

        answerRepository.save(answerPost) ;
        return ResponseEntity.ok("Answer post updated successfully");
    }

    public ResponseEntity<String> updateLocalCommunity(LocalCommunityUpdateRequest req) throws IOException {

        Optional<LocalCommunity> optionaCommunity = communityRepository.findById(req.getPostId()) ;
        if (optionaCommunity.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Community found") ;

        LocalCommunity community = optionaCommunity.get() ;
        community.setName(req.getNewName());

        if (req.getNewIcon() != null && !req.getNewIcon().isEmpty()) {
            community.setIcon(req.getNewIcon().getBytes());}

        communityRepository.save(community) ;
        return ResponseEntity.ok("Local Community updated successfully");

    }

    public ResponseEntity<String> updateLocalCommunityPost(LocalCommunityUpdatePostRequest req) throws IOException {

        Optional<LocalCommunityPost> optionaCommunityPost = localCommunityPostRepository.findById(req.getPostId()) ;
        if (optionaCommunityPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Local Community post found") ;

        LocalCommunityPost communityPost = optionaCommunityPost.get() ;
        communityPost.setTitle(req.getNewTitle());
        communityPost.setText(req.getNewText());

        if (req.getNewImage() != null && !req.getNewImage().isEmpty()) {
            communityPost.setImage(req.getNewImage().getBytes());}

        localCommunityPostRepository.save(communityPost) ;
        return ResponseEntity.ok("Local Community post updated successfully");

    }

    public ResponseEntity<?> getForumPost(int postId) {

        Optional<ForumPost> optionalForumPost = forumPostRepository.findById(postId) ;
        if (optionalForumPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Forum post found") ;
        return ResponseEntity.ok(optionalForumPost.get()) ;

    }

    public ResponseEntity<?> getForumReplyPost(int postId) {

        Optional<ForumReplyPost> optionalForumReplyPost = forumReplyPostRepository.findById(postId) ;
        if (optionalForumReplyPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Forum Reply post found") ;
        return ResponseEntity.ok(optionalForumReplyPost.get()) ;

    }

    public ResponseEntity<?> getLocalCommunity(int communityId) {

        Optional<LocalCommunity> optionalLocalCommunity = communityRepository.findById(communityId) ;
        if (optionalLocalCommunity.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Community found") ;
        return ResponseEntity.ok(optionalLocalCommunity.get()) ;

    }

    public ResponseEntity<?> getLocalCommunityPost(int communityPostId) {

        Optional<LocalCommunityPost> optionalLocalCommunityPost = localCommunityPostRepository.findById(communityPostId) ;
        if (optionalLocalCommunityPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Local Community Post found") ;
        return ResponseEntity.ok(optionalLocalCommunityPost.get()) ;

    }


    public ResponseEntity<String> rateForumPost(int rate, int postId) {

        Optional<ForumPost> optionalForumPost = forumPostRepository.findById(postId) ;
        if (optionalForumPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Forum post found") ;
        ForumPost forumPost = optionalForumPost.get() ;

        float newRating = forumPost.getRating() + rate ;

        forumPost.setRating(newRating);
        forumPostRepository.save(forumPost) ;

        return ResponseEntity.ok("Forum Post rated successfully");
    }

    public ResponseEntity<String> rateForumReplyPost(int rate, int postId) {

        Optional<ForumReplyPost> optionalForumPost = forumReplyPostRepository.findById(postId) ;
        if (optionalForumPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Forum Reply post found") ;
        ForumReplyPost forumReplyPost = optionalForumPost.get() ;

        float newRating = forumReplyPost.getRating() + rate ;

        forumReplyPost.setRating(newRating);
        forumReplyPostRepository.save(forumReplyPost) ;

        return ResponseEntity.ok("Forum Reply Post rated successfully");
    }

    public ResponseEntity<String> rateQuestionPost(int rate, int postId) {

        Optional<QuestionPost> optionalQuestionPost = questionRepository.findById(postId) ;
        if (optionalQuestionPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Question post found") ;
        QuestionPost questionPost = optionalQuestionPost.get() ;

        float newRating = questionPost.getRating() + rate ;

        questionPost.setRating(newRating);
        questionRepository.save(questionPost) ;

        return ResponseEntity.ok("Question Post rated successfully");
    }

    public ResponseEntity<String> rateAnswerPost(int rate, int postId) {

        Optional<AnswerPost> optionalAnswerPost = answerRepository.findById(postId) ;
        if (optionalAnswerPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Answer post found") ;
        AnswerPost answerPost = optionalAnswerPost.get() ;

        float newRating = answerPost.getRating() + rate ;

        answerPost.setRating(newRating);
        answerRepository.save(answerPost) ;

        return ResponseEntity.ok("Answer Post rated successfully");
    }

    public ResponseEntity<String> rateLocalCommunityPost(int rate, int postId) {

        Optional<LocalCommunityPost> optionalLocalCommunityPost = localCommunityPostRepository.findById(postId) ;
        if (optionalLocalCommunityPost.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Local Community post found");
        LocalCommunityPost localCommunityPost = optionalLocalCommunityPost.get();

        float newRating = localCommunityPost.getRating() + rate;

        localCommunityPost.setRating(newRating);
        localCommunityPostRepository.save(localCommunityPost);

        return ResponseEntity.ok("Local Community Post rated successfully");
    }

    public ResponseEntity<?> getLocalCommunityImage(@RequestParam int communityId){
        Optional<LocalCommunity> optionalCommunity = communityRepository.findById(communityId);
        if(optionalCommunity.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Local Community found");
        byte[] image = optionalCommunity.get().getIcon();
        if(image == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Image found");
        return ResponseEntity.ok(image);
    }

    public ResponseEntity<?> getLocalCommunityPostImage(@RequestParam int communityPostId){
        Optional<LocalCommunityPost> optionalLocalCommunityPost = localCommunityPostRepository.findById(communityPostId);
        if(optionalLocalCommunityPost.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Local Community post found");
        byte[] image = optionalLocalCommunityPost.get().getImage();
        if(image == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Image found");
        return ResponseEntity.ok(image);
    }
}
