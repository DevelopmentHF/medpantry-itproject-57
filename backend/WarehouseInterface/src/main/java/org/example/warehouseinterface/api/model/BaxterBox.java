package org.example.warehouseinterface.api.model;
import com.fasterxml.jackson.annotation.JsonProperty;

public class BaxterBox {
    /* NOTE: This should match our schema for a 'baxter box' */
    private int id; // Unique number of the baxter box
    private int warehouseId = 1; // Unique number of which warehouse the baxter box is present in. Default = 1 as there is only 1 warehouse
    private String sku; // SKU of the product contained by the box
    private int units; // Number of units in baxter box
    private boolean full; // Can we fit more items in or is it full?


    /* Basic constructor for a BaxterBox */
    public BaxterBox(@JsonProperty("id") int id,
                     @JsonProperty("warehouseID") int warehouseID,
                     @JsonProperty("sku") String SKU,
                    @JsonProperty("units") int units,
                     @JsonProperty("full") boolean full) {
        this.id = id;
        this.warehouseId = warehouseId;
        this.sku = SKU;
        this.units = units;
        this.full = full;
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
        return this.sku;
    }

    public void setSKU(String SKU) {
        this.sku = sku;
    }

    public int getUnits() {
        return units;
    }

    public void setUnits(int units) {
        this.units = units;
    }


    public boolean isFull() {
        return full;
    }

    public void setFull(boolean full) {
         this.full = full;
    }

    @Override
    public String toString() {
        return "BaxterBox{" +
                "id=" + id +
                ", warehouseId=" + warehouseId +
                ", sku='" + sku + '\'' +
                ", units=" + units +
                ", full=" + full +
                '}';
    }
}
