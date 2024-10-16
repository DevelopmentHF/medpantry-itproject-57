package org.example.warehouseinterface.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.warehouseinterface.service.ShopifyOrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ShopifyOrdersController {
    private ShopifyOrdersService service;

    @Autowired
    public ShopifyOrdersController(ShopifyOrdersService service) {
        this.service = service;
    }

    @GetMapping("/ShopifyOrders")
    public String getAllOrders() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            return objectMapper.writeValueAsString(service.getUntakenOrders());
        } catch (Exception e) {
            // Log the exception (optional)
            e.printStackTrace();
            // Return an appropriate error response
            return null;
        }
    }

    @GetMapping("/RequiredBaxterBoxes")
    public String getRequiredBaxterBoxes(@RequestParam String orderNumber) {
        try {
            return service.getRequiredBaxterBoxes(orderNumber);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @PatchMapping("/HandleOrderAccept")
    public ResponseEntity<String> handleOrderAccept(@RequestParam String orderNumber) {
        try {
            service.handleOrderAccept(orderNumber);
            return ResponseEntity.ok("Order handled successfully"); // Success response
        } catch (Exception e) {
            // Log the exception (optional)
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error handling order: " + e.getMessage()); // Error response
        }
    }

    @PostMapping("/TakeOrder")
    public ResponseEntity<String> takeOrder(@RequestParam String orderNumber) {
        try {
            service.takeOrder(orderNumber);
            return ResponseEntity.ok("Order taken successfully"); // Success response
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error taking order: " + e.getMessage()); // Error response
        }
    }
}
