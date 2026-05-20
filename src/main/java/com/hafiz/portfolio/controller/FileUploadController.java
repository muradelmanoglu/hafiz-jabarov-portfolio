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
import java.util.Set;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FileUploadController {

    private final UploadedFileRepository uploadedFileRepository;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "application/pdf"
    );
    private static final int MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

    @PostMapping("/admin/upload")
    public ResponseEntity<ApiResponse<String>> upload(@RequestBody Map<String, String> body) {
        String base64Data = body.get("data");
        String contentType = body.getOrDefault("contentType", "application/octet-stream");
        String originalName = body.getOrDefault("name", "file");

        if (base64Data == null || base64Data.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No file data provided"));
        }

        if (!ALLOWED_TYPES.contains(contentType)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("File type not allowed. Allowed: JPEG, PNG, GIF, WebP, SVG, PDF"));
        }

        String base64 = base64Data.contains(",") ? base64Data.substring(base64Data.indexOf(',') + 1) : base64Data;

        if (base64.length() > (long) MAX_FILE_SIZE_BYTES * 4 / 3 + 100) {
            return ResponseEntity.badRequest().body(ApiResponse.error("File exceeds 10MB size limit"));
        }

        byte[] decoded;
        try {
            decoded = Base64.getDecoder().decode(base64);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid file data"));
        }

        if (decoded.length > MAX_FILE_SIZE_BYTES) {
            return ResponseEntity.badRequest().body(ApiResponse.error("File exceeds 10MB size limit"));
        }

        String safeName = originalName.replaceAll("[^a-zA-Z0-9._\\-]", "_");
        if (safeName.isBlank()) safeName = "file";

        UploadedFile file = UploadedFile.builder()
                .originalName(safeName)
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
                    try {
                        String data = file.getBase64Data();
                        String base64 = data.contains(",") ? data.substring(data.indexOf(',') + 1) : data;
                        byte[] bytes = Base64.getDecoder().decode(base64);
                        String safeName = file.getOriginalName().replaceAll("[^a-zA-Z0-9._\\-]", "_");
                        return ResponseEntity.ok()
                                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + safeName + "\"")
                                .contentType(MediaType.parseMediaType(file.getContentType()))
                                .body(bytes);
                    } catch (Exception e) {
                        return ResponseEntity.<byte[]>status(500).build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
