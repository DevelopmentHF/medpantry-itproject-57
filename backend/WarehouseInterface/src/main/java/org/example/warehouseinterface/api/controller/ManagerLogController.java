package org.example.warehouseinterface.api.controller;

import org.example.warehouseinterface.service.ManagerLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
