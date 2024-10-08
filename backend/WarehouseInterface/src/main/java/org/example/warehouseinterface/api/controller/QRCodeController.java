package org.example.warehouseinterface.api.controller;

import org.example.warehouseinterface.service.QRCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class QRCodeController {

    private QRCodeService service;

    @Autowired
    public QRCodeController(QRCodeService service) {
        this.service = service;
    }

    @GetMapping("/linkToSku")
    public String convertQRToSku(@RequestParam String link) {
        try {
            return service.findSku(link);
        } catch (Exception e) {
            // Log the exception (optional)
            e.printStackTrace();
            // Return an appropriate error response
            return null;
        }
    }
}
