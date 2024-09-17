package org.example.warehouseinterface.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;
import org.example.warehouseinterface.api.model.ManagerLogEntry;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class ManagerLogService {

    // REQUIRES A .env FILE IN resources/
    // backend/WarehouseInterface/src/main/resources/.env
    private static final Dotenv dotenv = Dotenv.configure().directory(".env").load();
    private static final String SUPABASE_URL = dotenv.get("SUPABASE_URL");
    private static final String SUPABASE_API_KEY = dotenv.get("SUPABASE_API_KEY");

    /**
     * Creates a new manager log entry in the supabase
     * @throws Exception
     */
    public void handleChangeProposal(int box, String sku, int proposedQuantityToAdd) throws Exception {
        ManagerLogEntry newLogEntry = new ManagerLogEntry(generateUniqueLogId(), box, sku, proposedQuantityToAdd, true, false);

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

        System.out.println("Updated manager log entry");

    }
}
