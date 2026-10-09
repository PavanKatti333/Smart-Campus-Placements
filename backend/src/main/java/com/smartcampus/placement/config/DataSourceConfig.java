package com.smartcampus.placement.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username:root}")
    private String dbUsername;

    @Value("${spring.datasource.password:}")
    private String dbPassword;

    @Value("${spring.datasource.driver-class-name:com.mysql.cj.jdbc.Driver}")
    private String driverClassName;

    @Value("${db.fallback.enabled:true}")
    private boolean fallbackEnabled;

    @Bean
    @Primary
    public DataSource dataSource() {
        boolean canConnect = testConnection(dbUrl, dbUsername, dbPassword, driverClassName);

        if (canConnect) {
            log.info("Successfully connected to primary database at: {}", sanitizeUrl(dbUrl));
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(dbUrl);
            config.setUsername(dbUsername);
            config.setPassword(dbPassword);
            config.setDriverClassName(driverClassName);
            config.setMaximumPoolSize(10);
            config.setConnectionTimeout(15000);
            return new HikariDataSource(config);
        }

        if (fallbackEnabled) {
            log.warn("================================================================================");
            log.warn("PRIMARY DATABASE UNREACHABLE: [{}]", sanitizeUrl(dbUrl));
            log.warn("ACTIVATING EMBEDDED IN-MEMORY DATABASE (H2 in MySQL mode).");
            log.warn("The application will start immediately with seeded sample data so deployments");
            log.warn("remain healthy on Render/Cloud even before remote MySQL is connected.");
            log.warn("================================================================================");

            HikariConfig h2Config = new HikariConfig();
            h2Config.setJdbcUrl("jdbc:h2:mem:smart_campus_placement;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH;DB_CLOSE_DELAY=-1");
            h2Config.setDriverClassName("org.h2.Driver");
            h2Config.setUsername("sa");
            h2Config.setPassword("");
            h2Config.setMaximumPoolSize(5);
            return new HikariDataSource(h2Config);
        }

        // If fallback disabled, attempt default Hikari connection
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(dbUrl);
        config.setUsername(dbUsername);
        config.setPassword(dbPassword);
        config.setDriverClassName(driverClassName);
        return new HikariDataSource(config);
    }

    private boolean testConnection(String url, String user, String pass, String driver) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        try {
            Class.forName(driver);
            DriverManager.setLoginTimeout(3);
            String testUrl = url;
            if (!testUrl.contains("connectTimeout")) {
                testUrl += (testUrl.contains("?") ? "&" : "?") + "connectTimeout=3000&socketTimeout=3000";
            }
            try (Connection conn = DriverManager.getConnection(testUrl, user, pass)) {
                return conn != null && !conn.isClosed();
            }
        } catch (Throwable t) {
            log.warn("Database connectivity test to [{}] failed: {}", sanitizeUrl(url), t.getMessage());
            return false;
        }
    }

    private String sanitizeUrl(String url) {
        if (url == null) return "null";
        return url.replaceAll("password=[^&]*", "password=***");
    }
}
