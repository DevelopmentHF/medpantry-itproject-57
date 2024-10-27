package org.example.warehouseinterface;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.warehouseinterface.api.model.BaxterBox;
import org.example.warehouseinterface.service.BaxterBoxService;
import org.junit.jupiter.api.*;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest;

@ExtendWith(MockitoExtension.class)
public class WarehouseInterfaceApplicationTests {
    @Mock
    private HttpClient mockHttpClient;
    @Mock
    private HttpResponse<String> mockHttpResponse;
    @Mock
    private ObjectMapper mockObjectMapper;
    BaxterBoxService serviceTest;
    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
        serviceTest = new BaxterBoxService();
        BaxterBoxService.httpClient = mockHttpClient;
        BaxterBoxService.objectMapper = mockObjectMapper;
    }


    //test for searching an SKU for a baxter box
    @Disabled
    @ParameterizedTest
    @DisplayName("testing SKU search for baxter boxes")
    @ValueSource(strings = "ABC")
    void TestFindBaxterBoxBySKU(String InputSKU) throws Exception{
        String jsonResponse = "[\n" +
                "    {\"id\": 0, \"warehouseId\": 1, \"SKU\": \"ABC\", \"units\": 3, \"isAvailable\": true},\n" +
                "    {\"id\": 1, \"warehouseId\": 1, \"SKU\": \"CAB\", \"units\": 3, \"isAvailable\": true},\n" +
                "    {\"id\": 2, \"warehouseId\": 1, \"SKU\": \"CPU\", \"units\": 3, \"isAvailable\": true},\n" +
                "    {\"id\": 3, \"warehouseId\": 1, \"SKU\": \"ABC\", \"units\": 3, \"isAvailable\": false}\n" +
                "    {\"id\": 4, \"warehouseId\": 1, \"SKU\": \"ABC\", \"units\": 3, \"isAvailable\": true}\n" +
                "]";

        when(mockHttpResponse.statusCode()).thenReturn(200);
        when(mockHttpResponse.body()).thenReturn(jsonResponse);

        when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(mockHttpResponse);

        BaxterBox[] baxterBoxes = new BaxterBox[] {
                new BaxterBox(0, 1, "ABC", 3, true),
                new BaxterBox(1, 1, "CAB", 3, true),
                new BaxterBox(2, 1, "CPU", 3, true),
                new BaxterBox(3, 1, "ABC", 3, false),
                new BaxterBox(4, 1, "ABC", 3, true)
        };
        when(mockObjectMapper.readValue(jsonResponse, BaxterBox[].class)).thenReturn(baxterBoxes);

        BaxterBox OutputBox = serviceTest.findBaxterBoxBySKU(InputSKU);
        Assertions.assertAll(() -> assertEquals(3, OutputBox.getId()),
                () -> assertEquals(InputSKU, OutputBox.getSKU()),
                () -> assertEquals(1, OutputBox.getWarehouseId()));
    }

    //test updating a baxter box when the http request works
    @Disabled
    @ParameterizedTest
    @DisplayName("updating a baxter box, success")
    @ValueSource(ints = 1)
    void TestUpdatingABaxterBoxSuccess(int Units) throws Exception{
        BaxterBox TestBox = new BaxterBox(1, 1, "ABC", 7, true);

        when(mockObjectMapper.writeValueAsString(TestBox)).thenReturn("{ \"id\": 1, \"units\": 15 }");
        when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class))).thenReturn(mockHttpResponse);
        when(mockHttpResponse.statusCode()).thenReturn(200);

        BaxterBox OutputTestBox = serviceTest.updateBaxterBox(TestBox, Units);
        Assertions.assertAll(() -> assertEquals(1, OutputTestBox.getId()),
                () -> assertEquals(1, OutputTestBox.getWarehouseId()),
                () -> assertEquals("ABC", OutputTestBox.getSKU()),
                () -> assertEquals(8, OutputTestBox.getUnits()));
        verify(mockHttpClient).send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class));
    }


    //test to see that the method throws an exception when the
    //http request fails
    @Disabled
    @ParameterizedTest
    @DisplayName("updating a baxter box, failure")
    @ValueSource(ints=1)
    void TestUpdatingABaxterBoxFailure(int Units) throws Exception{
        BaxterBox TestBox = new BaxterBox(1, 1, "ABC", 7, true);

        when(mockObjectMapper.writeValueAsString(TestBox)).thenReturn("{ \"id\": 1, \"units\": 15 }");
        when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class))).thenReturn(mockHttpResponse);
        when(mockHttpResponse.statusCode()).thenReturn(500);
        when(mockHttpResponse.body()).thenReturn("Internal Server Error");

        Exception exception = assertThrows(Exception.class, () -> {
            serviceTest.updateBaxterBox(TestBox, 5);
        });

        assertEquals("Failed to update BaxterBox: 500 Internal Server Error", exception.getMessage());
    }

    //testing getting a box successfully, NOT WORKING YET (I think it might be an
    //issue regarding how  I handle mock responses or the implementation of getbaxterbox
    @Disabled
    @Test
    void GetTestBoxesSuccess() throws Exception{
        BaxterBox TestBox = new BaxterBox(1, 1, "ABC", 7, true);
        String jsonResponse = "[{\"id\": 1, \"warehouseId\": 1, \"SKU\": \"ABC\", \"units\": 7, \"isAvailable\": true}]";
        // mock the 200 http response
        when(mockHttpResponse.statusCode()).thenReturn(200);
        when(mockHttpResponse.body()).thenReturn(jsonResponse);

        //mock the mock client returning the mock response
        when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(mockHttpResponse);
        //mock object mapper
        BaxterBox[] baxterBoxes = {TestBox};
        when(mockObjectMapper.readValue(jsonResponse, BaxterBox[].class)).thenReturn(baxterBoxes);

        BaxterBox Result = serviceTest.getBaxterBox(1);
        assertNotNull(Result);
        Assertions.assertAll(() -> assertEquals(1, Result.getId()),
                () -> assertEquals(1, Result.getWarehouseId()),
                () -> assertEquals("ABC", Result.getSKU()),
                () -> assertEquals(7, Result.getUnits()));

    }

    @Disabled
    @Test
    void testGetBaxterBoxNotFound() throws Exception {
        String jsonResponse = "[]";

        when(mockHttpResponse.statusCode()).thenReturn(200);
        when(mockHttpResponse.body()).thenReturn(jsonResponse);

        when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(mockHttpResponse);

        BaxterBox[] baxterBoxes = {};
        when(mockObjectMapper.readValue(jsonResponse, BaxterBox[].class)).thenReturn(baxterBoxes);

        Exception exception = assertThrows(Exception.class, () -> {
            serviceTest.getBaxterBox(1);
        });

        assertEquals("No BaxterBox found with the given ID", exception.getMessage());
    }

    @Disabled
    @Test
    void testGetBaxterBoxHttpError() throws Exception {

        when(mockHttpResponse.statusCode()).thenReturn(500);
        when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(mockHttpResponse);

        Exception exception = assertThrows(Exception.class, () -> {
            serviceTest.getBaxterBox(1);
        });

        assertTrue(exception.getMessage().contains("Failed to fetch BaxterBox: " + mockHttpResponse.statusCode()));
    }

    @Disabled
    @Test
    @DisplayName("find next ID, Success")
    void findNextIdTestSuccess() throws Exception{
        String jsonResponse = "[\n" +
                "    {\"id\": 1, \"warehouseId\": 1, \"SKU\": \"Box1\", \"units\": 7, \"isAvailable\": true},\n" +
                "    {\"id\": 2, \"warehouseId\": 1, \"SKU\": \"Box2\", \"units\": 5, \"isAvailable\": false},\n" +
                "    {\"id\": 3, \"warehouseId\": 1, \"SKU\": \"Box3\", \"units\": 9, \"isAvailable\": true},\n" +
                "    {\"id\": 4, \"warehouseId\": 1, \"SKU\": \"Box4\", \"units\": 4, \"isAvailable\": true}\n" +
                "]";

        when(mockHttpResponse.statusCode()).thenReturn(200);
        when(mockHttpResponse.body()).thenReturn(jsonResponse);

        when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(mockHttpResponse);

        BaxterBox[] baxterBoxes = new BaxterBox[] {
                new BaxterBox(1, 1, "Box1", 7, true),
                new BaxterBox(2, 1, "Box2", 5, false),
                new BaxterBox(3, 1, "Box3", 9, true),
                new BaxterBox(4, 1, "Box4", 4, true)
        };
        when(mockObjectMapper.readValue(jsonResponse, BaxterBox[].class)).thenReturn(baxterBoxes);

        //int Result = serviceTest.findNextId();
        // TODO: Rewrite this unit test to work with proper box finding system
        int Result = -1;
        assertEquals(5, Result);

    }

    @Disabled
    @Test
    @DisplayName("find next ID, Failure")
    void findNextIdTestFailure() throws Exception{
        when(mockHttpResponse.statusCode()).thenReturn(500);
        when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(mockHttpResponse);

        Exception exception = assertThrows(Exception.class, () -> {
            serviceTest.findNextId("1"); // TODO: Rewrite this test to work with proper box finding system
        });

        assertTrue(exception.getMessage().contains("Failed to fetch BaxterBoxes: " + mockHttpResponse.statusCode()));

    }

}
