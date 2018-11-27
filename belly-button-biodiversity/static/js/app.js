function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = `/metadata/${sample}`;

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response){

    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMeta = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMeta.html("");
    sampleMeta.append("ul");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(response).forEach(entry => {
      sampleMeta.append("li")
      .text(`${entry[0]}: ${entry[1]}`)
      .style("list-style-type", "none")
      .style("font-weight", "bold")
      .style("padding", "5px");
    });
    
    // BONUS: Build the Gauge Chart
    buildGauge(response.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;

    d3.json(url).then(function(response){
      console.log(response)

      // @TODO: Build a Bubble Chart using the sample data
      var bubbleTrace = {
        x: response.otu_ids,
        y: response.sample_values,
        mode: 'markers',
        marker: {
          // color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
          opacity: 0.6,
        }
      };
      
      // var layout = {
      //   title: 'Marker Size and Color',
      //   showlegend: false,
      //   height: 600,
      //   width: 600
      // };
      
      Plotly.newPlot('bubble', [bubbleTrace]);

      // @TODO: Build a Pie Chart
      // Count bacterial across categories
      var aggregateData = {};
      response.sample_values.forEach(function(value, index) {
        var measureType = response.otu_labels[index];
        if(aggregateData[measureType]){
          aggregateData[measureType] += value
        }
        else {
          aggregateData[measureType] = value
        }
      });

      // Convert into an array of arrays in order to sort
      var sortable = [];
      for (var data in aggregateData) {
        sortable.push([data, aggregateData[data]]);
      }
      
      // Sort array
      sortable.sort(function(a, b) {
          return b[1] - a[1];
      });
      topTenData = sortable.slice(0, 10);

      // Create pie chart
      var pieTrace = {
        labels: topTenData.map(entry => entry[0]),
        values: topTenData.map(entry => entry[1]),
        type: "pie"
      };
      var layout = {showlegend: false};
      Plotly.newPlot("pie", [pieTrace], layout);
    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
