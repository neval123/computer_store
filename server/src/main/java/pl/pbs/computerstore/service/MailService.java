package pl.pbs.computerstore.service;

public interface MailService {
    void sendOrderStatusInformation(String to, String subject, String text);
}
