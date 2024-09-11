package org.example.warehouseinterface.api.controller;

import org.example.warehouseinterface.service.ShopifyOrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
            return service.getAllOrders().toString();
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
}
