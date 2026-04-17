package com.techstore.service.settings;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Service for resolving IP addresses to geographic locations.
 * Integrates with ip-api.com free tier API with rate limiting and caching.
 */
@Service
@Slf4j
public class GeolocationService {

    private static final String IP_API_URL = "http://ip-api.com/json/";
    private static final String CACHE_KEY_PREFIX = "geolocation:";
    private static final long CACHE_TTL_HOURS = 24;
    private static final int RATE_LIMIT_CAPACITY = 45; // 45 requests per minute (free tier limit)

    private final RestTemplate restTemplate;
    private final RedisTemplate<String, Object> redisTemplate;
    private final Bucket rateLimitBucket;

    @Autowired
    public GeolocationService(@Autowired(required = false) RedisTemplate<String, Object> redisTemplate) {
        this.restTemplate = new RestTemplate();
        this.redisTemplate = redisTemplate;
        this.rateLimitBucket = createRateLimitBucket();
    }

    /**
     * Creates a rate limit bucket for the ip-api.com API.
     * Configured for 45 requests per minute (free tier limit).
     *
     * @return Bucket instance for rate limiting
     */
    private Bucket createRateLimitBucket() {
        // Create bandwidth limit: 45 tokens, refill 45 tokens per minute
        Bandwidth limit = Bandwidth.builder()
                .capacity(RATE_LIMIT_CAPACITY)
                .refillIntervally(RATE_LIMIT_CAPACITY, Duration.ofMinutes(1))
                .build();

        // For simplicity, use a local bucket (not distributed)
        // In a multi-instance deployment, consider using distributed bucket with Redis
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Resolves an IP address to a simple location string.
     * Returns format: "City, Region, Country" or "Unknown" if resolution fails.
     *
     * @param ipAddress IP address to resolve
     * @return Location string or "Unknown"
     */
    public String resolveLocation(String ipAddress) {
        if (ipAddress == null || ipAddress.trim().isEmpty()) {
            log.debug("Invalid IP address provided: {}", ipAddress);
            return "Unknown";
        }

        // Normalize IP address (trim whitespace)
        ipAddress = ipAddress.trim();

        // Check for localhost/private IPs
        if (isLocalOrPrivateIp(ipAddress)) {
            log.debug("Local or private IP address: {}", ipAddress);
            return "Local Network";
        }

        try {
            GeolocationData data = resolveLocationDetailed(ipAddress);
            if (data != null && "success".equals(data.getStatus())) {
                return formatLocationString(data);
            }
        } catch (Exception e) {
            log.error("Error resolving location for IP {}: {}", ipAddress, e.getMessage());
        }

        return "Unknown";
    }

    /**
     * Resolves an IP address to detailed geolocation data.
     * Implements caching and rate limiting.
     *
     * @param ipAddress IP address to resolve
     * @return GeolocationData object or null if resolution fails
     */
    public GeolocationData resolveLocationDetailed(String ipAddress) {
        if (ipAddress == null || ipAddress.trim().isEmpty()) {
            log.debug("Invalid IP address provided: {}", ipAddress);
            return null;
        }

        // Normalize IP address
        ipAddress = ipAddress.trim();

        // Check for localhost/private IPs
        if (isLocalOrPrivateIp(ipAddress)) {
            log.debug("Local or private IP address: {}", ipAddress);
            return createLocalNetworkData(ipAddress);
        }

        // Check cache first
        String cacheKey = CACHE_KEY_PREFIX + ipAddress;
        GeolocationData cachedData = getCachedData(cacheKey);
        if (cachedData != null) {
            log.debug("Cache hit for IP: {}", ipAddress);
            return cachedData;
        }

        // Check rate limit
        if (!rateLimitBucket.tryConsume(1)) {
            log.warn("Rate limit exceeded for geolocation API");
            return null;
        }

        // Call ip-api.com API
        try {
            String url = IP_API_URL + ipAddress;
            log.debug("Calling ip-api.com for IP: {}", ipAddress);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response != null) {
                GeolocationData data = mapResponseToData(response);
                
                // Cache the result if successful
                if ("success".equals(data.getStatus())) {
                    cacheData(cacheKey, data);
                    log.debug("Successfully resolved and cached location for IP: {}", ipAddress);
                }
                
                return data;
            }
        } catch (Exception e) {
            log.error("Error calling ip-api.com for IP {}: {}", ipAddress, e.getMessage());
        }

        return null;
    }

    /**
     * Formats geolocation data into a readable location string.
     *
     * @param data GeolocationData object
     * @return Formatted location string
     */
    private String formatLocationString(GeolocationData data) {
        StringBuilder location = new StringBuilder();
        
        if (data.getCity() != null && !data.getCity().isEmpty()) {
            location.append(data.getCity());
        }
        
        if (data.getRegionName() != null && !data.getRegionName().isEmpty()) {
            if (location.length() > 0) {
                location.append(", ");
            }
            location.append(data.getRegionName());
        }
        
        if (data.getCountry() != null && !data.getCountry().isEmpty()) {
            if (location.length() > 0) {
                location.append(", ");
            }
            location.append(data.getCountry());
        }
        
        return location.length() > 0 ? location.toString() : "Unknown";
    }

