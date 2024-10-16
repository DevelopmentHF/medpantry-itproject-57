package org.example.warehouseinterface.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.warehouseinterface.service.ShopifyOrdersService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public void handleOrderAccept(@RequestParam String orderNumber) {
        try {
            service.handleOrderAccept(orderNumber);
        } catch (Exception e) {
            // Log the exception (optional)
            e.printStackTrace();
        }
    }

    @PostMapping("/TakeOrder")
    public void takeOrder(@RequestParam String orderNumber) {
        try {
            service.takeOrder(orderNumber);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
