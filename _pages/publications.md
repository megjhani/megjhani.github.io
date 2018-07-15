---
layout: page
permalink: /publications/
title: publications
description: .
years: [2018, 2017, 2016, 2015, 2014]
---
Word Cloud created from abstracts of my accepted papers (wordle.net/)
<img class="thumbnail" src="{{ '/assets/img/Abstract_wordle.png' | prepend: site.baseurl | prepend: site.url }}"/>
{% for y in page.years %}
  <h3 class="year">{{y}}</h3>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}
