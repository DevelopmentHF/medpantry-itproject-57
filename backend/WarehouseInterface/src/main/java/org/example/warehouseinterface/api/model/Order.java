package org.example.warehouseinterface.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Order {
    private String SKU;
    private int quantity;

    public Order(@JsonProperty("sku") String SKU,
                 @JsonProperty("quantity") int quantity) {
        this.SKU = SKU;
        this.quantity = quantity;
    }

}
