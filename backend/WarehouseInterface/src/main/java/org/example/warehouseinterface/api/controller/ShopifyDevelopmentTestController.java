package org.example.warehouseinterface.api.controller;

import org.example.warehouseinterface.api.model.BaxterBox;
import org.example.warehouseinterface.service.ShopifyDevelopmentTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.http.HttpResponse;

@RestController
public class ShopifyDevelopmentTestController {

    private ShopifyDevelopmentTestService service;

    @Autowired
    public ShopifyDevelopmentTestController(ShopifyDevelopmentTestService service) {
        this.service = service;
    }

    @GetMapping("/ShopifyDevTest")
    public String getAllProducts() {
        try {
            return "testing";
        } catch (Exception e) {
            // Log the exception (optional)
            e.printStackTrace();
            // Return an appropriate error response
            return null;
        }
    }

}