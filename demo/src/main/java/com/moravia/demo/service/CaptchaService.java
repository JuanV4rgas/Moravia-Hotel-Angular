package com.moravia.demo.service;

import com.moravia.demo.dto.response.CaptchaResponse;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class CaptchaService {

    private static final Logger logger = LoggerFactory.getLogger(CaptchaService.class);

    private final RestTemplate restTemplate;
    private final String secretKey;
    private final String verifyUrl;
    private final float scoreThreshold;

    public CaptchaService(
            RestTemplateBuilder restTemplateBuilder,
            @Value("${google.recaptcha.secret:}") String secretKey,
            @Value("${google.recaptcha.verify-url:https://www.google.com/recaptcha/api/siteverify}") String verifyUrl,
            @Value("${google.recaptcha.score-threshold:0.5}") float scoreThreshold) {
        this.restTemplate = restTemplateBuilder.build();
        this.secretKey = secretKey;
        this.verifyUrl = verifyUrl;
        this.scoreThreshold = scoreThreshold;
    }

    public boolean verifyToken(String token, String clientIp) {
        if (!StringUtils.hasText(secretKey)) {
            logger.error("Google reCAPTCHA secret key is not configured. Denying request.");
            return false;
        }
        if (!StringUtils.hasText(token)) {
            logger.warn("Captcha token is empty");
            return false;
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("secret", secretKey);
            body.add("response", token);
            if (StringUtils.hasText(clientIp)) {
                body.add("remoteip", clientIp);
            }

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<CaptchaResponse> captchaResponse = restTemplate.postForEntity(
                    verifyUrl,
                    request,
                    CaptchaResponse.class);

            return Optional.ofNullable(captchaResponse.getBody())
                    .map(response -> {
                        if (!response.isSuccess()) {
                            logger.warn("Captcha verification failed: {}", response.getErrorCodes());
                            return false;
                        }
                        Float score = response.getScore();
                        if (score == null) {
                            // reCAPTCHA v2 no incluye score; confiar en success
                            return true;
                        }
                        boolean result = score >= scoreThreshold;
                        if (!result) {
                            logger.warn(
                                    "Captcha score below threshold. Score={}, required={}",
                                    score,
                                    scoreThreshold);
                        }
                        return result;
                    })
                    .orElse(false);
        } catch (RestClientException ex) {
            logger.error("Error while verifying captcha", ex);
            return false;
        }
    }
}
