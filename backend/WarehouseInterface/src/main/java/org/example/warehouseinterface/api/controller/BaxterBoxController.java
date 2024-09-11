package org.example.warehouseinterface.api.controller;

import org.example.warehouseinterface.api.model.BaxterBox;
import org.example.warehouseinterface.service.BaxterBoxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class BaxterBoxController {

    private BaxterBoxService baxterBoxService;

    @Autowired
    public BaxterBoxController(BaxterBoxService baxterBoxService) {
        this.baxterBoxService = baxterBoxService;
    }

    @GetMapping("/baxterbox")
    public Object getBaxterBox(@RequestParam(required = false) Integer id, @RequestParam(required = false) String sku) {
        try {
            if (id != null) {
                return baxterBoxService.getBaxterBox(id);
            }
            if (sku != null) {
                return baxterBoxService.findBaxterBoxBySKU(sku, false);
            }
            return baxterBoxService.getAllBaxterBoxes();
        } catch (Exception e) {
            // Log the exception (optional)
            e.printStackTrace();
            // Return an appropriate error response
            return null;
        }
    }

    @PostMapping("/addToBaxterBox")
    public ResponseEntity<BaxterBox> addProductsToStock(@RequestParam String SKU, @RequestParam int units) {
        try {
            // products of this type might already be packed somewhere
            BaxterBox existingBaxterBox = baxterBoxService.findBaxterBoxBySKU(SKU, false);

            if (existingBaxterBox != null) {
                // update existing BaxterBox with new information
                BaxterBox updatedBaxterBox = baxterBoxService.updateBaxterBox(existingBaxterBox, units);
                return new ResponseEntity<>(updatedBaxterBox, HttpStatus.OK);
            } else {
                // create a new BaxterBox
                BaxterBox newBaxterBox = baxterBoxService.createBaxterBox(SKU, units);
                return new ResponseEntity<>(newBaxterBox, HttpStatus.CREATED);
            }
        } catch (Exception e) {
            // return an error response
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
