package org.example.warehouseinterface.api.controller;

import org.example.warehouseinterface.api.model.ManagerLogEntry;
import org.example.warehouseinterface.service.ManagerLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ManagerLogController {

    private ManagerLogService managerLogService;

    @Autowired
    public ManagerLogController(ManagerLogService managerLogService) {
        this.managerLogService = managerLogService;
    };

    @PostMapping("/proposeChange")
    public ResponseEntity<Map<String, String>> proposeChange(
            @RequestParam int box,
            @RequestParam String sku,
            @RequestParam int proposedQuantityToAdd,
            @RequestParam(required = false) Boolean fullStatusChangedTo) {

        Map<String, String> response = new HashMap<>();

        try {
            managerLogService.handleChangeProposal(box, sku, proposedQuantityToAdd, fullStatusChangedTo);
            response.put("message", "Proposed change successfully");
            return ResponseEntity.ok(response); // Return a JSON object on success
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Failed to propose change");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return a JSON object on error
        }
    }

    @PatchMapping("/resolveChange")
    public ResponseEntity<Map<String, String>> resolveChange(
            @RequestParam int id,
            @RequestParam boolean accepted) {

        Map<String, String> response = new HashMap<>();

        try {
            managerLogService.handleChangeResolution(id, accepted);
            response.put("message", "Resolved change successfully");
            return ResponseEntity.ok(response); // Return a JSON object on success
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Failed to resolve change");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // Return a JSON object on error
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