    /**
     * Checks if an IP address is localhost or a private network address.
     *
     * @param ipAddress IP address to check
     * @return true if local or private, false otherwise
     */
    private boolean isLocalOrPrivateIp(String ipAddress) {
        return ipAddress.equals("127.0.0.1") ||
               ipAddress.equals("::1") ||
               ipAddress.equals("0:0:0:0:0:0:0:1") ||
               ipAddress.equals("localhost") ||
               ipAddress.startsWith("192.168.") ||
               ipAddress.startsWith("10.") ||
               ipAddress.startsWith("172.16.") ||
               ipAddress.startsWith("172.17.") ||
               ipAddress.startsWith("172.18.") ||
               ipAddress.startsWith("172.19.") ||
               ipAddress.startsWith("172.20.") ||
               ipAddress.startsWith("172.21.") ||
               ipAddress.startsWith("172.22.") ||
               ipAddress.startsWith("172.23.") ||
               ipAddress.startsWith("172.24.") ||
               ipAddress.startsWith("172.25.") ||
               ipAddress.startsWith("172.26.") ||
               ipAddress.startsWith("172.27.") ||
               ipAddress.startsWith("172.28.") ||
               ipAddress.startsWith("172.29.") ||
               ipAddress.startsWith("172.30.") ||
               ipAddress.startsWith("172.31.");
    }

    /**
     * Creates a GeolocationData object for local network addresses.
     *
     * @param ipAddress IP address
     * @return GeolocationData object
     */
    private GeolocationData createLocalNetworkData(String ipAddress) {
        GeolocationData data = new GeolocationData();
        data.setStatus("success");
        data.setQuery(ipAddress);
        data.setCountry("Local Network");
        data.setCity("Local");
        return data;
    }

    /**
     * Retrieves cached geolocation data from Redis.
     *
     * @param cacheKey Redis cache key
     * @return GeolocationData object or null if not found
     */
    private GeolocationData getCachedData(String cacheKey) {
        if (redisTemplate == null) {
            return null; // Redis not available (e.g., in test environment)
        }
        
        try {
            Object cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached instanceof GeolocationData) {
                return (GeolocationData) cached;
            }
        } catch (Exception e) {
            log.warn("Error retrieving cached geolocation data: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Caches geolocation data in Redis with 24-hour TTL.
     *
     * @param cacheKey Redis cache key
     * @param data GeolocationData to cache
     */
    private void cacheData(String cacheKey, GeolocationData data) {
        if (redisTemplate == null) {
            return; // Redis not available (e.g., in test environment)
        }
        
        try {
            redisTemplate.opsForValue().set(cacheKey, data, CACHE_TTL_HOURS, TimeUnit.HOURS);
        } catch (Exception e) {
            log.warn("Error caching geolocation data: {}", e.getMessage());
        }
    }

    /**
     * Maps ip-api.com API response to GeolocationData object.
     *
     * @param response API response map
     * @return GeolocationData object
     */
    private GeolocationData mapResponseToData(Map<String, Object> response) {
        GeolocationData data = new GeolocationData();
        
        data.setStatus(getStringValue(response, "status"));
        data.setCountry(getStringValue(response, "country"));
        data.setCountryCode(getStringValue(response, "countryCode"));
        data.setRegion(getStringValue(response, "region"));
        data.setRegionName(getStringValue(response, "regionName"));
        data.setCity(getStringValue(response, "city"));
        data.setZip(getStringValue(response, "zip"));
        data.setTimezone(getStringValue(response, "timezone"));
        data.setIsp(getStringValue(response, "isp"));
        data.setOrg(getStringValue(response, "org"));
        data.setAs(getStringValue(response, "as"));
        data.setQuery(getStringValue(response, "query"));
        
        // Handle numeric values
        if (response.containsKey("lat")) {
            data.setLat(getDoubleValue(response, "lat"));
        }
        if (response.containsKey("lon")) {
            data.setLon(getDoubleValue(response, "lon"));
        }
        
        return data;
    }

    /**
     * Safely extracts a string value from a map.
     *
     * @param map Source map
     * @param key Key to extract
     * @return String value or null
     */
    private String getStringValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value != null ? value.toString() : null;
    }

    /**
     * Safely extracts a double value from a map.
     *
     * @param map Source map
     * @param key Key to extract
     * @return Double value or null
     */
    private Double getDoubleValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return null;
    }

    /**
     * Data class representing geolocation information from ip-api.com.
     */
    public static class GeolocationData {
        private String status;
        private String country;
        private String countryCode;
        private String region;
        private String regionName;
        private String city;
        private String zip;
        private Double lat;
        private Double lon;
        private String timezone;
        private String isp;
        private String org;
        private String as;
        private String query;

        // Getters and setters
        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getCountryCode() {
            return countryCode;
        }

        public void setCountryCode(String countryCode) {
            this.countryCode = countryCode;
        }

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }

        public String getRegionName() {
            return regionName;
        }

        public void setRegionName(String regionName) {
            this.regionName = regionName;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getZip() {
            return zip;
        }

        public void setZip(String zip) {
            this.zip = zip;
        }

        public Double getLat() {
            return lat;
        }

        public void setLat(Double lat) {
            this.lat = lat;
        }

        public Double getLon() {
            return lon;
        }

        public void setLon(Double lon) {
            this.lon = lon;
        }

        public String getTimezone() {
            return timezone;
        }

        public void setTimezone(String timezone) {
            this.timezone = timezone;
        }

        public String getIsp() {
            return isp;
        }

        public void setIsp(String isp) {
            this.isp = isp;
        }

        public String getOrg() {
            return org;
        }

        public void setOrg(String org) {
            this.org = org;
        }

        public String getAs() {
            return as;
        }

        public void setAs(String as) {
            this.as = as;
        }

        public String getQuery() {
            return query;
        }

        public void setQuery(String query) {
            this.query = query;
        }
    }
}
