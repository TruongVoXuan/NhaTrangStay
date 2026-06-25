package com.truongvx64cntt.nhatrangstay.service;

import java.io.IOException;
import java.util.UUID;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class SupabaseStorageService {

        @Value("${supabase.url:}")
        private String supabaseUrl;

        @Value("${supabase.key:}")
        private String supabaseKey;

        @Value("${supabase.service-key:}")
        private String supabaseServiceKey;

        @Value("${supabase.bucket:}")
        private String bucket;

        private final RestTemplate restTemplate = new RestTemplate();

        // TEST NGAY KHI APP START
        @PostConstruct
        public void init() {
                System.out.println(" SUPABASE URL (INIT) = " + supabaseUrl);
                System.out.println(" SUPABASE KEY (INIT) = " + (supabaseKey != null ? "OK" : "NULL"));
                System.out.println(" BUCKET (INIT) = " + bucket);

                if (supabaseUrl.isBlank() || supabaseKey.isBlank() || bucket.isBlank()) {
                        throw new RuntimeException(" Supabase config missing! Check application.properties");
                }
        }

        public String uploadFile(MultipartFile file) throws IOException {

                System.out.println(" SUPABASE URL = " + supabaseUrl);
                System.out.println(" BUCKET = " + bucket);

                String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();

                String uploadUrl = supabaseUrl + "/storage/v1/object/"
                                + bucket + "/" + fileName;

                System.out.println(" UPLOAD URL = " + uploadUrl);

                HttpHeaders headers = new HttpHeaders();
                headers.set("apikey", supabaseKey);
                headers.set("Authorization", "Bearer " + supabaseKey);
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

                HttpEntity<byte[]> request = new HttpEntity<>(file.getBytes(), headers);

                try {
                        restTemplate.exchange(uploadUrl, HttpMethod.POST, request, String.class);
                        System.out.println(" Upload success");

                } catch (Exception e) {
                        System.out.println(" REAL ERROR: " + e.getMessage());
                        e.printStackTrace();
                        throw e;
                }

                return supabaseUrl + "/storage/v1/object/public/"
                                + bucket + "/" + fileName;
        }

        // Delete Image
        public void deleteFile(String fileUrl) {
                String marker = "/object/public/";
                int idx = fileUrl.indexOf(marker);
                if (idx == -1)
                        return;

                String fullPath = fileUrl.substring(idx + marker.length());
                String deleteUrl = supabaseUrl + "/storage/v1/object/" + fullPath;

                System.out.println(" DELETE URL = " + deleteUrl); // ← thêm

                HttpHeaders headers = new HttpHeaders();
                headers.set("apikey", supabaseServiceKey);
                headers.set("Authorization", "Bearer " + supabaseServiceKey);

                HttpEntity<Void> request = new HttpEntity<>(headers);

                try { // ← bọc try-catch để thấy lỗi thật
                        restTemplate.exchange(deleteUrl, HttpMethod.DELETE, request, String.class);
                        System.out.println(" Delete success");
                } catch (Exception e) {
                        System.out.println(" DELETE ERROR: " + e.getMessage());
                        e.printStackTrace();
                        throw new RuntimeException("Delete image failed: " + e.getMessage());
                }
        }
}