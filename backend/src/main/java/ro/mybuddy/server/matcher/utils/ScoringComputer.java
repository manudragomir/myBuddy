package ro.mybuddy.server.matcher.utils;

import org.springframework.stereotype.Component;
import ro.mybuddy.server.matcher.model.Dog;
import ro.mybuddy.server.matcher.model.MatchDogRequest;

/***
 * Class responsable to implement the ML Algorithm
 * It is designed like a Decision Tree taking into account some thresholds
 * For the moment, the thresholds are hardcoded, but we plan to change them
 * by taking some feedback from users
 * */
@Component
public class ScoringComputer {
    /**
     * Computes the matching coefficient between a dog and a request
     * @param dog Dog
     * @param request Request
     * @return A number between 0 - 10, 10 being the perfect match
    */
    public Double computeScoreForDog(Dog dog, MatchDogRequest request) {
        Double purposeCoef = 0.2;
        Double skillsCoef = 0.4;
        Double watchCoef = 0.1;
        Double priceCoef = 0.2;
        Double weightCoef = 0.1;

        Double purposeScore = purposeCoef * computePurpose(dog, request);
        Double skillsScore = skillsCoef * computeSkills(dog, request);
        Double watchScore = watchCoef * computeWatch(dog, request);
        Double priceScore = priceCoef * computePrice(dog, request);
        Double weightScore = weightCoef * computeWeight(dog, request);
        return purposeScore + skillsScore + watchScore + priceScore + weightScore;
    }

    /**
     * Computes the matching purpose coefficient between a dog and a dog request
     * @param dog The first arg
     * @param request The second arg
     * @return A number between 0 and 100, 100 being the perfect match
     */
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

    /**
     * Computes the matching purpose coefficient between a dog and a dog request
     * @param dog The first arg
     * @param request The second arg
     * @return A number between 0 and 100, 100 being the perfect match
     */
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

    /**
     * Computes the matching purpose coefficient between a dog and a dog request
     * @param dog The first arg
     * @param request The second arg
     * @return A number between 0 and 100, 100 being the perfect match
     */
    public Double computeWatch(Dog dog, MatchDogRequest request) {
        //watchdog is a value between 0 and 10
        //10 - subtraction -> gives the difference between the wish and the dog's value
        return (10 - Math.abs(request.getWatchDog() - dog.getWatchdog())) * 10.0;
    }

    /**
     * Computes the matching price coefficient between a dog and a dog request
     * @param dog The first arg
     * @param request The second arg
     * @return A number between 0 and 100, 100 being the perfect match
     */
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

    /**
     * Computes the matching weight coefficient between a dog and a dog request
     * @param dog The first arg
     * @param request The second arg
     * @return A number between 0 and 100, 100 being the perfect match
     */
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
