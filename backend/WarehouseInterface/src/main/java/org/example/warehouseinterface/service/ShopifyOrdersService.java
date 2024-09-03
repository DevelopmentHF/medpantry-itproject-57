package org.example.warehouseinterface.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.github.cdimascio.dotenv.Dotenv;
import org.example.warehouseinterface.api.model.Order;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class ShopifyOrdersService {
    private static final Dotenv dotenv = Dotenv.configure().directory(".env").load();
    private static final String SHOPIFY_ADMIN_KEY = dotenv.get("SHOPIFY_ADMIN_KEY");


    public String getAllOrders() throws Exception {
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
            System.out.println("Order Number: " + orderNumber);

            JsonNode lineItemNodes = orderNode.path("line_items");
            for (JsonNode lineItemNode : lineItemNodes) {
                sku = lineItemNode.path("sku").asText();
                quantity = lineItemNode.path("quantity").asInt();
                System.out.println("SKU:" + sku);
                System.out.println("Quantity: " + quantity);
            }

            ObjectNode cleanedOrder = objectMapper.createObjectNode();
            cleanedOrder.put("sku", sku);
            cleanedOrder.put("quantity", quantity);
            cleanedOrder.put("order_number", orderNumber);

            cleanedOrders.add(cleanedOrder);
        }

        String cleanedOrdersString = objectMapper.writeValueAsString(cleanedOrders);
        System.out.println("cleaned: " + cleanedOrdersString);

        return response.body();
    }
}
