package ro.mybuddy.server.matcher.repository;

import org.springframework.stereotype.Component;
import ro.mybuddy.server.matcher.model.Dog;

import java.io.*;
import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Component
public class MatcherReader {
    List<Dog> dogList;
    private final String dogPathCsv = "dog_breed_characteristics.csv";
    private final String catPathCsv = "cat_breed_characteristics.csv";

    public List<Dog> getDogList(){
        if(dogList == null){
            try {
                dogList = new ArrayList<>();
                readFromFile();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return dogList;
    }

    private List<String> getSkills(String skills){
        skills = skills.replaceAll("\\s+", "");
        skills = skills.replaceAll("\"", "");
        skills = skills.replaceAll("\\\\", "");
        return Arrays.asList(skills.split(","));
    }

    private Dog constructDogFromLine(List<String> elems, Integer id){
        //System.out.println(elems);
        Integer popularity = null;
        Integer intelligence = null;
        if(!elems.get(12).equals("")) popularity = Integer.parseInt(elems.get(12));
        if(!elems.get(7).equals("")) popularity = Integer.parseInt(elems.get(7));

        return Dog.builder()
                .id(id)
                .name(elems.get(0))
                .altName(elems.get(1))
                .purpose1(elems.get(2))
                .purpose2(elems.get(3))
                .weight(Integer.parseInt(elems.get(4)))
                .skills(getSkills(elems.get(5)))
                .avgPrice(Integer.parseInt(elems.get(6)))
                .intelligence(intelligence)
                .watchdog(Integer.parseInt(elems.get(8)))
                .popularity(popularity)
                .build();
    }

    private void readFromFile() throws Exception{
        InputStream is = getClass().getClassLoader().getResourceAsStream(dogPathCsv);
        InputStreamReader isr = new InputStreamReader(is);
        BufferedReader br = new BufferedReader(isr);
        String line;
        br.readLine();
        while ((line = br.readLine()) != null)
        {
            List<String> elems = Arrays.asList(line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1));
            Dog dog = constructDogFromLine(elems, dogList.size());
            dogList.add(dog);
        }
        br.close();
        isr.close();
        is.close();
    }

}
