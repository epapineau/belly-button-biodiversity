function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = `/metadata/${sample}`;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response){

    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMeta = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    sampleMeta.html("");
    sampleMeta.append("ul");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(response).forEach(entry => {
      console.log(entry[0]);
      console.log(entry[1]);
      sampleMeta.append("li")
      .text(`${entry[0]}: ${entry[1]}`)
      .style("list-style-type", "none")
      .style("font-weight", "bold")
      .style("padding", "5px");
    });
    
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
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
