package org.example.warehouseinterface.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class QRCodeService {

    // REQUIRES A .env FILE IN resources/
    // backend/WarehouseInterface/src/main/resources/.env
    //private static final Dotenv dotenv = Dotenv.configure().directory(".env").load();
    private static final String SHOPIFY_ADMIN_KEY = System.getenv("SHOPIFY_ADMIN_KEY");

    /**
     * Takes in a string generated from the qr code and returns the associated product
     * @param link
     * @return
     * @throws Exception
     */
    public String findSku(String link) throws Exception {
        String id = extractIdFromLink(link);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://team57-itproject.myshopify.com/admin/api/2024-07/products/" + id + ".json"))
                .header("X-Shopify-Access-Token", SHOPIFY_ADMIN_KEY)
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new Exception("Product extraction from shopify failed: " + response.statusCode());
        }

        String sku = extractSkuFromProductResponse(response.body());
        System.out.println(sku);

        return sku;
    }

    /**
     * Extracts the product id component from a shopify link
     * @param link
     * @return
     */
    private String extractIdFromLink(String link) {
        // example input link
        // https://admin.shopify.com/store/team57-itproject/products/9625474662683
        try {
            // split based on /
            URI uri = new URI(link);
            String path = uri.getPath();
            String[] segments = path.split("/");

            // last segment is the product ID
            return segments[segments.length - 1];
        } catch (URISyntaxException e) {
            e.printStackTrace();
            return "";
        }
    }

    private String extractSkuFromProductResponse(String response) {
        ObjectMapper objectMapper = new ObjectMapper();

        JsonNode rootNode = null;
        try {
            rootNode = objectMapper.readTree(response);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        JsonNode productNode = rootNode.path("product");
        JsonNode variantsNode = productNode.path("variants");

        String sku = "";
        for (JsonNode variant : variantsNode) {
            sku = variant.path("sku").asText();
        }

        return sku;
    }
}
