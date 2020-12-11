package ro.mybuddy.server.post.utils;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum TypePost {
    Adoption {@Override public TypePost update(){ return Adopted;}} ,
    Lost {@Override public TypePost update(){return Found;}},
    MyBuddy {@Override public TypePost update(){return MyBuddy;}},
    Adopted {@Override public TypePost update(){return Adoption;}},
    Found {@Override public TypePost update(){return Lost;}},
    ;
    public abstract TypePost update();
}
