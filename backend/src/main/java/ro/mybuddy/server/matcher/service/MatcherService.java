package ro.mybuddy.server.matcher.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.matcher.model.Dog;
import ro.mybuddy.server.matcher.model.MatchDogRequest;
import ro.mybuddy.server.matcher.repository.MatcherReader;
import ro.mybuddy.server.matcher.utils.ScoringComputer;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class MatcherService {
    @Autowired
    private MatcherReader matcherReader;

    @Autowired
    private ScoringComputer scoringComputer;

    public Dog matchDogBreed(MatchDogRequest matchRequest) {
        List<Dog> dogList = matcherReader.getDogList();
        Map<Dog, Double> dogScores = new HashMap<>();

        dogList.forEach(dog -> {
            Double score = computeScoreForDog(dog, matchRequest);
            //System.out.println("FOR DOG " + dog.getName() + " SCORE: " + score);
            dogScores.put(dog, score);
        });

        List<Dog> sortedScores =
                dogScores.entrySet()
                .stream()
                .sorted((k1, k2) -> -k1.getValue().compareTo(k2.getValue()))
                        .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return sortedScores.get(0);
    }

    public Set<String> getSkills() {
        Map<String, Integer> dogSkillsApp = new HashMap<>();
        List<Dog> dogList = matcherReader.getDogList();
        dogList.forEach(dog -> {
                    dog.getSkills().forEach(skill -> {
                        if(dogSkillsApp.containsKey(skill)){
                            dogSkillsApp.put(skill, dogSkillsApp.get(skill) + 1);
                        }
                        else{
                            dogSkillsApp.put(skill, 0);
                        }
                    });
                }
        );

        // map.entrySet().forEach(x-> System.out.println(x.getKey() + " " + x.getValue()));
        return dogSkillsApp.entrySet()
                .stream()
                .filter(x -> x.getValue() > 4)
                .map(x -> x.getKey())
                .collect(Collectors.toSet());
    }

    public Set<String> getPurposes() {
        List<Dog> dogList = matcherReader.getDogList();
        Map<String, Integer> dogListPurposeApp = new HashMap<>();
        dogList.forEach(dog -> {
            String p1 = dog.getPurpose1();
            String p2 = dog.getPurpose2();

            if (dogListPurposeApp.containsKey(p1)) {
                dogListPurposeApp.put(p1, dogListPurposeApp.get(p1) + 1);
            } else {
                dogListPurposeApp.put(p1, 1);
            }

            if (dogListPurposeApp.containsKey(p2)) {
                dogListPurposeApp.put(p2, dogListPurposeApp.get(p2) + 1);
            } else {
                dogListPurposeApp.put(p2, 1);
            }
        });

        return dogListPurposeApp.entrySet()
                .stream()
                .filter(x -> x.getValue() > 1)
                .map(x -> x.getKey())
                .collect(Collectors.toSet());
    }

    //NEED TO BE IMPROVED TO WORK LIKE ML
    private Double computeScoreForDog(Dog dog, MatchDogRequest request) {
        Double purposeCoef = 0.2;
        Double skillsCoef = 0.4;
        Double watchCoef = 0.1;
        Double priceCoef = 0.2;
        Double weightCoef = 0.1;

        Double purposeScore = purposeCoef * scoringComputer.computePurpose(dog, request);
        Double skillsScore = skillsCoef * scoringComputer.computeSkills(dog, request);
        Double watchScore = watchCoef * scoringComputer.computeWatch(dog, request);
        Double priceScore = priceCoef * scoringComputer.computePrice(dog, request);
        Double weightScore = weightCoef * scoringComputer.computeWeight(dog, request);
        return purposeScore + skillsScore + watchScore + priceScore + weightScore;
    }
}
