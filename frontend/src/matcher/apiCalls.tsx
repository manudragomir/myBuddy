import axios from "axios";
import { baseUrl, withLogs } from "../core";
import { Dog } from "./Dog";

const getDogPurposesUrl = `http://${baseUrl}/match/dog/purposes`;
const getDogSkillsUrl = `http://${baseUrl}/match/dog/skills`;
const matchDogBreedUrl = `http://${baseUrl}/match/dog`;

export const getDogPurposes: () => Promise<string[]> = () =>{
    return withLogs(
        axios({
            method: 'get',
            url: getDogPurposesUrl,
            headers: {
                'Content-Type': 'application/json',
            }
        }),'Get Purposes');
}

export const getDogSkills: () => Promise<string[]> = () =>{
    return withLogs(
        axios({
            method: 'get',
            url: getDogSkillsUrl,
        }),'Get Skills');
}

export const matchDogBreed: (purpose1: string, purpose2: string | undefined, dimension: number, skillsWanted: string[], price: number, watchDog: number) => Promise<Dog> = (purpose1: string, purpose2: string | undefined, dimension: number, skillsWanted: string[], price: number, watchDog: number) =>{
    return withLogs(
        axios({
            method: 'post',
            url: matchDogBreedUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({purpose1: purpose1, purpose2: purpose2, dimension: dimension, skillsWanted: skillsWanted, price:price, watchDog:watchDog})
        }),'Match Dog Breed');
}

