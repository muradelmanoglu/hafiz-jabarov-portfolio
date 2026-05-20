package com.hafiz.portfolio.controller;

import com.hafiz.portfolio.dto.response.ApiResponse;
import com.hafiz.portfolio.entity.UploadedFile;
import com.hafiz.portfolio.repository.UploadedFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FileUploadController {

    private final UploadedFileRepository uploadedFileRepository;

    @PostMapping("/admin/upload")
    public ResponseEntity<ApiResponse<String>> upload(@RequestBody Map<String, String> body) {
        String base64Data = body.get("data");
        String contentType = body.getOrDefault("contentType", "application/octet-stream");
        String originalName = body.getOrDefault("name", "file");

        if (base64Data == null || base64Data.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No file data provided"));
        }

        UploadedFile file = UploadedFile.builder()
                .originalName(originalName)
                .contentType(contentType)
                .base64Data(base64Data)
                .build();

        UploadedFile saved = uploadedFileRepository.save(file);
        return ResponseEntity.ok(ApiResponse.success("/api/uploads/" + saved.getId()));
    }

    @GetMapping("/uploads/{id}")
    public ResponseEntity<byte[]> serve(@PathVariable Long id) {
        return uploadedFileRepository.findById(id)
                .map(file -> {
                    String data = file.getBase64Data();
                    // Strip data URL prefix if present (data:image/png;base64,...)
                    String base64 = data.contains(",") ? data.substring(data.indexOf(',') + 1) : data;
                    byte[] bytes = Base64.getDecoder().decode(base64);
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getOriginalName() + "\"")
                            .contentType(MediaType.parseMediaType(file.getContentType()))
                            .body(bytes);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
