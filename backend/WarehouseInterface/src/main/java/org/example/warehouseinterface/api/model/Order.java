package org.example.warehouseinterface.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Order {
    private List<String> sku;
    private String orderNumber;
    private List<Integer> quantity;
    private List<String> itemName;

    public Order(@JsonProperty("sku") List<String> sku,
                 @JsonProperty("order_number") String orderNumber,
                 @JsonProperty("quantity") List<Integer> quantity,
                 @JsonProperty("item_name") List<String> itemName) {
        this.sku = sku;
        this.orderNumber = orderNumber;
        this.quantity = quantity;
        this.itemName = itemName;
    }

    public List<String> getSku() {
        return sku;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public List<Integer> getQuantity() {
        return quantity;
    }

    public List<String> getItemName() {
        return itemName;
    }
}
