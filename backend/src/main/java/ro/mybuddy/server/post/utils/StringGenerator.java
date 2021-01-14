package ro.mybuddy.server.post.utils;

import java.nio.charset.Charset;
import java.util.Random;

/**
 * Generator used to generate a unique id for each post
 */
public class StringGenerator {
    static String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWYZabcdefghijklmnopqrstuvwxyz0123456789";

    /**
     * Generate unique string
     * @return String
     */
    public static String generate(){
        String id = "";
        Random rand = new Random();
        for(int i=0;i<32;i++)
            id += alphabet.charAt(rand.nextInt(alphabet.length()));
        return id;
    }
}
