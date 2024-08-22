package org.example.warehouseinterface.api.model;
import com.fasterxml.jackson.annotation.JsonProperty;

public class BaxterBox {
    /* NOTE: This should match our schema for a 'baxter box' */
    private int id; // Unique number of the baxter box
    private int warehouseId = 1; // Unique number of which warehouse the baxter box is present in. Default = 1 as there is only 1 warehouse
    private String SKU; // SKU of the product contained by the box

    /* Basic constructor for a BaxterBox */
    public BaxterBox(@JsonProperty("id") int id,
                     @JsonProperty("warehouseID") int warehouseID,
                     @JsonProperty("SKU") String SKU) {
        this.id = id;
        this.warehouseId = warehouseId;
        this.SKU = SKU;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(int warehouseId) {
        this.warehouseId = warehouseId;
    }

    public String getSKU() {
        return SKU;
    }

    public void setSKU(String SKU) {
        this.SKU = SKU;
    }
}
