import * as d3 from 'd3'; 
import * as topojson  from 'topojson';

const countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

var countyData;
var educationData;

let slotion = (c, e) => {
    countyData = c;
    educationData = e;
    return "done";
}
d3.json(countyURL).then(
    (data, erorr) => {
        if(erorr){
            console.log(erorr)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features;
            d3.json(educationURL).then(
                (data, error) => {
                    if(erorr){
                        console.log(erorr);
                    }else {
                        educationData = data;
                        slotion(countyData, educationData);
                    }
                }
            );
        }
    }
);



export default {countyData, educationData};