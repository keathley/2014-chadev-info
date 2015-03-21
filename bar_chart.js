var BarChart = (function() {
  var margin      = { top: 0, right: 20, bottom: 30, left: 40 }
    , width       = 960 - margin.right - margin.left
    , height      = 520 - margin.top - margin.bottom
    , barHeight   = 8
    , barWidth    = 10
    , spacer      = 1

  return {
    render: render
  }

  function render(events, cats) {
    barWidth = width / events.length;

    var chart = d3.select("#bar-chart")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xScale = d3.scale.ordinal()
      .domain(events.map(function(d) { return d.name; }))
      .rangeRoundBands([0, width], 0.1);

    var yScale = d3.scale.linear()
      .domain([0, d3.max(events, function(d) { return d.rsvps.length; })])
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom');

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left');

    var tip = d3.tip()
      .attr('class', 'data-tip')
      .offset([-10, 0])
      .html(function(d) {
        var tag = "<span>" + d.name + "</span>";
        return tag;
      });

    chart.call(tip);

    chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    var columns = chart.selectAll('.meetup')
        .data(events)
      .enter().append('g')
        .attr('class', function(d) {
          return 'g ' + cats[d.category].class;
        })
        .attr('transform', function(d) {
          return "translate(" + xScale(d.name) + ",0)";
        });

    columns.append('rect')
      .attr('y', function(d) { return yScale(d.rsvps.length) })
      .attr('height', function(d) { return height - yScale(d.rsvps.length) })
      .attr('width', barWidth - 1)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

    var legendTabs = [15, 120, 220, 340, 460, 580, 700];
    var legend = chart.selectAll('.legend')
        .data(cats)
      .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
          return "translate(" + legendTabs[i] + ", 25)";
        });

    legend.append('rect')
      .attr('x', 0)
      .attr("width", 18)
      .attr('height', 18)
      .attr('class', function(d) { return d.class; });

    legend.append('text')
      .attr('x', 22)
      .attr('y', 9)
      .attr('dy', '.35em')
      .text(function(d) { return d.name; });
  }
})();
