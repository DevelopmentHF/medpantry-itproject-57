package org.example.warehouseinterface.service;

import org.example.warehouseinterface.EnvironmentManager;
import org.example.warehouseinterface.api.model.BaxterBox;
import org.example.warehouseinterface.api.model.ManagerLogEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpHeaders;
import java.util.ArrayList;
import java.util.List;

import io.github.cdimascio.dotenv.Dotenv;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class BaxterBoxService {

    // REQUIRES A .env FILE IN resources/
    // backend/WarehouseInterface/src/main/resources/.env
    //private static final Dotenv dotenv = Dotenv.configure().directory(".env").load();
    private static String SUPABASE_URL = EnvironmentManager.getEnvVariable("SUPABASE_URL");
    private static String SUPABASE_API_KEY = EnvironmentManager.getEnvVariable("SUPABASE_API_KEY");

    public static HttpClient httpClient = HttpClient.newHttpClient();
    public static ObjectMapper objectMapper = new ObjectMapper();


    /** Returns information about the BaxterBox#id
     * @param id Id of specified baxter box
     * @return The box itself, containing its information
     */
    public BaxterBox getBaxterBox(int id) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/BaxterBoxes?id=eq." + id))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
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
        BaxterBox[] boxes;

        // get all baxter box rows from supabase
        boxes = getAllBaxterBoxes();

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

    // TODO: Edge case when there are multiple orders for the same SKU
    // If they just pack orders one at a time this won't matter
    public List<BaxterBox> findAllBaxterBoxesBySKU(String sku) throws Exception {
        List<BaxterBox> matchingBoxes = new ArrayList<>();

        // get all baxter box rows from supabase
        BaxterBox[] boxes = getAllBaxterBoxes();

        for (BaxterBox box : boxes) {
            if (box.getSKU().equals(sku)) {
                matchingBoxes.add(box);
            }
        }

        return matchingBoxes;
    }

    /**
     *
     * @param SKU
     * @return
     * @throws Exception
     */
    public BaxterBox createBaxterBox(int boxid, String SKU, int units) throws Exception {
        BaxterBox box = new BaxterBox(boxid, 1, SKU, units, false);

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

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200 && response.statusCode() != 204) {
            throw new Exception("Failed to update BaxterBox: " + response.statusCode() + " " + response.body());
        }

        return baxterBox;
    }

    /**
     * Sets a baxter box's full status
     * @param baxterBox
     * @param full
     * @return
     * @throws Exception
     */
    public BaxterBox setBaxterBoxFull(BaxterBox baxterBox, boolean full) throws Exception {
        baxterBox.setFull(full);

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

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200 && response.statusCode() != 204) {
            throw new Exception("Failed to update BaxterBox: " + response.statusCode() + " " + response.body());
        }

        return baxterBox;
    }

    public void freeBaxterBox(BaxterBox baxterBox) throws Exception {
        baxterBox.setUnits(0);
        // baxterBox.setSKU(null); this messes things up
        baxterBox.setFull(false);

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
    }

    /**
     * Finds a unique location id for a new database entry to use
     * Should be near to other boxes which contain products of the same type
     * AND
     * Shouldn't recommend a box location that is currently being proposed in a new manager log entry
     * @Param String sku
     * @return integer location id
     */
    public int findNextId(String sku) throws Exception {
        BaxterBox[] boxes = getAllBaxterBoxes();
        int MAX_BOX_ID = 800;

        List<BaxterBox> boxesWithThisSku = new ArrayList<>();

        // find all boxes containing this product type.
        for (BaxterBox baxterBox : boxes) {
            if (baxterBox.getSKU().equals(sku)) {
                boxesWithThisSku.add(baxterBox);
            }
        }

        // this is a new product, just put it in the lowest free location
        if (boxesWithThisSku.isEmpty()) {
            int lowestFreeId = -1;
            for (BaxterBox box : boxes) {
                if (box.getId() >= lowestFreeId && box.getId() <= MAX_BOX_ID) {  // Check that the id is not over 800
                    lowestFreeId = box.getId() + 1;
                }
            }
            return lowestFreeId;
        }

        ManagerLogEntry[] logEntries = ManagerLogService.getAllLogEntries();

        // find all occupied ids
        List<Integer> occupiedIds = new ArrayList<>();
        for (BaxterBox box : boxes) {
            occupiedIds.add(box.getId());
        }
        for (ManagerLogEntry logEntry : logEntries) {
            occupiedIds.add(logEntry.getBox());
        }

        // ... otherwise, this product exists, what is the nearest number to any boxes with this sku that isn't full
        int nearestId = -10000;

        for (BaxterBox boxWithSku : boxesWithThisSku) {
            int boxId = boxWithSku.getId();
            int nearestIdToThisBox = -1;

            // Check for IDs greater than the current boxId
            for (int i = boxId + 1; i < MAX_BOX_ID; i++) {
                if (!occupiedIds.contains(i)) {
                    nearestIdToThisBox = i;
                    break;
                }
            }

            // Check for IDs less than the current boxId
            for (int i = boxId - 1; i >= 0; i--) {
                if (!occupiedIds.contains(i)) {
                    // If we've already found a nearest ID above, compare which is closer
                    if (nearestIdToThisBox == -1 || (boxId - i < Math.abs(boxId - nearestIdToThisBox))) {
                        nearestIdToThisBox = i;
                    }
                    break;
                }
            }

            // If a nearest ID was found for this box, check if it's closer than the current nearestId
            if (nearestIdToThisBox != -1 && (nearestId == -10000 || Math.abs(nearestIdToThisBox - boxId) < Math.abs(nearestId - boxId))) {
                nearestId = nearestIdToThisBox; 
            }
        }

        // If no suitable box was found, throw an exception
        if (nearestId == -10000) {
            throw new Exception("No free box available under " + MAX_BOX_ID);
        }

        // Return the nearest id found
        return nearestId;
    }

    public BaxterBox[] getAllBaxterBoxes() throws Exception {
        // get all baxter box rows from supabase
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/BaxterBoxes"))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new Exception("Failed to fetch BaxterBoxes: " + response.statusCode());

        }

        BaxterBox[] boxes = objectMapper.readValue(response.body(), BaxterBox[].class);
        return boxes;
    }
}
