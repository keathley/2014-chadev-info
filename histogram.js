var Histogram = (function() {
  var margin      = { top: 0, right: 20, bottom: 30, left: 40 }
    , width       = 960 - margin.right - margin.left
    , height      = 520 - margin.top - margin.bottom
    , barHeight   = 8
    , barWidth    = 10
    , spacer      = 1
    , users       = {}

  return {
    render: render
  }

  function render(events) {
    barWidth = width / events.length;

    events.forEach(function(event) {
      event.rsvps.forEach(function(rsvp) {
        users[rsvp.name] = users[rsvp.name] || 0
        users[rsvp.name] += 1
      })
    })

    var scores = _.invert(users, true);
    scores = _.keys(scores).map(function(score, stuff) {
      return { score: score, users: scores[score] }
    });

    var x = d3.scale.linear()
      .domain([0, d3.max(scores, function(d) { return d.score; })])
      .range([0, width]);

    var data = d3.layout.histogram()
      .bind(x.ticks(20))
      (scores)

    var y = d3.scale.linear()
      .domain([0, d3.max(scores, function(d) { return d.users.length; })])
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    // var tip = d3.tip()
    //   .attr('class', 'data-tip')
    //   .offset([-10, 0])
    //   .html(function(d) {
    //     var tag = "<span>" + d.name + "</span>";
    //     return tag;
    //   });

    // chart.call(tip);

    var chart = d3.select("#histogram")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var bar = chart.selectAll('.bar')
        .data(data)
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', function(d) {
          console.log(d)
          return "translate(" + x(d.score) + "," + y(d.users.length) + ")"
        })

    bar.append('rect')
      .attr('x', 1)
      .attr('width', x(data[0].dx) - 1)
      .attr('height', function(d) { return height - y(d.users.length) })
  }
})();
