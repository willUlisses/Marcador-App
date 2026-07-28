package br.com.will.marcador_api.service;

import br.com.will.marcador_api.exception.BadRequestException;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTests {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    public void setUp() {
        mimeMessage = new MimeMessage((Session) null);
    }

    @Nested
    @DisplayName("Send Password Reset Email Tests")
    class SendPasswordResetEmailTests {

        @Test
        @DisplayName("Must succesfully build and send password reset email")
        void sendPasswordResetEmail_Success() {
            String toEmail = "test@email.com";
            String resetLink = "http://localhost:5173/reset-password?token=xyz123";

            Mockito.when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

            emailService.sendPasswordResetEmail(toEmail, resetLink);

            ArgumentCaptor<MimeMessage> messageCaptor = ArgumentCaptor.forClass(MimeMessage.class);
            Mockito.verify(mailSender, Mockito.times(1)).send(messageCaptor.capture());

            MimeMessage message = messageCaptor.getValue();
            Assertions.assertNotNull(message);
        }

        @Test
        @DisplayName("Should throw BadRequestException when JavaMailSender fails to send email")
        void sendPasswordResetEmail_MessagingException() {
            String toEmail = "test@emailcom";
            String resetLink = "http://localhost:5173/reset-password?token=xyz123";

            Mockito.when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

            Mockito.doThrow(new MailSendException("SMTP Connection failed"))
                    .when(mailSender).send(Mockito.any(MimeMessage.class));

            BadRequestException exception = Assertions.assertThrows(
                    BadRequestException.class,
                    () -> emailService.sendPasswordResetEmail(toEmail, resetLink)
            );

            Assertions.assertEquals("Falha ao enviar e-mail de recuperação de senha.", exception.getMessage());
        }

    }
}
