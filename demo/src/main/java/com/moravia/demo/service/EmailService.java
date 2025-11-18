package com.moravia.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final boolean mailEnabled;

    public EmailService(
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${mail.notifications.enabled:false}") boolean mailEnabled) {
        this.mailSender = mailSenderProvider.getIfAvailable();
        this.mailEnabled = mailEnabled;
    }

    public void sendConfirmationEmail(String toEmail, String nombre) {
        if (!mailEnabled || mailSender == null) {
            logger.info(
                    "Saltando envío de correo para {}: servicio de correo deshabilitado o no configurado.",
                    toEmail);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Bienvenido a The Moravia Hotel - Confirmacion de Registro");
        message.setText("Hola " + nombre + ",\n\n" +
                "Gracias por registrarte en The Moravia Hotel!\n\n" +
                "Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesion y disfrutar de nuestros servicios.\n\n" +
                "Si tienes alguna pregunta, no dudes en contactarnos.\n\n" +
                "Saludos,\n" +
                "Equipo de The Moravia Hotel");

        mailSender.send(message);
    }
}
