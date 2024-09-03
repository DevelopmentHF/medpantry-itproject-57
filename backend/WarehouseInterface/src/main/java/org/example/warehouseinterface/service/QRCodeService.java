package org.example.warehouseinterface.service;


import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Service;

@Service
public class QRCodeService {

    // REQUIRES A .env FILE IN resources/
    // backend/WarehouseInterface/src/main/resources/.env
    private static final Dotenv dotenv = Dotenv.configure().directory(".env").load();
    private static final String SUPABASE_URL = dotenv.get("SUPABASE_URL");
    private static final String SUPABASE_API_KEY = dotenv.get("SUPABASE_API_KEY");

    /**
     * Takes in a string generated from the qr code and returns the associated product
     * @param qrcode
     * @return
     * @throws Exception
     */
    public String findSku(String qrcode) throws Exception {
        return null;
    }
}
