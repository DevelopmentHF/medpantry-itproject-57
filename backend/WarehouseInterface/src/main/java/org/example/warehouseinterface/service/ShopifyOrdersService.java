package org.example.warehouseinterface.service;

import io.github.cdimascio.dotenv.Dotenv;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

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

        if (response.statusCode() == 200) {
            // Handle successful response
            System.out.println("Response: " + response.body());
        } else {
            // Handle non-200 HTTP responses
            throw new Exception("testShopifyRestConnection Failed: " + response.statusCode());
        }

        return response.body();
    }
}
