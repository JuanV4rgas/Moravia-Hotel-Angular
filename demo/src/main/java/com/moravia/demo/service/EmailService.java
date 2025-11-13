package com.moravia.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendConfirmationEmail(String toEmail, String nombre) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Bienvenido a The Moravia Hotel - Confirmación de Registro");
        message.setText("Hola " + nombre + ",\n\n" +
                "¡Gracias por registrarte en The Moravia Hotel!\n\n" +
                "Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión y disfrutar de nuestros servicios.\n\n" +
                "Si tienes alguna pregunta, no dudes en contactarnos.\n\n" +
                "Saludos,\n" +
                "Equipo de The Moravia Hotel");

        mailSender.send(message);
    }
}