(function() {

// Chart design based on the recommendations of Stephen Few. Implementation
// based on the work of Clint Ivy, Jamie Love, and Jason Davies.
// http://projects.instantcognition.com/protovis/bulletchart/
d3.bulletVertical = function() {
  var orient = "left",
      reverse = false,
      vertical = false,
      ranges = bulletRanges,
      markers = bulletMarkers,
      measures = bulletMeasures,
      width = 380,
      height = 30,
      xAxis = d3.svg.axis();

  // For each small multiple…
  function bullet(g) {
    g.each(function(d, i) {
      var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
          markerz = markers.call(this, d, i).slice().sort(d3.descending),
          measurez = measures.call(this, d, i).slice().sort(d3.descending),
          g = d3.select(this),
          extentX,
          extentY;

      var wrap = g.select("g.wrap");
      if (wrap.empty()) wrap = g.append("g").attr("class", "wrap");

      if (vertical) {
        extentX = height, extentY = width;
        wrap.attr("transform", "rotate(90)translate(0," + -width + ")");
      } else {
        extentX = width, extentY = height;
        wrap.attr("transform", null);
      }

      var normOrActual = Math.min(markerz[0], measurez[0])

      var minVal = (normOrActual > 0)? 0 : normOrActual;
      var maxVal = Math.max(rangez[0], markerz[0], measurez[0]);

      var zeroPos = (maxVal / (maxVal - minVal)) * extentX

      // Compute the new x-scale.
      var x1 = d3.scale.linear()
          .domain([minVal, maxVal])
          .range(reverse ? [extentX, 0] : [0, extentX]);

      // Retrieve the old x-scale, if this is an update.
      var x0 = this.__chart__ || d3.scale.linear()
          .domain([minVal, Infinity])
          .range(x1.range());

      // Stash the new scale.
      this.__chart__ = x1;

      // Derive width-scales from the x-scales.
      var w0 = bulletWidth(x0),
          w1 = bulletWidth(x1);

      // Update the range rects.
      var range = wrap.selectAll("rect.range")
          .data(rangez);

      range.enter().append("rect")
          .attr("class", function(d, i) { return "range s" + i; })
          .attr("width", function(d){
            return extentX - x0(d)
          })
          .attr("height", extentY)
          .attr("x", x0)

      d3.transition(range)
          .attr("x", x1)
          .attr("width", function(d){
            return extentX - x1(d)
          })
          .attr("height", extentY);

      // Update the measure rects.
      var measure = wrap.selectAll("rect.measure")
          .data(measurez);

      measure.enter().append("rect")
          .attr("class", function(d, i) { return "measure s" + i; })
          .attr("width", w0)
          // .attr("width", measurez[0] / rangez[0] * extentX) ///////////////////////// kene
          .attr("height", extentY / 3)
          .attr("x", reverse ? ((measurez[0] < 0)? zeroPos : x0) : 0)
          .attr("y", extentY / 3);

      d3.transition(measure)
          .attr("width", w1)
          // .attr("width", measurez[0] / rangez[0] * extentX) ///////////////////////// kene
          .attr("height", extentY / 3)
          .attr("x", reverse ? ((measurez[0] < 0)? zeroPos : x1) : 0)
          .attr("y", extentY / 3);

      // Update the marker lines.
      var marker = wrap.selectAll("line.marker")
          .data(markerz);

      marker.enter().append("line")
          .attr("class", "marker")
          .attr("x1", x0)
          .attr("x2", x0)
          .attr("y1", extentY / 6)
          .attr("y2", extentY * 5 / 6);

      d3.transition(marker)
          .attr("x1", x1)
          .attr("x2", x1)
          .attr("y1", extentY / 6)
          .attr("y2", extentY * 5 / 6);

      var axis = g.selectAll("g.axis").data([0]);
      var ticksCount = 7;

      axis.enter().append("g").attr("class", "axis");
      axis.attr("transform", vertical ? null : "translate(0," + extentY + ")")
          .call(xAxis.scale(x1).tickValues(
            (function(){
              var diff = (maxVal - minVal) / (ticksCount - 1)

              return Array.apply(0, Array(ticksCount)).map(function(value, key){
                var ret = minVal + (key * diff)
                return ret == -0 ? 0 : ret
              });
            })())
          );
    });
    d3.timer.flush();
  }

  // left, right, top, bottom
  bullet.orient = function(_) {
    if (!arguments.length) return orient;
    orient = _ + "";
    reverse = orient == "right" || orient == "bottom";
    xAxis.orient((vertical = orient == "top" || orient == "bottom") ? "left" : "bottom");
    return bullet;
  };

  // ranges (bad, satisfactory, good)
  bullet.ranges = function(_) {
    if (!arguments.length) return ranges;
    ranges = _;
    return bullet;
  };

  // markers (previous, goal)
  bullet.markers = function(_) {
    if (!arguments.length) return markers;
    markers = _;
    return bullet;
  };

  // measures (actual, forecast)
  bullet.measures = function(_) {
    if (!arguments.length) return measures;
    measures = _;
    return bullet;
  };

  bullet.width = function(_) {
    if (!arguments.length) return width;
    width = +_;
    return bullet;
  };

  bullet.height = function(_) {
    if (!arguments.length) return height;
    height = +_;
    return bullet;
  };

  return d3.rebind(bullet, xAxis, "tickFormat");
};

function bulletRanges(d) {
  return d.ranges;
}

function bulletMarkers(d) {
  return d.markers;
}

function bulletMeasures(d) {
  return d.measures;
}

function bulletWidth(x) {
  var x0 = x(0);
  return function(d) {
    return Math.abs(x(d) - x0);
  };
}

})();

function renderVerticalBulletChart(selector, data, eachWidth) {
  var thickness = 15
  
  var margin = {}
  margin.top = 5 
  margin.right = 35 
  margin.bottom = 5
  margin.left = eachWidth - margin.right - thickness

  var width = eachWidth - margin.left - margin.right
  var height = 140 - margin.top - margin.bottom;

  var chart = d3.bulletVertical()
      .orient("bottom")
      .width(width)
      .height(height);

  $(selector).addClass('bullet-container')
  $(selector).empty()
  $(selector).html('<div class="bullet-vertical-wrapper"></div>')
  $(selector).find('.bullet-vertical-wrapper').width(eachWidth * data.length)

  var svg = d3.select(selector + ' .bullet-vertical-wrapper').selectAll("svg")
      .data(data)
    .enter().append("svg")
      .attr("class", "bullet")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(chart);

  // var title = svg.append("g")
  //     .style("text-anchor", "end")
  //     .attr("transform", "translate(" + width + "," + (height + 20) + ")");

  // title.append("text")
  //     .attr("class", "title")
  //     .text(function(d) { return d.title; });

  // title.append("text")
  //     .attr("class", "subtitle")
  //     .attr("dy", "1em")
  //     .text(function(d) { return d.subtitle; });
}