# giraffatron
Styling a choropleth using data

https://dactyrafficle.github.io/giraffatron/

I am using mapbox to style a choropleth using data. The data is generated using Math.random() so it doesn't communicate anything significant.

The data for the country borders comes from a geo.json dataset from https://github.com/johan/world.geo.json. But I made some changes for my own purposes.

First, I moved the 3-letter short form of each feature from its 'id' to its 'property.id', and assigned an integer 'id' value to the feature. There are some methods in mapbox that need the 'id' to be an integer.

I have 2 .xlsx files that contain gdp data (mostly 2018 IMF data) and another file that contains the approximate coordinates of each country. I moved that data into js files and link to them in index.html and I use them in giraffatron.js - I know this is not elegant so I will fix it shortly.
