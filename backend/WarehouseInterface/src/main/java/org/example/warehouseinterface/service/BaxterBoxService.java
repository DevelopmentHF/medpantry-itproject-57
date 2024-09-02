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
public class BaxterBoxService {

    // REQUIRES A .env FILE IN resources/
    // backend/WarehouseInterface/src/main/resources/.env
    private static final Dotenv dotenv = Dotenv.configure().directory(".env").load();
    private static final String SUPABASE_URL = dotenv.get("SUPABASE_URL");
    private static final String SUPABASE_API_KEY = dotenv.get("SUPABASE_API_KEY");

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
}
