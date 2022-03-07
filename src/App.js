import React, { Component, createRef } from 'react';
import "./App.css";
import * as d3 from 'd3';
import * as topojson  from 'topojson';

class App extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  componentDidMount() {
    this.update();
  }

  update() {
    const w = 1200;
    const h = 1000;
    const padding = 60;
    const countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
    const educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
    var countyData;
    var educationData;
    const svg = d3.select(this.myRef.current)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);
    
    let darwMap = () => {
      svg.selectAll('path')
         .data(countyData)
         .enter()
         .append('path')
         .attr('d', d3.geoPath())
         .attr('class', 'county')
         .attr('fill', (d) => {
           let id = d['id'];
           let county = educationData.find((item) => {
             console.log(item['fips'] === id)
             return item['fips'] === id;
           })
           console.log(county['bachelorsOrHigher'])
           return "orange";
         })
    }

    d3.json(countyURL).then(
        (data, erorr) => {
            if(erorr){
                console.log(erorr)
            }else{
                countyData = topojson.feature(data, data.objects.counties).features;
                d3.json(educationURL).then(
                    (data, erorr) => {
                        if(erorr){
                            console.log(erorr);
                        }else {
                            educationData = data;
                            darwMap();
                        }
                    }
                );
            }
        }
    );
  }
  state = {  }
  render() { 
    return (
      <div className='App'>
        <h1 id="title">United States Educational Attainment</h1>
        <p id="description">Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</p>
        <div className='contianer'>
          <svg id="legend"></svg>
          <div className='graph' ref={this.myRef}></div>        
        </div>
        <div id="tooltip"></div>
      </div>
    );
  }
}
 
export default App;