package org.example.warehouseinterface;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvException;

public class EnvironmentManager {
    private static Dotenv dotenv;

    static {
        try {
            dotenv = Dotenv.configure().directory(".env").load();
            System.out.println("Loaded environment variables from .env file.");
        } catch (DotenvException e) {
            System.out.println("Dotenv could not load .env file, falling back to system environment variables.");
            dotenv = null; // Mark as null to indicate fallback to system env
        }
    }

    /**
     * Retrieves the value of an environment variable by key.
     * It first tries to get it from Dotenv (if .env file loaded successfully),
     * otherwise it falls back to System.getenv().
     *
     * This is because we've had issues with deployment reading .env files properly.
     *
     * @param key The name of the environment variable.
     * @return The value of the environment variable, or null if not found.
     */
    public static String getEnvVariable(String key) {
        String value = null;

        if (dotenv != null) {
            value = dotenv.get(key);
        }

        if (value == null) {
            value = System.getenv(key);
        }

        if (value == null) {
            System.out.println("Warning: Environment variable " + key + " is not defined.");
        }

        return value;
    }
}
