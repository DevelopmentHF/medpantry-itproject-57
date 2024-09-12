package org.example.warehouseinterface.api.controller;

import org.example.warehouseinterface.api.model.ManagerLogEntry;
import org.example.warehouseinterface.service.ManagerLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;

@RestController
public class ManagerLogController {

    private ManagerLogService managerLogService;

    @Autowired
    public ManagerLogController(ManagerLogService managerLogService) {
        this.managerLogService = managerLogService;
    };

    @PostMapping("/proposeChange")
    public String proposeChange(@RequestParam int box, @RequestParam String sku, @RequestParam int proposedQuantityToAdd) {
        try {
            managerLogService.handleChangeProposal(box, sku, proposedQuantityToAdd);
            return "Sucessfully created manager log entry";
        } catch (Exception e) {
            e.printStackTrace();
            // Return an appropriate error response
            return "Failed to log proposal change";
        }
    }

    @PatchMapping
    public String resolveChange(@RequestParam int id, @RequestParam boolean accepted) {
        try {
            managerLogService.handleChangeResolution(id, accepted);
            return "Sucessfully handled proposed change";
        } catch (Exception e) {
            e.printStackTrace();
            // Return an appropriate error response
            return "Failed to handle proposed change";
        }
    }

    @GetMapping("/logEntries")
    public ManagerLogEntry[] getManagerLogEntries() {
        try {
            return managerLogService.getAllLogEntries();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
