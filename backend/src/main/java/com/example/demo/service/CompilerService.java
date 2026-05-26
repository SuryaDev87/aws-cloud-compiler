package com.example.demo.service;

import com.example.demo.dto.ExecuteRequest;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class CompilerService {

    public Map<String, String> execute(ExecuteRequest request) {
        Map<String, String> resultMap = new HashMap<>();
        String language = request.getLanguage().toLowerCase();
        
        List<String> command;

        // 1. Configure the sandboxed container command based on the requested language
        if ("python".equals(language)) {
            command = Arrays.asList(
                "docker", "run", "--rm",
                "-i",                  // Interactive: read from STDIN
                "--net", "none",       // Sandbox: block network access
                "--memory", "128m",    // Limit memory usage
                "python:3.10-slim",
                "python", "-"          // Run python directly from standard input stream
            );
        } else if ("java".equals(language)) {
            command = Arrays.asList(
                "docker", "run", "--rm",
                "-i",                  // Interactive: read from STDIN
                "--net", "none",       // Sandbox: block network access
                "--memory", "512m",    // JVM needs slightly more memory allocation to compile
                "amazoncorretto:21-alpine", 
                "sh", "-c", "cat > Main.java && javac Main.java && java Main"
                // Takes STDIN code, writes it to Main.java internally, compiles it, and runs it
            );
        } else if ("cpp".equals(language) || "c++".equals(language)) {
            command = Arrays.asList(
                "docker", "run", "--rm",
                "-i",                  // Interactive: read from STDIN
                "--net", "none",       // Sandbox: block network access
                "--memory", "256m",    // Limit memory usage
                "frolvlad/alpine-gxx", // Lightweight image containing gcc/g++ compilers
                "sh", "-c", "cat > main.cpp && g++ main.cpp -o main && ./main" 
                // Takes STDIN code, writes it to main.cpp internally, compiles it, and runs it
            );
        } else {
            resultMap.put("output", "Error: Unsupported language '" + language + "'. Only Python, Java, and C++ are supported.");
            return resultMap;
        }

        try {
            // 2. Start the chosen container process
            ProcessBuilder pb = new ProcessBuilder(command);
            Process process = pb.start();

            // 3. Stream the raw user code straight into the container's standard input
            try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
                writer.write(request.getCode());
                writer.flush();
            }

            // 4. Enforce strict execution timeout limits (Protects against infinite loops)
            boolean finished = process.waitFor(10, TimeUnit.SECONDS);

            if (!finished) {
                process.destroyForcibly();
                resultMap.put("output", "Timeout Error: Code execution exceeded the 10-second limit.");
                return resultMap;
            }

            // 5. Capture outputs from the process execution
            String stdout = readStream(process.getInputStream());
            String stderr = readStream(process.getErrorStream());

            if (!stderr.isEmpty()) {
                resultMap.put("output", stderr);
            } else {
                resultMap.put("output", stdout);
            }

        } catch (IOException | InterruptedException e) {
            resultMap.put("output", "Execution System Error: " + e.getMessage());
        }

        return resultMap;
    }

    private String readStream(InputStream is) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
        }
        return sb.toString().trim();
    }
}