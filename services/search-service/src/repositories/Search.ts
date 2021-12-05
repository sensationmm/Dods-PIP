import {GetContentParameters} from "../domain";

export interface Search {
    getContent(data: GetContentParameters): Promise<any>;
}