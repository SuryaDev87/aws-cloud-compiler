package com.example.demo.controller;

import com.example.demo.dto.ExecuteRequest;
import com.example.demo.service.CompilerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CompilerController {

    @Autowired
    private CompilerService compilerService;

    @PostMapping("/compile")
    public ResponseEntity<Map<String, String>> compileCode(@RequestBody ExecuteRequest request) {
        // Delegate execution to our new sandboxed compiler service
        Map<String, String> executionResult = compilerService.execute(request);
        return ResponseEntity.ok(executionResult);
    }
}