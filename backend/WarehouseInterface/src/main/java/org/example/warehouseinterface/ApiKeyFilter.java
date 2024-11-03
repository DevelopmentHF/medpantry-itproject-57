package org.example.warehouseinterface;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
//import io.github.cdimascio.dotenv.Dotenv;

import java.io.IOException;

@Component
public class ApiKeyFilter extends OncePerRequestFilter {

    //private static final Dotenv dotenv = Dotenv.configure().directory(".env").load();
    //private static String KEY = dotenv.get("API_KEY");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestApiKey = request.getHeader("API-Key");
        String KEY = "martin";

        System.out.println("Request key: " + requestApiKey);
        System.out.println("API-Key: " + KEY);

        if (requestApiKey == null || !requestApiKey.equals(KEY)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
