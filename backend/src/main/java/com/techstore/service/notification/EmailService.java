package com.techstore.service.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("HTML Email sent successfully to {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send HTML email to {}: {}", to, e.getMessage());
        }
    }

    public void sendOrderConfirmation(String to, String orderId, String customerName, String totalAmount) {
        String subject = "Xác nhận đơn hàng #" + orderId;
        String content = String.format(
            "<html>" +
            "<body>" +
            "<h2>Chào %s,</h2>" +
            "<p>Cảm ơn bạn đã đặt hàng tại <b>Tech Store</b>!</p>" +
            "<p>Đơn hàng của bạn <b>#%s</b> đã được tiếp nhận và đang trong quá trình xử lý.</p>" +
            "<p><b>Tổng giá trị đơn hàng:</b> %s</p>" +
            "<p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao.</p>" +
            "<br/>" +
            "<p>Trân trọng,</p>" +
            "<p>Đội ngũ Tech Store</p>" +
            "</body>" +
            "</html>",
            customerName, orderId, totalAmount
        );
        sendHtmlEmail(to, subject, content);
    }
}
