package org.example.warehouseinterface.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class OrderTakenFrom {
    private String orderNumber;
    private String orderID;

    public String getOrderNumber() {
        return orderNumber;
    }

    public String getOrderID() {
        return orderID;
    }

    public List<String> getLocationIDs() {
        return locationIDs;
    }

    public List<Integer> getUnits() {
        return units;
    }

    private List<String> locationIDs;
    private List<Integer> units;

    public OrderTakenFrom(@JsonProperty("orderNumber") String orderNumber,
                          @JsonProperty("orderID") String orderID,
                          @JsonProperty("locationIDs") List<String> locationIDs,
                          @JsonProperty("units") List<Integer> units) {
        this.orderID = orderID;
        this.orderNumber = orderNumber;
        this.locationIDs = locationIDs;
        this.units = units;
    }
}
