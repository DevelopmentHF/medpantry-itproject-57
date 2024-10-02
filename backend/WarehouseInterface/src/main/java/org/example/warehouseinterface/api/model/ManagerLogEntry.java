package org.example.warehouseinterface.api.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ManagerLogEntry {
    private int id;
    private int box;
    private String sku;
    private int proposedQuantityToAdd;
    private boolean pending;
    private boolean accepted;
    private Boolean fullStatusChangedTo;

    /* Basic constructor for a BaxterBox */
    public ManagerLogEntry(@JsonProperty("id") int id,
                            @JsonProperty("box") int box,
                            @JsonProperty("sku") String sku,
                            @JsonProperty("proposedQuantityToAdd") int proposedQuantityToAdd,
                            @JsonProperty("pending") boolean pending,
                            @JsonProperty("accepted") Boolean accepted,
                           @JsonProperty("fullStatusChangedTo") Boolean fullStatusChangedTo) {
        this.id = id;
        this.box = box;
        this.sku = sku;
        this.proposedQuantityToAdd = proposedQuantityToAdd;
        this.pending = pending;
        this.accepted = accepted;
        this.fullStatusChangedTo = fullStatusChangedTo;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getBox() {
        return box;
    }

    public void setBox(int box) {
        this.box = box;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public int getProposedQuantityToAdd() {
        return proposedQuantityToAdd;
    }

    public void setProposedQuantityToAdd(int proposedQuantityToAdd) {
        this.proposedQuantityToAdd = proposedQuantityToAdd;
    }

    public boolean isPending() {
        return pending;
    }

    public void setPending(boolean pending) {
        this.pending = pending;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

    public Boolean isFullStatusChangedTo() {
        return fullStatusChangedTo;
    }

    public void setFullStatusChangedTo(Boolean fullStatusChangedTo) {
        this.fullStatusChangedTo = fullStatusChangedTo;
    }

    @Override
    public String toString() {
        return "ManagerLogEntry{" +
                "id=" + id +
                ", box=" + box +
                ", sku='" + sku + '\'' +
                ", proposedQuantityToAdd=" + proposedQuantityToAdd +
                ", pending=" + pending +
                ", accepted=" + accepted +
                ", fullStatusChangedTo=" + fullStatusChangedTo +
                '}';
    }
}
