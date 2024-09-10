package org.example.warehouseinterface.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.example.warehouseinterface.api.model.BaxterBox;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpHeaders;
import java.util.HashMap;

import io.github.cdimascio.dotenv.Dotenv;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class BaxterBoxService {

    // REQUIRES A .env FILE IN resources/
    // backend/WarehouseInterface/src/main/resources/.env
    private static final Dotenv dotenv = Dotenv.configure().directory(".env").load();
    private static final String SUPABASE_URL = dotenv.get("SUPABASE_URL");
    private static final String SUPABASE_API_KEY = dotenv.get("SUPABASE_API_KEY");
    private static final String SHOPIFY_ADMIN_KEY = dotenv.get("SHOPIFY_ADMIN_KEY");

    /** Returns information about the BaxterBox#id
     * @param id Id of specified baxter box
     * @return The box itself, containing its information
     */
    public BaxterBox getBaxterBox(int id) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/BaxterBoxes?id=eq." + id))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            // Use Jackson to parse the JSON response
            ObjectMapper objectMapper = new ObjectMapper();
            // Assuming the response body contains a JSON array with a single object
            BaxterBox[] boxes = objectMapper.readValue(response.body(), BaxterBox[].class);

            if (boxes.length > 0) {
                return boxes[0];
            } else {
                throw new Exception("No BaxterBox found with the given ID");
            }
        } else {
            // Handle non-200 HTTP responses
            throw new Exception("Failed to fetch BaxterBox: " + response.statusCode());
        }
    }

    /**
     * Finds the least full baxter box that currently contains this SKU (product)
     * @param sku - unique product identifier
     * @return BaxterBox that currently exists
     */
    public BaxterBox findBaxterBoxBySKU(String sku) throws Exception {
        // get all baxter box rows from supabase
        BaxterBox[] boxes = getAllBaxterBoxes();

        // TODO: This should be more robust. At present, it finds the first box with a matching SKU, but it should be the box with least amount of stock.
        // TODO: Implement stock checking private method
        // find row with sku matching
        for (BaxterBox potentialBox : boxes) {
            if (potentialBox.getSKU().equals(sku)) {
                if (potentialBox.isFull()) {
                    continue;
                }
                return potentialBox;
            }
        }

        // didn't find a box
        return null;
    }

    /**
     *
     * @param SKU
     * @return
     * @throws Exception
     */
    public BaxterBox createBaxterBox(String SKU, int units) throws Exception {
        BaxterBox box = new BaxterBox(findNextId(), 1, SKU, units, false);

        // convert to json to ready to ship off
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonRequestBody = objectMapper.writeValueAsString(box);
        System.out.println(jsonRequestBody);

        // ... post it to the db
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/BaxterBoxes"))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonRequestBody))
                .build();


        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 201) { // HTTP 201 Created
            // Parse and return the created BaxterBox
            throw new Exception("Failed to create BaxterBox: " + response.statusCode() + " - " + response.body());
        }

        return box;
    }

    /**
     *
     * @param baxterBox
     * @return
     * @throws Exception
     */
    public BaxterBox updateBaxterBox(BaxterBox baxterBox, int units) throws Exception {
        baxterBox.setUnits(baxterBox.getUnits() + units);
        HttpClient client = HttpClient.newHttpClient();
        ObjectMapper objectMapper = new ObjectMapper();

        // Convert BaxterBox to JSON
        String jsonRequestBody = objectMapper.writeValueAsString(baxterBox);

        // Create PATCH request
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/BaxterBoxes?id=eq." + baxterBox.getId()))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Content-Type", "application/json")
                .method("PATCH", HttpRequest.BodyPublishers.ofString(jsonRequestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200 && response.statusCode() != 204) {
            throw new Exception("Failed to update BaxterBox: " + response.statusCode() + " " + response.body());
        }

        return baxterBox;
    }

    /**
     * Finds a unique location id for a new database entry to use
     * @return integer location id
     */
    private int findNextId() throws Exception {
        BaxterBox[] boxes = getAllBaxterBoxes();

        int lowestFreeId = -1;
        for (BaxterBox box : boxes) {
            if (box.getId() >= lowestFreeId) {
                lowestFreeId = box.getId() + 1;
            }
        }
        return lowestFreeId;
    }

    public BaxterBox[] getAllBaxterBoxes() throws Exception {
        // get all baxter box rows from supabase
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/BaxterBoxes"))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new Exception("Failed to fetch BaxterBoxes: " + response.statusCode());

        }

        ObjectMapper objectMapper = new ObjectMapper();
        BaxterBox[] boxes = objectMapper.readValue(response.body(), BaxterBox[].class);
        return boxes;
    }

    /**
     * Syncs baxterbox data with shopify inventory levels.
     * Supabase is the source of truth.
     * @throws Exception
     */
    public String sync() throws Exception {
        /* PLAN OF ATTACK */
        // go through each SKU (this could be multiple supabase rows)
        // GET the associated product **variant**
        // PATCH the variants "inventory_quantity"

        // retrieve list of all boxes
        BaxterBox[] boxes = getAllBaxterBoxes();

        // init. map of skus and quantity -> squashing down multiple rows into 1 basically
        HashMap<String, Integer> quantities = new HashMap<>();

        for (BaxterBox box : boxes) {
            // find if there's already a value
            int existingQuantity = 0;
            if (quantities.containsKey(box.getSKU())) {
                existingQuantity = quantities.get(box.getSKU());
            }

            // increment our quantity
            quantities.put(box.getSKU(), existingQuantity + box.getUnits());
        }

        // GET all existing products to save on individual requests
        // TODO: Handle paginiation. Shopify limits to 50 (or if we ask, 250) products per response.
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://team57-itproject.myshopify.com/admin/api/2024-07/products.json"))
                .header("X-Shopify-Access-Token", SHOPIFY_ADMIN_KEY)
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new Exception("Product extraction from shopify failed: " + response.statusCode());
        }

        String rawProductsListJson = response.body();
        System.out.println(rawProductsListJson);
        // clean up response so we get skus mapping to product variants inventory item ids
        HashMap<String, String> variants = extractVariantIds(rawProductsListJson, boxes);

        System.out.println(quantities);
        System.out.println(variants);

        // actually sync
        // TODO: This could be incredibly inefficient. I.e its going to be like 5000 requests to shopify each time...
        // or maybe it would be okay. 1 GET requests to get all products info which we can then parse, then
        // if the quantity is different, send a PATCH. so if all products are different, then yes, it would be an
        // excessive amount of PATCHes, but it probably (?) won't be. Something to think about though.
        for (String key : quantities.keySet()) {
            syncSku(key, quantities.get(key), variants);
        }

        return "Synced successfully";
    }

    /**
     * Syncs 1 SKUs values with shopify
     * @param sku
     * @param units
     * @param variantMap hashmap of sku : product variant inventory item ids
     * @throws Exception
     */
    private void syncSku(String sku, int units, HashMap<String, String> variantMap) throws Exception {
        // find the product variant from hashmap
        // conditionally PATCH inventory level for this id https://shopify.dev/docs/api/admin-rest/2024-07/resources/inventorylevel#post-inventory-levels-set

        // Find inventory level for each product variant
        int shopifyAvailableQuantity = getInventoryLevel(variantMap.get(sku));
        System.out.println(shopifyAvailableQuantity);

        // TODO: Consider the fact we have outstanding orders. Shopify auto reduces the stock level but supabase requires volunteer input
        // TODO: ... so if we had an outstanding order, and a volunteer packed for that same sku and we synced, the shopify would be updated
        // TODO: ... to a value greater than what it should be by the outstanding order amount, as that hasn't been subtracted from db yet.
        // TODO: Thus, account for outstanding order quantity when syncing?

    }

    // THIS RETURNS THE "AVAILABLE" NUMBER, so if there is an order, that's subtracted automagically
    // Thus, we don't want to force a sync when we've updated supabase after an order, only after packing.
    private int getInventoryLevel(String inventory_id) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://team57-itproject.myshopify.com/admin/api/2024-07/inventory_levels.json?inventory_item_ids=" + inventory_id))
                .header("X-Shopify-Access-Token", SHOPIFY_ADMIN_KEY)
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());


        if (response.statusCode() != 200) {
            throw new Exception("Failed to get inventory level: " + response.statusCode());

        }

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(response.body());
        JsonNode levelsNode = rootNode.path("inventory_levels");

        for (JsonNode level : levelsNode) {
            int available = level.path("available").asInt();

            if (level.path("inventory_item_id").asText().equals(inventory_id)) {
                return available;
            }
        }

        return -1;
    }

    /**
     * Creates a hashmap of Sku : ProductVariant's inventory item id
     * @param rawProductsListJson
     * @param boxes
     * @return
     * @throws Exception
     */
    private HashMap<String, String> extractVariantIds(String rawProductsListJson, BaxterBox[] boxes) throws Exception {
        // init map
        HashMap<String, String> variants = new HashMap<>();

        // find associated id
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(rawProductsListJson);
        JsonNode productsNode = rootNode.path("products");

        for (JsonNode productNode : productsNode) {
            JsonNode variantNode = productNode.path("variants");
            for (JsonNode variant : variantNode) {
                // we've got this variants sku :)
                String variantSku = variant.path("sku").asText();
                String variantId = variant.path("id").asText();
                String inventory_item_id = variant.path("inventory_item_id").asText();

                // find an associated box. Nested loops here -> potentially inefficient
                // we just need to link skus and variant ids
                for (BaxterBox box : boxes) {
                    if (box.getSKU() == null) continue;
                    if (box.getSKU().equals(variantSku)) {
                        variants.put(box.getSKU(), inventory_item_id);
                    }
                }
            }
        }

        return variants;
    }
}
