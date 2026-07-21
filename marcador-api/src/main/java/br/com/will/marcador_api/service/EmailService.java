package br.com.will.marcador_api.service;

import br.com.will.marcador_api.exception.BadRequestException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Recuperação de Senha - Marcador API");

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #4F46E5;">Recuperação de Senha</h2>
                    <p>Você solicitou a redefinição de senha para a sua conta.</p>
                    <p>Clique no botão abaixo para cadastrar uma nova senha (este link expira em <strong>15 minutos</strong>):</p>
                    <div style="margin: 24px 0;">
                        <a href="%s" style="background-color: #4F46E5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Redefinir Senha</a>
                    </div>
                    <p style="font-size: 0.85em; color: #666;">Se você não solicitou isso, basta ignorar este e-mail.</p>
                </div>
                """.formatted(resetLink);

            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new BadRequestException("Falha ao enviar e-mail de recuperação de senha.");
        }
    }

}
