package ro.mybuddy.server.post.utils;

import java.nio.charset.Charset;
import java.util.Random;

public class StringGenerator {
    static String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWYZabcdefghijklmnopqrstuvwxyz0123456789";
    public static String generate(){
        String id = "";
        Random rand = new Random();
        for(int i=0;i<32;i++)
            id += alphabet.charAt(rand.nextInt(alphabet.length()));
        return id;
    }
}
