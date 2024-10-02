package org.example.warehouseinterface.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;
import org.example.warehouseinterface.api.model.BaxterBox;
import org.example.warehouseinterface.api.model.ManagerLogEntry;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class ManagerLogService {

    // REQUIRES A .env FILE IN resources/
    // backend/WarehouseInterface/src/main/resources/.env
    private static final Dotenv dotenv = Dotenv.configure().directory(".env").load();
    private static final String SUPABASE_URL = dotenv.get("SUPABASE_URL");
    private static final String SUPABASE_API_KEY = dotenv.get("SUPABASE_API_KEY");
    private static final String SHOPIFY_ADMIN_KEY = dotenv.get("SHOPIFY_ADMIN_KEY");

    @Autowired
    private BaxterBoxService baxterBoxService;

    /**
     * Creates a new manager log entry in the supabase
     * @throws Exception
     */
    public void handleChangeProposal(int box, String sku, int proposedQuantityToAdd, Boolean fullStatusChangedTo) throws Exception {
        // its ok is fullStatusChangedTO is null.
        ManagerLogEntry newLogEntry = new ManagerLogEntry(generateUniqueLogId(), box, sku, proposedQuantityToAdd, true, false, fullStatusChangedTo);

        // convert to json to ready to ship off
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonRequestBody = objectMapper.writeValueAsString(newLogEntry);
        System.out.println(jsonRequestBody);

        // ... post it to the db
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/ManagerLog"))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonRequestBody))
                .build();


        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 201) { // HTTP 201 Created
            // Parse and return the created BaxterBox
            throw new Exception("Failed to create log entry: " + response.statusCode() + " - " + response.body());
        }
    }

    /**
     * Generates a new unique ID for a manager log entry
     * @return
     */
    private int generateUniqueLogId() throws Exception {
        ManagerLogEntry[] allEntries = getAllLogEntries();

        int lowestFreeId = -1;
        for (ManagerLogEntry entry : allEntries) {
            if (entry.getId() >= lowestFreeId) {
                lowestFreeId = entry.getId() + 1;
            }
        }
        return lowestFreeId;
    }

    /**
     * Gets all manager log entries
     * @return
     * @throws Exception
     */
    public ManagerLogEntry[] getAllLogEntries() throws Exception {
        // get all  rows from supabase
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/ManagerLog"))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new Exception("Failed to fetch logs: " + response.statusCode());

        }

        System.out.println(response.body());

        ObjectMapper objectMapper = new ObjectMapper();
        ManagerLogEntry[] entries = objectMapper.readValue(response.body(), ManagerLogEntry[].class);
        return entries;
    }

    /**
     * Accepts/Rejects a proposed change and takes it from manager log to supabase baxter box db and shopify
     * @param id
     * @param accepted
     * @throws Exception
     */
    public void handleChangeResolution(int id, boolean accepted) throws Exception {
        // patch manager log entry and set pending to false and accepted to accepted
        // then, call baxter box service and update db and do the same for shopify  
        // convert to json to ready to ship off

        ManagerLogEntry[] logEntries = getAllLogEntries();
        ManagerLogEntry entryToUpdate = null;

        // find the entry
        for (ManagerLogEntry entry : logEntries) {
            if (entry.getId() == id) {
                entryToUpdate = entry;
            }
        }

        // now chnage its state
        if (entryToUpdate == null) {
            throw new Exception("Failed to update log entry: " + id);
        }

        entryToUpdate.setAccepted(accepted);
        entryToUpdate.setPending(false);

        if (accepted) {
            // now update the box.
            // TODO: If a new box, .getBox wont work obvs
            baxterBoxService.updateBaxterBox(baxterBoxService.getBaxterBox(entryToUpdate.getBox()), entryToUpdate.getProposedQuantityToAdd());

            if (entryToUpdate.isFullStatusChangedTo() != null) {
                baxterBoxService.setBaxterBoxFull(baxterBoxService.getBaxterBox(entryToUpdate.getBox()), entryToUpdate.isFullStatusChangedTo());
            }
        }


        HttpClient client = HttpClient.newHttpClient();
        ObjectMapper objectMapper = new ObjectMapper();

        // Convert BaxterBox to JSON
        String jsonRequestBody = objectMapper.writeValueAsString(entryToUpdate);

        // Create PATCH request
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/ManagerLog?id=eq." + entryToUpdate.getId()))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Content-Type", "application/json")
                .method("PATCH", HttpRequest.BodyPublishers.ofString(jsonRequestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200 && response.statusCode() != 204) {
            throw new Exception("Failed to update ManagerLogEntry: " + response.statusCode() + " " + response.body());
        }

        // don't make any changes to shopify if not accepted.
        if (!accepted) return;

        // GET all existing products to save on individual requests
        // TODO: Handle paginiation. Shopify limits to 50 (or if we ask, 250) products per response.
        request = HttpRequest.newBuilder()
                .uri(URI.create("https://team57-itproject.myshopify.com/admin/api/2024-07/products.json"))
                .header("X-Shopify-Access-Token", SHOPIFY_ADMIN_KEY)
                .header("Accept", "application/json")
                .build();

        response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new Exception("Product extraction from shopify failed: " + response.statusCode());
        }

        String rawProductsListJson = response.body();
        System.out.println(rawProductsListJson);

        // clean up response so we get skus mapping to product variants inventory item ids
        HashMap<String, String> variants = extractVariantIds(rawProductsListJson, baxterBoxService.getAllBaxterBoxes());

        String sku = entryToUpdate.getSku();

        // first, find the inventory id to update
        String inventory_id = variants.get(sku);

        // then, find the existing amount of products available
        int existingQuantity = getInventoryLevel(inventory_id);
        int newQuantity = existingQuantity + entryToUpdate.getProposedQuantityToAdd();
        String location_id = getItemLocation(inventory_id);
        System.out.println(inventory_id);
        System.out.println(location_id);

        // now we can push updates all the way to shopify
        String updateInventoryJson = "{"
                + "\"location_id\":" + location_id + ","
                + "\"inventory_item_id\":" + inventory_id + ","
                + "\"available\": " + newQuantity
                + "}";

        HttpRequest updateRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://team57-itproject.myshopify.com/admin/api/2024-07/inventory_levels/set.json"))
                .header("X-Shopify-Access-Token", SHOPIFY_ADMIN_KEY)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(updateInventoryJson))
                .build();

        HttpResponse<String> updateResponse = client.send(updateRequest, HttpResponse.BodyHandlers.ofString());

        if (updateResponse.statusCode() != 200) {
            throw new Exception("Inventory update failed: " + updateResponse.statusCode());
        }


        System.out.println("Updated manager log entry");

    }

    // THIS RETURNS THE "AVAILABLE" NUMBER, so if there is an order, that's subtracted automagically
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

    // THIS RETURNS THE "AVAILABLE" NUMBER, so if there is an order, that's subtracted automagically
    private String getItemLocation(String inventory_id) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://team57-itproject.myshopify.com/admin/api/2024-07/inventory_levels.json?inventory_item_ids=" + inventory_id))
                .header("X-Shopify-Access-Token", SHOPIFY_ADMIN_KEY)
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());


        if (response.statusCode() != 200) {
            throw new Exception("Failed to get item location level: " + response.statusCode());

        }

        System.out.println(response.body());

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(response.body());
        JsonNode levelsNode = rootNode.path("inventory_levels");

        for (JsonNode level : levelsNode) {
            String location_id = level.path("location_id").asText();

            if (level.path("inventory_item_id").asText().equals(inventory_id)) {
                return location_id;
            }
        }

        return null;
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

    /**
     * Checks whether this box id has been sent to the manager log.
     * The idea being, if someone has packed products into a NEW box, and then sent that as a proposed change,
     * we don't want to recommend that box as being empty for others to pack into as well
     * @param boxId
     * @return
     */
    public boolean isInManagerLog(int boxId) throws Exception {
        ManagerLogEntry[] logEntries = getAllLogEntries();

        // find the entry
        for (ManagerLogEntry entry : logEntries) {
            if (entry.getBox() == boxId) {
                return true;
            }
        }

        return false;
    }
}
