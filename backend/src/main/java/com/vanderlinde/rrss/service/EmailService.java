package com.vanderlinde.rrss.service;

import com.vanderlinde.rrss.model.PasswordRequestEntity;
import com.vanderlinde.rrss.repository.PasswordRequestRepository;
import com.vanderlinde.rrss.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmailService {

    @Autowired
    private PasswordRequestRepository passwordRequestRepository;

    private final JavaMailSender mailSender;
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    public void sendEmail(int id, String subject, String text) {

        Optional<PasswordRequestEntity> passwordRequest = passwordRequestRepository.findById(id);
        if(passwordRequest.isEmpty()) return;
        String to = passwordRequest.get().getEmail();

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("rrss.server@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText("New Password:\t" + text);

        mailSender.send(message);
    }
}
