package com.ebook.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        MimeMessage message = mailSender.createMimeMessage();
        
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("theavdeshjadon@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Libranova - Password Reset OTP");

            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;'>"
                    + "<h2 style='color: #3a5a40; text-align: center;'>Libranova Password Reset</h2>"
                    + "<p style='color: #475569; font-size: 16px;'>Hello,</p>"
                    + "<p style='color: #475569; font-size: 16px;'>You have requested to reset your password. Please use the following 6-digit OTP to complete the process:</p>"
                    + "<div style='background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;'>"
                    + "<h1 style='color: #588157; font-size: 32px; letter-spacing: 5px; margin: 0;'>" + otp + "</h1>"
                    + "</div>"
                    + "<p style='color: #475569; font-size: 14px;'>This OTP is valid for 10 minutes. Do not share it with anyone.</p>"
                    + "<hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />"
                    + "<p style='color: #94a3b8; font-size: 12px; text-align: center;'>If you did not request a password reset, please ignore this email.</p>"
                    + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("OTP email sent successfully to " + toEmail);
            
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
