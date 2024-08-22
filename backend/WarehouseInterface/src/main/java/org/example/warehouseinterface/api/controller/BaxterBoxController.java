package org.example.warehouseinterface.api.controller;

import org.example.warehouseinterface.api.model.BaxterBox;
import org.example.warehouseinterface.service.BaxterBoxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BaxterBoxController {

    private BaxterBoxService baxterBoxService;

    @Autowired
    public BaxterBoxController(BaxterBoxService baxterBoxService) {
        this.baxterBoxService = baxterBoxService;
    }

    @GetMapping("/baxterbox")
    public BaxterBox getBaxterBox(@RequestParam int id) {
        try {
            return baxterBoxService.getBaxterBox(id);
        } catch (Exception e) {
            // Log the exception (optional)
            e.printStackTrace();
            // Return an appropriate error response
            return null;
        }
    }

}
