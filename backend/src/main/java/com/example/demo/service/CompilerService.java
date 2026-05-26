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
        
        if (!"python".equals(language)) {
            resultMap.put("output", "Error: Only 'python' is supported at this stage.");
            return resultMap;
        }

        try {
            // 1. Build a docker command that reads from standard input (-i)
            // Notice: No file mounts (-v) are used here!
            List<String> command = Arrays.asList(
                "docker", "run", "--rm",
                "-i",                  // Interactive mode: allows us to stream code to STDIN
                "--net", "none",       // Secure sandbox: block network access
                "--memory", "128m",    // Limit memory usage
                "python:3.10-slim",
                "python", "-"          // Tell Python to execute code directly from standard input
            );

            // 2. Start the process on the OS level
            ProcessBuilder pb = new ProcessBuilder(command);
            Process process = pb.start();

            // 3. Write the user's code straight into the container's standard input stream
            try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
                writer.write(request.getCode());
                writer.flush();
            }

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