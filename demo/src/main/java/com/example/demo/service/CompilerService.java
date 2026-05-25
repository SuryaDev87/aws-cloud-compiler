package com.example.demo.service;

import com.example.demo.dto.ExecuteRequest;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class CompilerService {

    public Map<String, String> execute(ExecuteRequest request) {
        Map<String, String> resultMap = new HashMap<>();
        String language = request.getLanguage().toLowerCase();
        
        if (!"python".equals(language)) {
            resultMap.put("output", "Error: Only 'python' is supported at this stage.");
            return resultMap;
        }

        Path tempFile = null;
        try {
            // 1. Create a temporary file on the host (EC2) system
            String prefix = "script-" + System.currentTimeMillis() + "-";
            tempFile = Files.createTempFile(prefix, ".py");
            Files.writeString(tempFile, request.getCode());

            // 2. Build the exact sandboxed Docker command
            List<String> command = Arrays.asList(
                "docker", "run", "--rm",
                "-v", tempFile.toAbsolutePath().toString() + ":/app/script.py",
                "--net", "none",
                "--memory", "128m",
                "python:3.10-slim",
                "python", "/app/script.py"
            );

            // 3. Start the process on the OS level
            ProcessBuilder pb = new ProcessBuilder(command);
            Process process = pb.start();

            // 4. Enforce a strict timeout constraint (Protects against infinite loops)
            boolean finished = process.waitFor(5, TimeUnit.SECONDS);

            if (!finished) {
                process.destroyForcibly();
                resultMap.put("output", "Timeout Error: Code execution exceeded the 5-second limit.");
                return resultMap;
            }

            // 5. Capture the output streams
            String stdout = readStream(process.getInputStream());
            String stderr = readStream(process.getErrorStream());

            if (!stderr.isEmpty()) {
                resultMap.put("output", stderr);
            } else {
                resultMap.put("output", stdout);
            }

        } catch (IOException | InterruptedException e) {
            resultMap.put("output", "Execution System Error: " + e.getMessage());
        } finally {
            // 6. Housekeeping: Always delete the temporary code file from the server disk
            if (tempFile != null) {
                try {
                    Files.deleteIfExists(tempFile);
                } catch (IOException ignored) {}
            }
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