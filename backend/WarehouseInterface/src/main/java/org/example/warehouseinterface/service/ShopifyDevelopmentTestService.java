package org.example.warehouseinterface.service;

import org.example.warehouseinterface.api.model.BaxterBox;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpHeaders;
import io.github.cdimascio.dotenv.Dotenv;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ShopifyDevelopmentTestService {
    /* Requires a backend/WarehouseInterface/src/main/resources/.env file loaded with shopify key from dev store page */
    private static final Dotenv dotenv = Dotenv.configure().directory(".env").load();
    private static final String SHOPIFY_ADMIN_KEY = dotenv.get("SHOPIFY_ADMIN_KEY");

    /**
     * Calls the shopify development store and lists out all the products currently on the store.
     * Using this for testing purposes, for connecting the store to this interface correctly.
     * @return String of JSON data of all the products in the store. See:
     * https://shopify.dev/docs/api/admin-rest/2024-07/resources/product#get-products?ids=632910392,921728736
     * @throws Exception
     */
    public String getAllProducts() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://team57-itproject.myshopify.com/admin/api/2024-07/products.json"))
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
