package org.example.warehouseinterface.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.core.type.TypeReference;
import io.github.cdimascio.dotenv.Dotenv;
import org.example.warehouseinterface.api.model.BaxterBox;
import org.example.warehouseinterface.api.model.Order;

import org.example.warehouseinterface.api.model.OrderTakenFrom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ShopifyOrdersService {
    private static final Dotenv dotenv = Dotenv.configure().directory(".env").load();
    private static String SUPABASE_URL = dotenv.get("SUPABASE_URL");
    private static String SUPABASE_API_KEY = dotenv.get("SUPABASE_API_KEY");
    private static final String SHOPIFY_ADMIN_KEY = dotenv.get("SHOPIFY_ADMIN_KEY");
    public static HttpClient httpClient = HttpClient.newHttpClient();

    @Autowired
    private BaxterBoxService baxterBoxService;

    /**
     * REturns the all the order that should be displayed as ready to be taken
     * @return
     * @throws Exception
     */
    public List<Order> getUntakenOrders() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://team57-itproject.myshopify.com/admin/api/2024-07/orders.json?status=open"))
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

        List<Order> ordersCurrentlyBeingWorkedOn = getOrdersCurrentlyBeingWorkedOn();

        for (JsonNode orderNode : ordersNode) {
            String orderNumber = orderNode.path("name").asText();
            String orderID = orderNode.path("id").asText();

            System.out.println("Order Number: " + orderNumber);

            // Do not return and thus display this order if it is in the Order DB on supabase. This indicates that it is currently being worked on.
            boolean doNotDisplayOrder = false;
            for (Order order : ordersCurrentlyBeingWorkedOn) {
                if (order.getOrderNumber().equals(orderNumber)) {
                    // this order is currently being worked on. Don't add it to the list of orders that needs to be displayed
                    doNotDisplayOrder = true;
                    break;
                }
            }

            if (doNotDisplayOrder) {
                continue;
            }

            // order is not currently being worked on. Add the relevant information to the list of orders that need to be displayed.
            JsonNode lineItemNodes = orderNode.path("line_items");
            List<String> skus = new ArrayList<>();
            List<Integer> quantities = new ArrayList<>();
            List<String> itemNames = new ArrayList<>();

            for (JsonNode lineItemNode : lineItemNodes) {
                // need an array for each attribute other than order number cause there can be multiple items in one order

                skus.add(lineItemNode.path("sku").asText());
                quantities.add(lineItemNode.path("quantity").asInt());
                itemNames.add(lineItemNode.path("name").asText());
//                System.out.println("SKU:" + sku);
//                System.out.println("Quantity: " + quantity);
            }

            ObjectNode cleanedOrder = objectMapper.createObjectNode();

            // add each array node to the order node
            ArrayNode skuNode = objectMapper.createArrayNode();
            for (String sku : skus) {
                skuNode.add(sku);
            }
            cleanedOrder.put("sku", skuNode);

            ArrayNode quantityNode = objectMapper.createArrayNode();
            for (Integer quantity : quantities) {
                quantityNode.add(quantity);
            }
            cleanedOrder.put("quantity", quantityNode);

            ArrayNode itemNameNode = objectMapper.createArrayNode();
            for (String itemName : itemNames) {
                itemNameNode.add(itemName);
            }
            cleanedOrder.put("item_name", itemNameNode);

            cleanedOrder.put("order_number", orderNumber);
            cleanedOrder.put("id", orderID);
            System.out.println("OrderID" + orderID);

            cleanedOrders.add(cleanedOrder);
        }

        String cleanedOrdersString = objectMapper.writeValueAsString(cleanedOrders);
        System.out.println("cleaned: " + cleanedOrdersString);
        //return cleanedOrdersString;

        List<Order> orders = objectMapper.readValue(cleanedOrdersString, new TypeReference<List<Order>>() {});
        // Order[] orders = objectMapper.readValue(cleanedOrdersString, Order[].class);
        // System.out.println(orders.get(0).getItemName());

        // find required baxter boxes
//        List<BaxterBox> requiredBoxes = findCorrectBaxterBoxes(orders.get(0));
//        System.out.println("length: " + requiredBoxes.size());
//        System.out.println(requiredBoxes.get(0).getId());

        // handleOrderAccept(requiredBoxes, orders.get(0));

        return orders;
    }

    /**
     * Given an order, finds the correct Baxter Box(es) which contain the items that should be shipped.
     * The returned Baxter boxes are sorted by quantity from low to high. Returns a list of lists, where each inner
     * list represents the required Baxter Boxes for one item in the order.
     * @param order
     * @return
     */
    public List<List<BaxterBox>> findCorrectBaxterBoxes(Order order) throws Exception {
        List<List<BaxterBox>> requiredBoxes = new ArrayList<>();

        for (String sku : order.getSku()) {
            List<BaxterBox> boxesForThisSKU = baxterBoxService.findAllBaxterBoxesBySKU(sku);
            Collections.sort(boxesForThisSKU);
            requiredBoxes.add(boxesForThisSKU);
        }

        // TODO: handle logic for multiple boxes/lowest amount
        // Collections.sort(requiredBoxes);

        return requiredBoxes;
    }

    /**
     * Given an order number, this function should be called when an order is confirmed to be packed. It updates the BaxterBox DB.
     * @param orderNumber
     * @throws Exception
     */
    public void handleOrderAccept(String orderNumber) throws Exception {
        Order order = findOrderByOrderNumber(orderNumber);
        List<Integer> requiredQuantitiesRemaining = order.getQuantity();
        List<List<BaxterBox>> matchingBoxes = findCorrectBaxterBoxes(order);
        //System.out.println("Num matching boxes: " + matchingBoxes.size());

        // update db to store information on what Baxter Boxes this order was taken from
        ObjectMapper objectMapper = new ObjectMapper();

        ObjectNode orderTakenFrom = objectMapper.createObjectNode();
        ArrayNode locationIDNode = objectMapper.createArrayNode();
        ArrayNode unitsNode = objectMapper.createArrayNode();

        for (int i = 0; i < matchingBoxes.size(); i++) {

            for (int j = 0; j < matchingBoxes.get(i).size(); j++) {
                if (matchingBoxes.get(i).get(j).getUnits() > requiredQuantitiesRemaining.get(i)) {
                    // there are more than enough units in this box to satisfy the order

                    //System.out.println("Required quant:" + requiredQuantityRemaining);
                    baxterBoxService.updateBaxterBox(matchingBoxes.get(i).get(j), -requiredQuantitiesRemaining.get(i));

                    locationIDNode.add(matchingBoxes.get(i).get(j).getId());
                    unitsNode.add(requiredQuantitiesRemaining.get(i));

                    break;
                } else {
                    // Baxter box will be depleted, so it needs to be marked as free in the system

                    requiredQuantitiesRemaining.set(i, requiredQuantitiesRemaining.get(i) - matchingBoxes.get(i).get(j).getUnits());
                    baxterBoxService.freeBaxterBox(matchingBoxes.get(i).get(j));

                    if (matchingBoxes.get(i).get(j).getUnits() > 0) {
                        locationIDNode.add(matchingBoxes.get(i).get(j).getId());
                        unitsNode.add(matchingBoxes.get(i).get(j).getUnits());
                    }
                    
                    // System.out.println(box.getSKU());
                    if (requiredQuantitiesRemaining.get(i) == 0) {
                        break;
                    }
                }
            }
        }

        orderTakenFrom.put("locationIDs", locationIDNode);
        orderTakenFrom.put("units", unitsNode);
        orderTakenFrom.put("orderNumber", orderNumber);
        orderTakenFrom.put("orderID", order.getId());

        String jsonRequestBody = objectMapper.writeValueAsString(orderTakenFrom);
        System.out.println("JSON for where orders were taken from " + jsonRequestBody);

        // ... post it to the OrdersTakenFrom db
        HttpClient client1 = HttpClient.newHttpClient();
        HttpRequest request1 = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/OrderTakenFrom"))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonRequestBody))
                .build();

        HttpResponse<String> response1 = client1.send(request1, HttpResponse.BodyHandlers.ofString());

        if (response1.statusCode() != 201) { // HTTP 201 Created
            // Parse and return the created BaxterBox
            throw new Exception("Failed to add order to OrderTakenFrom table: " + response1.statusCode() + " - " + response1.body());
        }

        // remove the order from the list of orders that are being worked on (on Supabase)


        // Build the DELETE request
        HttpClient client = HttpClient.newHttpClient();
        System.out.println(SUPABASE_URL + "/rest/v1/Order?orderNumber=eq." + orderNumber);
        String encodedOrderNumber = URLEncoder.encode(orderNumber, StandardCharsets.UTF_8);
        System.out.println(SUPABASE_URL + "/rest/v1/Order?orderNumber=eq." + encodedOrderNumber);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/Order?orderNumber=eq." + encodedOrderNumber))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Content-Type", "application/json")
                .DELETE()
                .build();


        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());

        if (response.statusCode() != 204) { // delete successful
            // Parse and return the created BaxterBox
            throw new Exception("Failed to delete order: " + response.statusCode() + " - " + response.body());
        }

        // close the order on Shopify
        client = HttpClient.newHttpClient();
        request = HttpRequest.newBuilder()
                .uri(URI.create("https://team57-itproject.myshopify.com/admin/api/2024-07/orders/" + order.getId() + "/close.json"))
                .header("X-Shopify-Access-Token", SHOPIFY_ADMIN_KEY)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{}"))
                .build();

        response = client.send(request, HttpResponse.BodyHandlers.ofString());


        if (response.statusCode() != 200) {
            throw new Exception("Close order on Shopify failed: " + response.statusCode());

        }

    }

    /**
     * Given an order number, allows a user to 'take' that order, adding the order to the list of order currently being worked on in the database.
     * @param orderNumber
     */
    public void takeOrder(String orderNumber) throws Exception {
        Order order = findOrderByOrderNumber(orderNumber);

        // add this order to the list of orders currently being worked on in the DB. If an order is in that list, it should not be rendered on the incoming orders list in the frontend.

        // convert order to json to add to DB
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonRequestBody = objectMapper.writeValueAsString(order);

        // ... post it to the db
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/Order"))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonRequestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 201) { // HTTP 201 Created
            // Parse and return the created BaxterBox
            throw new Exception("Failed to take Order: " + response.statusCode() + " - " + response.body());
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

        ArrayNode output = objectMapper.createArrayNode();

        for (int i = 0; i < order.getSku().size(); i++) {
            int requiredQuantityRemaining = order.getQuantity().get(i);
            List<BaxterBox> matchingBoxes = findCorrectBaxterBoxes(order).get(i);

            ArrayNode requiredBaxterBoxes = objectMapper.createArrayNode();

            for (BaxterBox box : matchingBoxes) {
                if (box.getUnits() >= requiredQuantityRemaining && box.getUnits() > 0) {
                    // there are more than enough units in this box to satisfy the order
                    ObjectNode requiredBaxterBox = objectMapper.createObjectNode();

                    requiredBaxterBox.put("box_id", box.getId());
                    requiredBaxterBox.put("required_quantity", requiredQuantityRemaining);
                    requiredBaxterBox.put("sku", box.getSKU());
                    requiredBaxterBoxes.add(requiredBaxterBox);
                    break;
                } else if (box.getUnits() < requiredQuantityRemaining && box.getUnits() > 0) {
                    // Baxter box has some units but not enough
                    ObjectNode requiredBaxterBox = objectMapper.createObjectNode();
                    requiredBaxterBox.put("box_id", box.getId());
                    requiredBaxterBox.put("required_quantity", box.getUnits());
                    requiredBaxterBox.put("sku", box.getSKU());
                    requiredBaxterBoxes.add(requiredBaxterBox);

                    requiredQuantityRemaining -= box.getUnits();

                }
            }

            output.add(requiredBaxterBoxes);
        }

        //List<BaxterBox> matchingBoxes = findCorrectBaxterBoxes(order);
        return objectMapper.writeValueAsString(output);
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

    public List<Order> getOrdersCurrentlyBeingWorkedOn() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        // get all order rows from supabase
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/Order"))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new Exception("Failed to fetch Orders currently being worked on: " + response.statusCode());

        }

        List<Order> ordersBeingWorkedOn = objectMapper.readValue(response.body(), new TypeReference<List<Order>>() {});
        return ordersBeingWorkedOn;
    }

    /**
     * Gets ALL the orders from shopify (both taken and not taken)
     * @return
     */
    public List<Order> getAllOrders() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://team57-itproject.myshopify.com/admin/api/2024-07/orders.json?status=open"))
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

        List<Order> ordersCurrentlyBeingWorkedOn = getOrdersCurrentlyBeingWorkedOn();

        for (JsonNode orderNode : ordersNode) {
            String orderNumber = orderNode.path("name").asText();
            String orderID = orderNode.path("id").asText();

            JsonNode lineItemNodes = orderNode.path("line_items");
            List<String> skus = new ArrayList<>();
            List<Integer> quantities = new ArrayList<>();
            List<String> itemNames = new ArrayList<>();

            for (JsonNode lineItemNode : lineItemNodes) {
                // need an array for each attribute other than order number cause there can be multiple items in one order

                skus.add(lineItemNode.path("sku").asText());
                quantities.add(lineItemNode.path("quantity").asInt());
                itemNames.add(lineItemNode.path("name").asText());
            }

            ObjectNode cleanedOrder = objectMapper.createObjectNode();

            // add each array node to the order node
            ArrayNode skuNode = objectMapper.createArrayNode();
            for (String sku : skus) {
                skuNode.add(sku);
            }
            cleanedOrder.put("sku", skuNode);

            ArrayNode quantityNode = objectMapper.createArrayNode();
            for (Integer quantity : quantities) {
                quantityNode.add(quantity);
            }
            cleanedOrder.put("quantity", quantityNode);

            ArrayNode itemNameNode = objectMapper.createArrayNode();
            for (String itemName : itemNames) {
                itemNameNode.add(itemName);
            }
            cleanedOrder.put("item_name", itemNameNode);

            cleanedOrder.put("order_number", orderNumber);
            cleanedOrder.put("id", orderID);

            cleanedOrders.add(cleanedOrder);
        }

        String cleanedOrdersString = objectMapper.writeValueAsString(cleanedOrders);
        System.out.println("cleaned: " + cleanedOrdersString);

        List<Order> orders = objectMapper.readValue(cleanedOrdersString, new TypeReference<List<Order>>() {});

        return orders;
    }

    public List<Order> getClosedOrders() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://team57-itproject.myshopify.com/admin/api/2024-07/orders.json?status=closed"))
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

        List<Order> ordersCurrentlyBeingWorkedOn = getOrdersCurrentlyBeingWorkedOn();

        for (JsonNode orderNode : ordersNode) {
            String orderNumber = orderNode.path("name").asText();
            String orderID = orderNode.path("id").asText();

            JsonNode lineItemNodes = orderNode.path("line_items");
            List<String> skus = new ArrayList<>();
            List<Integer> quantities = new ArrayList<>();
            List<String> itemNames = new ArrayList<>();

            for (JsonNode lineItemNode : lineItemNodes) {
                // need an array for each attribute other than order number cause there can be multiple items in one order

                skus.add(lineItemNode.path("sku").asText());
                quantities.add(lineItemNode.path("quantity").asInt());
                itemNames.add(lineItemNode.path("name").asText());
            }

            ObjectNode cleanedOrder = objectMapper.createObjectNode();

            // add each array node to the order node
            ArrayNode skuNode = objectMapper.createArrayNode();
            for (String sku : skus) {
                skuNode.add(sku);
            }
            cleanedOrder.put("sku", skuNode);

            ArrayNode quantityNode = objectMapper.createArrayNode();
            for (Integer quantity : quantities) {
                quantityNode.add(quantity);
            }
            cleanedOrder.put("quantity", quantityNode);

            ArrayNode itemNameNode = objectMapper.createArrayNode();
            for (String itemName : itemNames) {
                itemNameNode.add(itemName);
            }
            cleanedOrder.put("item_name", itemNameNode);

            cleanedOrder.put("order_number", orderNumber);
            cleanedOrder.put("id", orderID);

            cleanedOrders.add(cleanedOrder);
        }

        String cleanedOrdersString = objectMapper.writeValueAsString(cleanedOrders);
        System.out.println("cleaned: " + cleanedOrdersString);

        List<Order> orders = objectMapper.readValue(cleanedOrdersString, new TypeReference<List<Order>>() {});

        return orders;
    }

    /**
     * Given an order number, returns a json containing where that order was taken from
     * @param orderNumber
     * @return
     */
    public String orderTakenFrom(String orderNumber) throws Exception {

        // get all OrderTakenFrom rows from supabase
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/OrderTakenFrom"))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new Exception("Failed to fetch Orders currently being worked on: " + response.statusCode());
        }

        ObjectMapper objectMapper = new ObjectMapper();
        List<OrderTakenFrom> orderTakenFroms = objectMapper.readValue(response.body(), new TypeReference<List<OrderTakenFrom>>() {});
        OrderTakenFrom correctOrder = null;
        for (OrderTakenFrom orderTakenFrom : orderTakenFroms) {
            if (orderTakenFrom.getOrderNumber().equals(orderNumber)) {
                correctOrder = orderTakenFrom;
                break;
            }
        }

        return objectMapper.writeValueAsString(correctOrder);
    }
}
