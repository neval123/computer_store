package pl.pbs.computerstore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService{
    @Autowired
    private JavaMailSender emailSender;
    @Override
    public void sendOrderStatusInformation(String recipient, String subject, String text) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("sklep@gmail.com");
            message.setTo(recipient);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
    }
}
