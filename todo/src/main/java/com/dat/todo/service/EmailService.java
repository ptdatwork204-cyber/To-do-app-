package com.dat.todo.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    private final String API_KEY =
        "re_VXq18aE2_DWmXTssCic928dey7qfEWJG7";

    public void sendReminder(
        String to,
        String taskTitle,
        String dueDate
    ) {

        RestTemplate restTemplate =
            new RestTemplate();

        String url =
            "https://api.resend.com/emails";

        HttpHeaders headers =
            new HttpHeaders();

        headers.setContentType(
            MediaType.APPLICATION_JSON
        );

        headers.setBearerAuth(API_KEY);

        Map<String, Object> body =
            new HashMap<>();

        body.put(
            "from",
            "onboarding@resend.dev"
        );

        body.put("to", to);

        body.put(
            "subject",
            "Todo Reminder"
        );

        body.put(
            "html",
            "<h2>Reminder</h2>" +
            "<p>Your task <b>" +
            taskTitle +
            "</b> is due at " +
            dueDate +
            "</p>"
        );

        HttpEntity<Map<String, Object>>
            request =
            new HttpEntity<>(body, headers);

        restTemplate.postForEntity(
            url,
            request,
            String.class
        );
    }
}