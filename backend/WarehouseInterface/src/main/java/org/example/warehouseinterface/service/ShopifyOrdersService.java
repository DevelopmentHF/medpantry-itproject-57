package org.example.warehouseinterface.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.core.type.TypeReference;
import io.github.cdimascio.dotenv.Dotenv;
import org.example.warehouseinterface.api.model.BaxterBox;
import org.example.warehouseinterface.api.model.Order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Collections;
import java.util.List;

@Service
public class ShopifyOrdersService {
    private static final Dotenv dotenv = Dotenv.configure().directory(".env").load();
    private static final String SHOPIFY_ADMIN_KEY = dotenv.get("SHOPIFY_ADMIN_KEY");

    @Autowired
    private BaxterBoxService baxterBoxService;


    public List<Order> getAllOrders() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://team57-itproject.myshopify.com/admin/api/2024-07/orders.json?status=any"))
                .header("X-Shopify-Access-Token", SHOPIFY_ADMIN_KEY)
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());


        if (response.statusCode() != 200) {
            throw new Exception("Get shopify orders failed: " + response.statusCode());

        }

        // Handle successful response
        System.out.println("Response: " + response.body());

        ObjectMapper objectMapper = new ObjectMapper();
        
        JsonNode rootNode = objectMapper.readTree(response.body());
        JsonNode ordersNode = rootNode.path("orders");

        ArrayNode cleanedOrders = objectMapper.createArrayNode(); // array of cleaned order data in json format

        for (JsonNode orderNode : ordersNode) {
            String sku = null;
            int quantity = 0;
            String orderNumber = orderNode.path("name").asText();
            String itemName = null;
            System.out.println("Order Number: " + orderNumber);

            JsonNode lineItemNodes = orderNode.path("line_items");
            for (JsonNode lineItemNode : lineItemNodes) {
                sku = lineItemNode.path("sku").asText();
                quantity = lineItemNode.path("quantity").asInt();
                itemName = lineItemNode.path("name").asText();
                System.out.println("SKU:" + sku);
                System.out.println("Quantity: " + quantity);
            }

            ObjectNode cleanedOrder = objectMapper.createObjectNode();
            cleanedOrder.put("sku", sku);
            cleanedOrder.put("quantity", quantity);
            cleanedOrder.put("order_number", orderNumber);
            cleanedOrder.put("item_name", itemName);

            cleanedOrders.add(cleanedOrder);
        }

        String cleanedOrdersString = objectMapper.writeValueAsString(cleanedOrders);
        System.out.println("cleaned: " + cleanedOrdersString);

        List<Order> orders = objectMapper.readValue(cleanedOrdersString, new TypeReference<List<Order>>() {});
        // Order[] orders = objectMapper.readValue(cleanedOrdersString, Order[].class);
        System.out.println(orders.get(0).getOrderNumber());

        // find required baxter boxes
//        List<BaxterBox> requiredBoxes = findCorrectBaxterBoxes(orders.get(0));
//        System.out.println("length: " + requiredBoxes.size());
//        System.out.println(requiredBoxes.get(0).getId());

        // handleOrderAccept(requiredBoxes, orders.get(0));

        return orders;
    }

    /**
     * Given an SKU and quantity, finds the correct Baxter Box(es) which contain the items that should be shipped.
     * The returned Baxter boxes are sorted by quantity from low to high
     * @param order
     * @return
     */
    public List<BaxterBox> findCorrectBaxterBoxes(Order order) throws Exception {
        List<BaxterBox> requiredBoxes;


        requiredBoxes = baxterBoxService.findAllBaxterBoxesBySKU(order.getSku());

        // TODO: handle logic for multiple boxes/lowest amount
        Collections.sort(requiredBoxes);

        return requiredBoxes;
    }

    /**
     * Given an order number, this function should be called when an order is confirmed to be packed. It updates the BaxterBox DB.
     * @param orderNumber
     * @throws Exception
     */
    public void handleOrderAccept(String orderNumber) throws Exception {
        Order order = findOrderByOrderNumber(orderNumber);
        int requiredQuantityRemaining = order.getQuantity();
        List<BaxterBox> matchingBoxes = findCorrectBaxterBoxes(order);
        //System.out.println("Num matching boxes: " + matchingBoxes.size());

        for (BaxterBox box : matchingBoxes) {
            if (box.getUnits() > requiredQuantityRemaining) {
                // there are more than enough units in this box to satisfy the order

                //System.out.println("Required quant:" + requiredQuantityRemaining);
                baxterBoxService.updateBaxterBox(box, -requiredQuantityRemaining);
                break;
            } else {
                // Baxter box will be depleted, so it needs to be marked as free in the system

                requiredQuantityRemaining -= box.getUnits();
                baxterBoxService.freeBaxterBox(box);
                // System.out.println(box.getSKU());
                if (requiredQuantityRemaining == 0) {
                    break;
                }
            }
        }
    }

    /**
     * Returns a json containing information of which baxter boxes to get and how many units from each are required
     * @param orderNumber
     * @return
     */
    public String getRequiredBaxterBoxes(String orderNumber) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        Order order = findOrderByOrderNumber(orderNumber);
        int requiredQuantityRemaining = order.getQuantity();
        List<BaxterBox> matchingBoxes = findCorrectBaxterBoxes(order);

        ArrayNode requiredBaxterBoxes = objectMapper.createArrayNode();

        for (BaxterBox box : matchingBoxes) {
            if (box.getUnits() >= requiredQuantityRemaining && box.getUnits() > 0) {
                // there are more than enough units in this box to satisfy the order
                ObjectNode requiredBaxterBox = objectMapper.createObjectNode();

                requiredBaxterBox.put("box_id", box.getId());
                requiredBaxterBox.put("required_quantity", requiredQuantityRemaining);
                requiredBaxterBoxes.add(requiredBaxterBox);
                break;
            } else if (box.getUnits() < requiredQuantityRemaining && box.getUnits() > 0) {
                // Baxter box has some units but not enough
                ObjectNode requiredBaxterBox = objectMapper.createObjectNode();
                requiredBaxterBox.put("box_id", box.getId());
                requiredBaxterBox.put("required_quantity", box.getUnits());
                requiredBaxterBoxes.add(requiredBaxterBox);

                requiredQuantityRemaining -= box.getUnits();

            }
        }

        return objectMapper.writeValueAsString(requiredBaxterBoxes);
    }

    /**
     * Given an order number, finds the matching order Object
     * @param orderNumber
     * @return
     * @throws Exception
     */
    public Order findOrderByOrderNumber(String orderNumber) throws Exception {
        List<Order> orders = getAllOrders();

        for (Order order : orders) {
            System.out.println(order.getOrderNumber());
            System.out.println("Ordernum:" + orderNumber);
            if (order.getOrderNumber().equals(orderNumber)) {
                return order;
            }
        }

        return null;
    }
}
