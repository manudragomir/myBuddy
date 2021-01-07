package ro.mybuddy.server.matcher.utils;

import org.springframework.stereotype.Component;
import ro.mybuddy.server.matcher.model.Dog;
import ro.mybuddy.server.matcher.model.MatchDogRequest;

@Component
public class ScoringComputer {
    //return a number between 0 and 100
    public Double computePurpose(Dog dog, MatchDogRequest request) {
        Double score = 0.0;
        if(request.getPurpose1().equals(dog.getPurpose1()) || request.getPurpose1().equals(dog.getPurpose2())){
            score += 50;
        }
        if(request.getPurpose2().equals(dog.getPurpose1()) || request.getPurpose2().equals(dog.getPurpose2())){
            score += 50;
        }
        return score;
    }

    //return a score between 0 and 100
    public Double computeSkills(Dog dog, MatchDogRequest request) {
        Integer score = 0;
        int skillsWanted = request.getSkillsWanted().size();
        for(String skill: request.getSkillsWanted()){
            if(dog.getSkills().contains(skill)){
                score += 1;
            }
        }
        return (score / skillsWanted) * 100.0;
    }

    //return a value between 0 and 100
    public Double computeWatch(Dog dog, MatchDogRequest request) {
        //watchdog is a value between 0 and 10
        //10 - subtraction -> gives the difference between the wish and the dog's value
        return (10 - Math.abs(request.getWatchDog() - dog.getWatchdog())) * 10.0;
    }

    public Double computePrice(Dog dog, MatchDogRequest request) {
        int diff = Math.abs(request.getPrice() - dog.getAvgPrice());
        if(diff <= 400){
            return 100.0;
        }
        if(diff <= 800){
            return 50.0;
        }
        if(diff <= 1000){
            return 10.0;
        }
        return 0.0;
    }

    public Double computeWeight(Dog dog, MatchDogRequest request) {
        //if dimension = 0 -> it means small dog -> small dog < 15kg;
        //if dimension = 1 -> it means medium dog -> medium dog > 15kg < 40kg;
        //if dimension = 2 -> it means big dog -> big dog > 40 kg;
        int dimension = 1;
        if(dog.getWeight() < 15) dimension = 0;
        if(dog.getWeight() > 40) dimension = 2;

        if(Math.abs(request.getDimension() - dimension) == 0){
            return 100.0;
        }
        if(Math.abs(request.getDimension() - dimension) == 1){
            return 50.0;
        }
        return 0.0;
    }
}
