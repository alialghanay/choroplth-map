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
    const colors = ["#BFBFFF", "#A3A3FF", "#7879FF",	"#4949FF", "#1F1FFF", "#0000FF"];
    let tooltip = d3.select('#tooltip');
    const svg = d3.select(this.myRef.current)
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);
    const zScale = d3.scaleLinear()
                     .domain([0, 70])
                     .range([0, 70 * 4]);
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
             return item['fips'] === id;
           })
           let percentage = county['bachelorsOrHigher'];
           
           if(percentage <= 10){
             return colors[0];
           }else if(percentage <= 20){
            return colors[1];
           }else if(percentage <= 30){
            return colors[2];
           }else if(percentage <= 40){
            return colors[3];
           }else if(percentage <= 50){
            return colors[4];
           }else {
            return colors[5];
           }
         })
         .attr("data-fips", (d) => d['id'])
         .attr("data-education", (d) => {
          let id = d['id'];
          let colors = ["#BFBFFF", "#A3A3FF", "#7879FF",	"#4949FF", "#1F1FFF", "#0000FF"];
          let county = educationData.find((item) => {
            return item['fips'] === id;
          })
          let percentage = county['bachelorsOrHigher'];
          return percentage;
         })
         .on('mouseover', (d, i) => {
          let id = i['id'];
          let county = educationData.find((item) => {
            return item['fips'] === id;
          })
          tooltip.transition()
                 .style('visibility', 'visible')
                 .style('left', d.pageX + 'px')
                 .style('top', (d.pageY - 50) + 'px');
          tooltip.html(
              county['fips'] +
              ',  ' +
              county['area_name'] +
              '<br/>' +
              county['state'] +
              ':  ' +
              county['bachelorsOrHigher'] + ' %.' 
            );
  
          document.querySelector('#tooltip').setAttribute("data-education", county["bachelorsOrHigher"]);
        })
        .on('mouseout', () => {
          tooltip.transition()
                 .style('visibility', 'hidden');
        });;
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

    const legend =  d3.select('#legend');

  
    legend.selectAll('rect')
          .data(colors)
          .enter()
          .append('rect')
          .attr('width', 60)
          .attr('height', 37.5)
          .attr('x', (d, i) => i * 50)
          .attr('y', 10)
          .attr('fill', (d, i) => d);

    const zAxis = d3.axisBottom(zScale);

    legend.append('g')
    .attr('transform', `translate(10, ${padding})`)
    .call(zAxis)
    .attr('id', 'z-axis');

  }
  state = {  }
  render() { 
    return (
      <div className='App'>
        <h1 id="title">United States Educational Attainment</h1>
        <p id="description">Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</p>
        <div className='contianer'>
          <div className='graph' ref={this.myRef}></div>
          <svg id="legend"></svg>        
        </div>
        <div id="tooltip"></div>
      </div>
    );
  }
}
 
export default App;



