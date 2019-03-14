# giraffatron
Styling a choropleth using data

https://dactyrafficle.github.io/giraffatron/

I am using mapbox to style a choropleth using data. The data is generated using Math.random() so it doesn't communicate anything significant.

The data for the country borders comes from a geo.json dataset from https://github.com/johan/world.geo.json. But I made some changes for my own purposes.

First, I moved the 3-letter short form of each feature from its 'id' to its 'property.id', and assigned an integer 'id' value to the feature. There are some methods in mapbox that need the 'id' to be an integer.
