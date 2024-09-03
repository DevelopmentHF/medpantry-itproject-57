package org.example.warehouseinterface.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Order {
    private String sku;
    private String orderNumber;
    private int quantity;

    public Order(@JsonProperty("sku") String sku,
                 @JsonProperty("order_number") String orderNumber,
                 @JsonProperty("quantity") int quantity) {
        this.sku = sku;
        this.orderNumber = orderNumber;
        this.quantity = quantity;
    }

    public String getSku() {
        return sku;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public int getQuantity() {
        return quantity;
    }
}
