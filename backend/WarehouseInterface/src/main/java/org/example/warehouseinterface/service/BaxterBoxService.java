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
import java.util.ArrayList;
import java.util.List;

import io.github.cdimascio.dotenv.Dotenv;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class BaxterBoxService {

    // REQUIRES A .env FILE IN resources/
    // backend/WarehouseInterface/src/main/resources/.env
    private static final Dotenv dotenv = Dotenv.configure().directory(".env").load();
    private static String SUPABASE_URL = dotenv.get("SUPABASE_URL");
    private static String SUPABASE_API_KEY = dotenv.get("SUPABASE_API_KEY");
    private static HttpClient httpClient;
    private static ObjectMapper objectMapper;

    public BaxterBoxService(HttpClient httpClient, ObjectMapper objectMapper) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
    }

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
    public BaxterBox findBaxterBoxBySKU(String sku, boolean test) throws Exception {
        BaxterBox[] boxes;

        // get all baxter box rows from supabase
        if(test == true){
            boxes = new BaxterBox[5];
            // add in your test baxter boxes, check out the confluence testing page for some use cases!
            boxes[0] = new BaxterBox(0, 1, "ABC", 3, true);
            boxes[1] = new BaxterBox(1, 1, "CAB", 3, true);
            boxes[2] = new BaxterBox(2, 1, "CPU", 3, true);
            boxes[3] = new BaxterBox(3, 1, "ABC", 3, false);
            boxes[4] = new BaxterBox(4, 1, "ABC", 3, true);
        } else {
            boxes = getAllBaxterBoxes();
        }


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
        // TODO: We should update our schema to count stock levels so that we can update
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
}
