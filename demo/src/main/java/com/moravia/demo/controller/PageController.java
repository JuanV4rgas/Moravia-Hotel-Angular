package com.moravia.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/historia")
    public String historia() {
        return "historia";
    }

}
