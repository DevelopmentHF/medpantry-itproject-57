package org.example.warehouseinterface.service;

import org.example.warehouseinterface.api.model.BaxterBox;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Service
public class BaxterBoxService {

    /** Returns information about the BaxterBox#id
     *  NOTE: Here is where we connect to supabase
     * @param id Id of specified baxter box
     * @return The box itself, containing its information
     */
    public BaxterBox getBaxterBox(int id) {
        // Hardcoded example, connect to supabase instead
        return new BaxterBox(id, 1, "001");
    }
}
