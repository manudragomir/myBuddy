package ro.mybuddy.server.matcher.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ro.mybuddy.server.matcher.model.Dog;
import ro.mybuddy.server.matcher.model.MatchDogRequest;
import ro.mybuddy.server.matcher.repository.MatcherReader;
import ro.mybuddy.server.matcher.utils.ScoringComputer;

import java.util.*;
import java.util.stream.Collectors;

/***
 * Service for Matcher
 * */
@Component
public class MatcherService {
    @Autowired
    private MatcherReader matcherReader;

    @Autowired
    private ScoringComputer scoringComputer;

    /**
     * Iterates through all dogs, computes the matching score between the request and
     * each dog and then returns the dog with highest score
     * @param matchRequest The match request, the dog is compared to
     * @return The dog with the highest coefficient of matching
     */
    public Dog matchDogBreed(MatchDogRequest matchRequest) {
        List<Dog> dogList = matcherReader.getDogList();
        Map<Dog, Double> dogScores = new HashMap<>();

        dogList.forEach(dog -> {
            Double score = scoringComputer.computeScoreForDog(dog, matchRequest);
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

    /**
     * Computes the union of all skills from all dogs
     * @return The sets of skills from all dogs of all breeds
     */
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

    /**
     * Computes the union of all purposes from all dogs
     * @return The sets of purposes from all dogs of all breeds
     */
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
}
