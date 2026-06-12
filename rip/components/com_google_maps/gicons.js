var baseIcon = [];
var smallIcon;
// Normal marker icon
baseIcon[0] = new GIcon();
baseIcon[0].image = "http://www.google.com/mapfiles/marker.png";
baseIcon[0].shadow = "http://www.google.com/mapfiles/shadow50.png";
baseIcon[0].iconSize = new GSize(20, 34);
baseIcon[0].shadowSize = new GSize(37, 34);
baseIcon[0].iconAnchor = new GPoint(9, 34);
baseIcon[0].infoWindowAnchor = new GPoint(9, 2);
baseIcon[0].infoShadowAnchor = new GPoint(18, 25);
// Base Icon for Small Colored Icons
smallIcon = new GIcon();
smallIcon.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
smallIcon.iconSize = new GSize(12, 20);
smallIcon.shadowSize = new GSize(22, 20);
smallIcon.iconAnchor = new GPoint(6, 20);
smallIcon.infoWindowAnchor = new GPoint(5, 1); 

baseIcon[1] = new GIcon(smallIcon);
baseIcon[1].image = "http://labs.google.com/ridefinder/images/mm_20_red.png";

baseIcon[2] = new GIcon(smallIcon);
baseIcon[2].image = "http://labs.google.com/ridefinder/images/mm_20_yellow.png";

baseIcon[3] = new GIcon(smallIcon);
baseIcon[3].image = "http://labs.google.com/ridefinder/images/mm_20_purple.png";

baseIcon[4] = new GIcon(smallIcon);
baseIcon[4].image = "http://labs.google.com/ridefinder/images/mm_20_blue.png";

baseIcon[5] = new GIcon(smallIcon);
baseIcon[5].image = "http://labs.google.com/ridefinder/images/mm_20_white.png";

baseIcon[6] = new GIcon(smallIcon);
baseIcon[6].image = "http://labs.google.com/ridefinder/images/mm_20_green.png";

baseIcon[7] = new GIcon(smallIcon);
baseIcon[7].image = "http://labs.google.com/ridefinder/images/mm_20_black.png";

baseIcon[8] = new GIcon(smallIcon);
baseIcon[8].image = "http://labs.google.com/ridefinder/images/mm_20_orange.png";

baseIcon[9] = new GIcon(smallIcon);
baseIcon[9].image = "http://labs.google.com/ridefinder/images/mm_20_gray.png";

baseIcon[10] = new GIcon(smallIcon);
baseIcon[10].image = "http://labs.google.com/ridefinder/images/mm_20_brown.png";
