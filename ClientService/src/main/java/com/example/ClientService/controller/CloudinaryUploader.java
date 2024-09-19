package com.example.ClientService.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CloudinaryUploader {
    @Autowired
    private Cloudinary cloudinary;


    public List<String> uploadImage(File imageFile) throws IOException {
        List<String> imageUrls = new ArrayList<>();

        Map<String, Object> uploadResult = cloudinary.uploader().upload(imageFile, ObjectUtils.emptyMap());
        String imageUrl = (String) uploadResult.get("secure_url");
        imageUrls.add(imageUrl);

        return imageUrls;
    }
}
