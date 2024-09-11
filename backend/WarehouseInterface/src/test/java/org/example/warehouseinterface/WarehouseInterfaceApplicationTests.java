package org.example.warehouseinterface;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.warehouseinterface.api.model.BaxterBox;
import org.example.warehouseinterface.service.BaxterBoxService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import org.junit.jupiter.api.Test;
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
        serviceTest = new BaxterBoxService(mockHttpClient, mockObjectMapper);
    }


    //test for searching an SKU for a baxter box
    @ParameterizedTest
    @DisplayName("testing SKU search for baxter boxes")
    @ValueSource(strings = "ABC")
    void TestFindBaxterBoxBySKU(String InputSKU) throws Exception{

        BaxterBox OutputBox = serviceTest.findBaxterBoxBySKU(InputSKU, true);
        Assertions.assertAll(() -> assertEquals(3, OutputBox.getId()),
                () -> assertEquals(InputSKU, OutputBox.getSKU()),
                () -> assertEquals(1, OutputBox.getWarehouseId()));
    }

    //test updating a baxter box when the http request works
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

    @Test
    void testGetBaxterBox_httpError() throws Exception {

        when(mockHttpResponse.statusCode()).thenReturn(500);

        when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(mockHttpResponse);

        Exception exception = assertThrows(Exception.class, () -> {
            serviceTest.getBaxterBox(1);
        });

        assertEquals("Failed to fetch BaxterBox: 500", exception.getMessage());
    }


}
