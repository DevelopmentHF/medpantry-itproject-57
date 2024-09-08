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
            if (quantities.containsKey(box.getId())) {
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
        // clean up response so we get skus mapping to product variants ids

        // actually sync
        // TODO: This could be incredibly inefficient. I.e its going to be like 5000 requests to shopify each time...
        // or maybe it would be okay. 1 GET requests to get all products info which we can then parse, then
        // if the quantity is different, send a PATCH. so if all products are different, then yes, it would be an
        // excessive amount of PATCHes, but it probably (?) won't be. Something to think about though.
        for (String key : quantities.keySet()) {
            syncSku(key, quantities.get(key));
        }

        return "Synced successfully";
    }

    /**
     * Syncs 1 SKUs values with shopify
     * @param sku
     * @param units
     * @throws Exception
     */
    private void syncSku(String sku, int units) throws Exception {
        // GET the product variant

        // conditionally PATCH inventory level for this id https://shopify.dev/docs/api/admin-rest/2024-07/resources/inventorylevel#post-inventory-levels-set
    }
}
