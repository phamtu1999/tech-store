package com.techstore.utils;


import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class SlugUtils {

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public static String makeSlug(String input) {
        if (input == null) return null;
        
        // 1. Specific handling for Vietnamese Đ/đ which NFD doesn't normalize to D/d
        input = input.replace("Đ", "D").replace("đ", "d");

        // 2. Remove accents (Vietnamese)
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        
        return slug.toLowerCase(Locale.ENGLISH)
                .replaceAll("-{2,}", "-") // Remove duplicate dashes
                .replaceAll("^-", "")      // Remove leading dash
                .replaceAll("-$", "");     // Remove trailing dash
    }

    public static String deduplicate(String slug) {
        if (slug == null) return null;
        String[] parts = slug.split("-");
        StringBuilder sb = new StringBuilder();
        String last = "";
        for (String p : parts) {
            if (!p.equals(last)) {
                if (sb.length() > 0) sb.append("-");
                sb.append(p);
                last = p;
            }
        }
        return sb.toString();
    }
}
