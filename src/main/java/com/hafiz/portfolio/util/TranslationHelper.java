package com.hafiz.portfolio.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class TranslationHelper {

    private static final ObjectMapper mapper = new ObjectMapper();

    public static Map<String, Map<String, Object>> parse(String json) {
        if (json == null || json.isBlank()) return Collections.emptyMap();
        try {
            return mapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }

    public static String serialize(Map<String, Map<String, Object>> map) {
        if (map == null || map.isEmpty()) return null;
        try {
            return mapper.writeValueAsString(map);
        } catch (Exception e) {
            return null;
        }
    }

    public static String str(Map<String, Map<String, Object>> t, String locale, String field, String defaultVal) {
        if (t == null || locale == null || locale.equals("en")) return defaultVal;
        Map<String, Object> localeMap = t.get(locale);
        if (localeMap == null) return defaultVal;
        Object val = localeMap.get(field);
        if (val instanceof String s && !s.isBlank()) return s;
        return defaultVal;
    }

    @SuppressWarnings("unchecked")
    public static List<String> list(Map<String, Map<String, Object>> t, String locale, String field, List<String> defaultVal) {
        if (t == null || locale == null || locale.equals("en")) return defaultVal;
        Map<String, Object> localeMap = t.get(locale);
        if (localeMap == null) return defaultVal;
        Object val = localeMap.get(field);
        if (val instanceof List<?> list && !list.isEmpty()) return (List<String>) list;
        return defaultVal;
    }
}
