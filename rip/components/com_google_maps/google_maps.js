/* Sample of Global Variables
// Below is an example of the variables this script needs to create a map.

// Grab XSL File
var safariCompat = 1;
if(safariCompat == 0) {
    logging__ = false;
    xsltdebug = false;
    xpathdebug = false;
    var xmlHttp = GXmlHttp.create();
    xmlHttp.open("GET", "components/com_google_maps/minipage.xsl", false);
    xmlHttp.send(null);
}
// Defining Global Variables
//Map Globals
var map;
var omap;
var overviewShow = 0;
var infoWindows = [];
var xmlCats = [];
var infoWindowsHtml = [];
var markers = [];
var infos = [];
var i = 0;
var autoOpen = 0;
var centerId = 0;
var centerLat = 40.748442;
var centerLng = -73.984721;
var zoomLevel = 4;
var contZoom = 0;
var doubleclickZoom = 0;
var whichType = G_NORMAL_MAP;
var showType = 1;
var whichZoom = 1;
var showScale = 1;
var catDisplay = [];
var pointsArray = [];
var cbRealname = 1;
// Sidebar Globals
var sidebar_htmls = [];
var current_sidebar;
var sidebar_place = 0;
var sidebar_num = 5;
var sidebar_exists = 1;
var sidebar_showcat = 1;
var prevplace;
var nextplace;
var prevcat;
// Tooltip Globals
var tooltipShow = 1;
var tooltip;
// Overview Globals
var overviewHeight = 200;
var overviewWidth = 200;
 
//End Sample    */

// Display the correct number of items in the sidebar.
// Also makes sure the "Next" and "Prev" links change the sidebar correctly.
function showItems(num, place) {
   current_sidebar = "<ul>";
   var num = parseInt(num);
   var catset = 0;
   for(var i = 0; i < num && i + place < sidebar_htmls.length; i++) {
       var j = i + place;
       current_sidebar += sidebar_htmls[j];
   }
   sidebar_place = parseInt(place);
   prevplace = sidebar_place - num;
   nextplace = sidebar_place + num;
   current_sidebar += '<br />';
   if(place > 0) {
       current_sidebar += "<a href=\"javascript:showItems(sidebar_num, prevplace)\">Previous</a>\n";
   }
   if(nextplace < sidebar_htmls.length) {
       current_sidebar += "<a href=\"javascript:showItems(sidebar_num, nextplace)\">Next</a>\n";
   }
   current_sidebar += "</ul>\n";
   document.getElementById("google_maps_sidebar").innerHTML = current_sidebar;
}

// This function picks up the click and opens the corresponding info window
function myclick(i,lng,lat) {
  try {
    map.closeInfoWindow();
    tooltipMouseout();
  } catch(err) {}
  map.setCenter(new GLatLng(lat,lng));
  if(!infoWindowsHtml[i]) {
     if(safariCompat == 1) {
          infoWindowsHtml[i] = infoHtml(infoWindows[i]);
     } else {
          infoWindowsHtml[i] = xsltProcess(infoWindows[i], xmlHttp.responseXML);
     }
  }
  markers[i].openInfoWindowHtml(infoWindowsHtml[i]);
 }
 
 //This function initializes the tooltips. Without it tooltips will not showup.
 function initTooltip(show) {
    if(show != 0) {
          tooltip = document.createElement("div");
	      map.getPane(G_MAP_FLOAT_PANE).appendChild(tooltip);
          tooltip.style.visibility="hidden";
    }
 }
 
 // The sidebar utilizes these functions to open/close tooltips when the mouse hovers over the sidebar link.
 function tooltipMouseover(i) {
  if(tooltipShow != 0 ) showTooltip(markers[i])
 } 
 function tooltipMouseout() {
  if(tooltipShow != 0 ) tooltip.style.visibility="hidden";
 }
 
 // This is the Safari compatibility function, that supposedly doesn't work.
 function infoHtml(info) {
    var name = GXml.value(info.getElementsByTagName("name")[0]);
    var address = GXml.value(info.getElementsByTagName("address")[0]);
    var city = GXml.value(info.getElementsByTagName("city")[0]);
    var state = GXml.value(info.getElementsByTagName("state")[0]);
    var zipcode = GXml.value(info.getElementsByTagName("zipcode")[0]);
	var html = '<div class="infoWindow"><b>' + name + '</b><br />' + address + '<br />' + city + ', ' + state + ' ' + zipcode + '<br /><br /></div>';
    return html;
 }
 
 // This function grabs the name of a category using the catid and then spits out the appropriate sidebar html.
 function getCatName(singleCat,allCats, prevCat) {
    catName = "";
	for (var i = 0; i < allCats.length; i++) {
        var catId = allCats[i].getAttribute("id");
        if(catId == singleCat && (catId != prevCat || sidebar_htmls.length % sidebar_num == 0) && sidebar_showcat != 0) {
           catName = allCats[i].getAttribute("name");
           var catTitle = "<div class=\"sidebar_category\"><u>" + catName + "</u></div>"
           return catTitle;
           break;
        }
    }
    return catName;
 }

 // This function creates the marker, the sidebar html, the event listeners, the tooltip, etc
 // It also puts the marker onto the map. It does it all.
 function createMarker(info, i) {
    var localId = info.getAttribute("id");
    var localType = info.getAttribute("type");
    if(localType != 3 || cbRealname != 1) {
        // Makes sure markers aren't CB users with real names disabled.
        var localName = GXml.value(info.getElementsByTagName("name")[0]);
    } else {
        var localName = info.getAttribute("username");
    }
    var localCatid = info.getAttribute("category");
    var localDrag = info.getAttribute("draggable");
    var localLat = info.getAttribute("lat");
    var localLng = info.getAttribute("lng");
    var localTitle = getCatName(localCatid,xmlCats,prevcat);
    sidebar_htmls.push(localTitle +'<li class="sidebar_marker"><a href="javascript:myclick('+i+',' + localLng + ',' + localLat +')" onmouseover="tooltipMouseover('+i+')" onmouseout="tooltipMouseout()">'+ localName + '</a></li>');
    var catIcon = parseInt(getCatIcon(localCatid));
    var point = new GLatLng(parseFloat(localLat),parseFloat(localLng));
    if(localDrag == 1) {
        var marker = new GMarker(point,{icon:baseIcon[catIcon], draggable: true});
    } else {
        var marker = new GMarker(point,{icon:baseIcon[catIcon]});
    }
    
    if(tooltipShow != 0 ) {
        marker.tooltip = '<div class="tooltip">'+localName+'</div>';
        GEvent.addListener(marker,"mouseover", function() {
            showTooltip(markers[i]);
        });        
        GEvent.addListener(marker,"mouseout", function() {
            tooltip.style.visibility="hidden"
        });
    }
    GEvent.addListener(marker, "click", function() {
       if(safariCompat == 1) {
            infoWindowsHtml[i] = infoHtml(info);
       } else {
            infoWindowsHtml[i] = xsltProcess(info, xmlHttp.responseXML);
       }
       marker.openInfoWindowHtml(infoWindowsHtml[i]);
    });
    map.addOverlay(marker);
    if(localDrag == 1) marker.enableDragging();
    prevcat = localCatid;
    return marker;
 }

 // This shows the tooltip when the mouse hovers over a marker or a sidebar link.
 function showTooltip(marker) {
   	tooltip.innerHTML = marker.tooltip;
	var point=map.getCurrentMapType().getProjection().fromLatLngToPixel(map.fromDivPixelToLatLng(new GPoint(0,0),true),map.getZoom());
	var offset=map.getCurrentMapType().getProjection().fromLatLngToPixel(marker.getPoint(),map.getZoom());
	var anchor=marker.getIcon().iconAnchor;
	var width=marker.getIcon().iconSize.width;
	var height=tooltip.clientHeight;
	var pos = new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(offset.x - point.x - anchor.x + (1.2*width), offset.y - point.y -anchor.y)); 
	pos.apply(tooltip);
	tooltip.style.visibility="visible";
    // Code From PdMarkers www.pixeldevelopment.com/pdmarker.asp
    var b = 75;
	var c = b / 100;
	if (tooltip)
	{
		if(typeof(tooltip.style.filter)=='string'){tooltip.style.filter='alpha(opacity:'+b+')';}
		if(typeof(tooltip.style.KHTMLOpacity)=='string'){tooltip.style.KHTMLOpacity=c;}
		if(typeof(tooltip.style.MozOpacity)=='string'){tooltip.style.MozOpacity=c;}
		if(typeof(tooltip.style.opacity)=='string'){tooltip.style.opacity=c;}
	}
	// end of PdMarkers code 
 }
 
 // This function is used to place certain markers based on category id.
 function checkCat(catLookup,carray) {
    if(carray.length != 0) {
        for (i=0;i < carray.length;i++) {
            if(carray[i] == catLookup) {
                return true;
                break;
            }
        }
        return false;
    } else {
         return true;
    }
 }
 
 // This function is used to place certain markers based on marker id.
 function checkPoint(pointLookup,pointArray) {
    if(pointArray.length != 0) {
		for (i=0;i < pointArray.length;i++) {
			if(pointArray[i] == pointLookup) {
				return true;
				break;
			}
		}
		return false;
    } else {
		return true;
	}
 }
 
 // This function gets the gicon associated with each category
 function getCatIcon(singleCat) {
    for(var i=0; i < xmlCats.length; i++) {
        var catId = xmlCats[i].getAttribute("id");
        if(catId == singleCat) {
            if(xmlCats[i].getAttribute("gicon")) {
                var gicon = xmlCats[i].getAttribute("gicon");
                return gicon;
                break;
            }
        }
    }
    return 0;
 }
 
 //  This function to adjusts the positioning of the overview map (minimap)
 function positionOverview(x,y) {
     omap = document.getElementById("map_overview");
     //Place in a div container outside of the map
     var place=document.getElementById("overview_map_holder");
     omap.style.position = "relative";
     omap.style.left = "0px";
     omap.style.top = "0px";
     place.appendChild(omap);        

     // GControlPosition to place the overview map within the map.
     // Currently doesn't work in Internet Explorer
     //var pos = new GControlPosition(G_ANCHOR_BOTTOM_RIGHT, new GSize(0,0));
     //pos.apply(document.getElementById("map_overview"));
     //map.getContainer().appendChild(document.getElementById("map_overview"));
        
     // == restyling ==
     omap.firstChild.style.border = "1px solid gray";

     omap.firstChild.firstChild.style.left="4px";
     omap.firstChild.firstChild.style.top="4px";
     omap.firstChild.firstChild.style.width="190px";
     omap.firstChild.firstChild.style.heigh="190px";
     
 }

/* Convert degress to radians */
function deg2rad(deg) {
  return deg / (180 / Math.PI);
}

/* Calculate distance between two points in meters 
   Where a and b are both Google Map GPoints
                                                    */
function point_distance(a, b) {
  var r = 6378700;
  var lat1 = a.y;
  var lat2 = b.y;
  var lon1 = a.x;
  var lon2 = b.x;
  var dist = r * Math.acos(Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + 
			   Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
			   Math.cos(deg2rad(lon1 - lon2)));
  return dist;
}

/* Calculate the approximate distance to the edge of 
   the viewable map in miles. This assumes that the 
   viewable area is square-like in shape.            */


// Make the ymarkers variable universal so the removeMarkers function can access it.

function myclick2(i,lng,lat) {
	map.setCenter(new GLatLng(lat,lng));
    var html = xsltProcess(yahooInfo[i], xmlHttp.responseXML);
    ymarkers[i].openInfoWindowHtml(html);
}

  
 function createSearchMarker(point, info, i) {
    
    // Create a lettered icon for this point using our icon class from above
    var letter = String.fromCharCode("A".charCodeAt(0) + i);
    var icon = new GIcon(baseIcon[0]);
    icon.image = "http://www.google.com/mapfiles/marker" + letter + ".png";
    var searchTitle = info.getElementsByTagName("Title")[0].firstChild.nodeValue;
    var searchLat = info.getElementsByTagName("Latitude")[0].firstChild.nodeValue;
    var searchLng = info.getElementsByTagName("Longitude")[0].firstChild.nodeValue;
    search_html += '<li><a href="javascript:myclick2('+i+','+searchLng+','+searchLat+')">'+searchTitle+'</a></li>';
    var marker = new GMarker(point, icon);
 
     GEvent.addListener(marker, "click", function() {
       var html = xsltProcess(info, xmlHttp.responseXML);
       marker.openInfoWindowHtml(html);
     });


  return marker;
  
 }

 function removeMarkers(markerArray) {
   for (var j = 0; j < markerArray.length; j++) {
       map.removeOverlay(markerArray[j]);
   }
 }

 function localSearch(searchForm) {
  removeMarkers(ymarkers);
  var query = searchForm.query.value;
  var lat = map.getCenter().lat();
  var lng = map.getCenter().lng();
  var url = 'modules/mod_google_maps_search.xml.php?query=' + query + '&clat=' + lat + '&clng=' + lng;
  // Open the XML File
      var request = GXmlHttp.create();
	  request.open("GET", url, true);
	  request.onreadystatechange = function() {
  	   if (request.readyState == 4) {
              if (request.status != 200) {
                 alert("file not found");
                 return;
              }
    	   var xmlDoc = request.responseXML;
           if (!xmlDoc) {
              alert("Sorry there was an error with your search. Please try it again.");
           }
        yahooInfo = xmlDoc.getElementsByTagName("Result");
        search_html = "<ul>";
        search_html += "<div class=\"sidebar_category\"><u>Search Results</u></div>";
   		if (yahooInfo.length == 0) {
   		      search_html += "<li>No results</li>";
   		} else for (var j = 0; j < yahooInfo.length; j++) {
            var point = new GLatLng(parseFloat(yahooInfo[j].getElementsByTagName("Latitude")[0].firstChild.nodeValue),
                                    parseFloat(yahooInfo[j].getElementsByTagName("Longitude")[0].firstChild.nodeValue));
            ymarkers[j] = createSearchMarker(point,yahooInfo[j], j);
            map.addOverlay(ymarkers[j]);
    	}
        search_html += "</ul>";
        document.getElementById("google_maps_sidebar_search").innerHTML = search_html;
        }

      }
 request.send(null);
 }


 // var newmarkers = new Array();
 // This function creates the marker, the sidebar html, the event listeners, the tooltip, etc
 // It also puts the marker onto the map. It does it all.
 function createMarker2(info, i) {
    this.myclick3 = myclick3;
    this.info = info;
    this.i = i;
    this.id = info.getAttribute("id");
    this.type = info.getAttribute("type");
    if(this.type != 3 || cbRealname != 1) {
        // Makes sure markers aren't CB users with real names disabled.
        this.name = GXml.value(info.getElementsByTagName("name")[0]);
    } else {
        this.name = info.getAttribute("username");
    }
    this.catid = info.getAttribute("category");
    this.drag = info.getAttribute("draggable");
    this.lat = info.getAttribute("lat");
    this.lng = info.getAttribute("lng");
    this.point = new GLatLng(parseFloat(this.lat),parseFloat(this.lng));
    if(this.drag == 1) {
        this.marker = new GMarker(this.point,{icon:baseIcon[this.icon], draggable: true});
    } else {
        this.marker = new GMarker(this.point,{icon:baseIcon[this.caticon]});
    }
    
    if(tooltipShow != 0 ) {
        this.marker.tooltip = '<div class="tooltip">'+localName+'</div>';
        GEvent.addListener(this.marker,"mouseover", function() {
            showTooltip(markers[i]);
        });        
        GEvent.addListener(this.marker,"mouseout", function() {
            tooltip.style.visibility="hidden"
        });
    }
    GEvent.addListener(this.marker, "click", function() {
       if(safariCompat == 1) {
            this.infowindowhtml = infoHtml(info);
       } else {
            this.infowindowhtml = xsltProcess(info, xmlHttp.responseXML);
       }
       this.marker.openInfoWindowHtml(this.infowindowhtml);
    });
    prevcat = this.catid;

 }
 // This function gets the gicon associated with each category
 createMarker2.prototype.getCatIcon2 = function () {
    for(var i=0; i < xmlCats.length; i++) {
        var curentCat = xmlCats[i].getAttribute("id");
        if(currentCat == this.catid) {
            if(xmlCats[i].getAttribute("gicon")) {
                this.caticon = parseInt(xmlCats[i].getAttribute("gicon"));
                break;
            }
        }
    }
    this.caticon = 0;
 }
// Display the correct number of items in the sidebar.
// Also makes sure the "Next" and "Prev" links change the sidebar correctly.
function showItems2(num, place, markers) {
   current_sidebar = "<ul>";
   var num = parseInt(num);
   var catset = 0;
   for(var i=0; i < num && i + place < markers.length; i++) {
       var j = i + place;
       var sidebar_html_title = '';
       if(i == 0 || markers[j].catid != markers[j-1].catid) {
          sidebar_html_title = markers[j].catid;
       }
       var sidebar_html = sidebar_html_title + '<li class="sidebar_marker"><a href="javascript:newmarkers['+j+'].myclick3()" onmouseover="tooltipMouseover('+j+')" onmouseout="tooltipMouseout()">'+ markers[j].name + ' New Sidebar!</a></li>';
       current_sidebar += sidebar_html;
   }
   sidebar_place = parseInt(place);
   prevplace = sidebar_place - num;
   nextplace = sidebar_place + num;
   current_sidebar += '<br />';
   if(place > 0) {
       current_sidebar += "<a href=\"javascript:showItems2(sidebar_num, prevplace,newmarkers)\">Previous</a>\n";
   }
   if(nextplace < markers.length) {
       current_sidebar += "<a href=\"javascript:showItems2(sidebar_num, nextplace,newmarkers)\">Next</a>\n";
   }
   current_sidebar += "</ul>\n";
   document.getElementById("google_maps_sidebar").innerHTML = current_sidebar;
}
// This function picks up the click and opens the corresponding info window
 function myclick3() {
  var marker = this.marker;
  try {
    map.closeInfoWindow();
    tooltipMouseout();
  } catch(err) {}
  this.infowindowhtml = xsltProcess(this.info, xmlHttp.responseXML);
  map.setCenter(this.point);
  marker.openInfoWindowHtml(this.infowindowhtml);
 }


// createMarker2.prototype.overlay = function() {
//    map.addOverlay(this.marker);
//    if(this.drag == 1) this.marker.enableDragging();
// } 
 

 // This function downloads and processes an external XML file.
 // The function can handle markers and polylines.
 //
 // Markers are in the following format
 //<info type="1" lat="14.6" lng="25.12">
 // <name>Name</name>
 // <address>Address</address>
 // ...
 //</info>
 //
 // Polylines are in the following format
 //<info type="2">
 // <name>Name</name>
 // <misc>
 //  <point lat="14.6" lng="25.12"/>
 //  <point lat="18.9" lng="12.532"/>
 //  <point lat="20.2352" lng="22.535"/>
 //  <point lat="0.5432" lng="0.3461"/>
 // </misc>
 //</info>
 function getXml(url,catsToDisplay, markersToDisplay, useSidebar) {
    var request = GXmlHttp.create();
    request.open("GET", url, true);
    request.onreadystatechange = function() {
     if (request.readyState == 4) {
        try {
            var xmlDoc = request.responseXML;
        } catch(err) {
            var data = request.responseText;
            var xmlDoc = GXml.parse(data);
        }
        infoWindows = xmlDoc.getElementsByTagName("info");
        xmlCats = xmlDoc.getElementsByTagName("category");
        var catset = 0;
        for (var j = 0; j < infoWindows.length; j++) {
          // Grab variables about the type of marker.
          var pid = infoWindows[j].getAttribute("id");
          var ptype = infoWindows[j].getAttribute("type");
          var pcat = infoWindows[j].getAttribute("category");
          if(checkCat(pcat,catsToDisplay) && checkCat(pid, markersToDisplay)) {
            // Checking to see if the info is for a polyline or a marker
            if( ptype == 2 ) {
                // Code for a polyline
                // get any line attributes
                var misc = infoWindows[j].getElementsByTagName("misc");
                var color = misc[0].getAttribute("polycolor");
                var width  = parseFloat(misc[0].getAttribute("polywidth"));
                // read each point on that line
                var points = infoWindows[j].getElementsByTagName("point");
                var pts = [];
                for (var i = 0; i < points.length; i++) {
                    pts[i] = new GLatLng(parseFloat(points[i].getAttribute("lat")),
                                         parseFloat(points[i].getAttribute("lng")));
                }
                map.addOverlay(new GPolyline(pts,color,width));
              } else {
                // Code for a marker
//                var markerObj = new createMarker2(infoWindows[j],j);
//                newmarkers.push(markerObj);
                markers[j] = createMarker(infoWindows[j],j);
                // This opens the info window if automatic open is set on.
                if(centerId == pid && autoOpen == 1) {
                    if(safariCompat == 1) {
                        var html = infoHtml(infoWindows[j]);
                    } else {
                        var html = xsltProcess(infoWindows[j], xmlHttp.responseXML);
                    }
                    markers[j].openInfoWindowHtml(html);
                }
              }
          }
        }
        // Envokes the function to create the sidebar.
        if(useSidebar == 1) {
		    try {
			    showItems(sidebar_num,sidebar_place);
		    } catch(err){}
        }
     }
    }
  request.send(null);
 }
 
 
 // This function opens/closes/changes the various map comtrols
 function mapOptions(type, scale, zoom) {
   // This shows or hides the map type buttons (normal, sat, hybrid).
   switch(type) {
	case 1:
		map.addControl(new GMapTypeControl());
		break;
	default:
		break;
   }
   // This switches the scale on or off.
   switch(scale) {
	case 1:
		map.addControl(new GScaleControl());
		break;
	default:
		break;
   }
   // This chooses which zoom/pan control to use. There are 3 
   // choices and the ability to hide the control all together
   switch(zoom) {
	case 1:
		map.addControl(new GLargeMapControl());
		break;
	case 2:
		map.addControl(new GSmallMapControl());
		break;
	case 3:
		map.addControl(new GSmallZoomControl());
		break;
	default:
		break;
   }

 }

 // Grabs the current api version number 
 var APIkey = "";
 function getGoogleMapsVersion() {
	var i, a, b, c;
	var v = "unknown";

	if (document.getElementsByTagName)
		for(i=0; (a = document.getElementsByTagName("script")[i]); i++)
			if(a.getAttribute("src"))
			{
				b = a.getAttribute("src");
				c = b.indexOf("/mapfiles/maps");
				d = b.indexOf("http://maps.google.com/maps?file=api");
				e = b.indexOf("key=");
				if (c > 0)
					v = parseFloat(b.substring(c+14));
				if (d >= 0)
					if (e > 0)
						APIkey = b.substring(e+4);
			}
	return v;
 }
 
 // Enable a couple zoom options.
 function zoomOptions(continuous, doubleclick) {
    if(continuous == 1) {
        map.enableContinuousZoom();
    }
    if(doubleclick == 1) {
        map.enableDoubleClickZoom();
    }
 }
 
 // Controls the overview (mini) map
 function initOverview(show,width,height) {
       if(show != 0) {
             //  ======== Add a map overview ==========
             map.addControl(new GOverviewMapControl(new GSize(width,height)));
             if(show == 2) {
                  setTimeout("positionOverview(520,580)",1);
             } else if(show == 1) {
                  omap = document.getElementById("map_overview"); 
                  document.getElementById("map").appendChild(omap);
             }
       }
 }

/**
 *
 * This code is all by Nick Johnson. It is untested by me (David),
 * but people on the Google Maps API Group claim it works.
 * Below is a link the the thread where I got this code.
 * http://groups.google.com/group/Google-Maps-API/browse_frm/thread/c8d01f3be32bc26f/1398b29ca27d4da5?q=KML&rnum=1#1398b29ca27d4da5
 *
 * To use this code you are going to have to change the initMap function (or create your own).
 * If you are not comfortable with the Google Maps API, javascript, and programming in general
 * I wouldn't use this code. Do not ask me to do this for you. All that I know 
 * about this script is here. Below is what you should have in the initMap function in it's 
 * most basic form. Again, edit the initMap function AT YOUR OWN RISK.
 *
 * var map = new GMap(document.getElementById("map"));
 * map.addControl(new GSmallMapControl());
 * map.centerAndZoom(new GPoint(-122.1419, 37.4419), 4);
 * var khandler = new KMLHandler(map);
 * khandler.addFeed("test.kml");
 * Lastly, uncomment the KMLMarker.prototype = new GMarker(); line if you use this script.
 */
 
 function KMLMarker(point, name, description) {
    this.base = GMarker;
    this.base(point);

    this.name = name;
    this.description = description;

    this.onClick = function() {
        this.openInfoWindowHtml("<h1>" + this.name + "</h1>" + this.description);
    }

    GEvent.bind(this, 'click', this, this.onClick);
 }

// Uncomment the below line if you want to use KML.
// KMLMarker.prototype = new GMarker();

 function KMLNSResolver(prefix) {
    if(prefix == 'kml') return "http://earth.google.com/kml/2.0";
    return null;

 }

 //Represents a KML feed. Used internally by KMLHandler.
 function KMLFeed(map, url) {
    this.map = map;
    this.url = url;
    this.overlays = new Object();

    //Triggers whenever the map is moved or zoomed.
    //Also manually invoked when the feed is first created to initially populate
    //the feed.
    this.onMapChange = function() {
        //Trigger fetching the new map
        url = this.url;
        bounds = map.getBoundsLatLng();

        if(url.indexOf("?") == -1) {
            url = url + "?BBOX=" + bounds.minX + "," + bounds.minY +
"," + bounds.maxX + "," + bounds.maxY;
        } else {
            url = url + "&BBOX=" + bounds.minX + "," + bounds.minY +
"," + bounds.maxX + "," + bounds.maxY;
        }

        request = GXmlHttp.create();
        request.open('GET', url, true);
        request.onreadystatechange = function() {
            //Request completed?
            if(request.readyState == 4) {
                //Delete existing overlays
                for(var i in this.overlays) {
                    this.map.removeOverlay(this.overlays[i]);
                }
                this.overlays = new Object();

                //Populate with elements in the updated feed
                var doc = request.responseXML;

                placemarks = doc.documentElement.getElementsByTagName("Placemark");
                for(var i = 0; i < placemarks.length; i++) {
                    var point = placemarks[i].getElementsByTagName("Point")[0];
                    var coords = point.getElementsByTagName("coordinates")[0].childNodes[0].nodeValue;
                    coords = coords.split(",");
                    var name = placemarks[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
                    var description = placemarks[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;

                    var point = new GPoint(parseFloat(coords[0]),parseFloat(coords[1]));
                    var marker = new KMLMarker(point, name,description);
                    map.addOverlay(marker);
                }

                //Free the request object
                request = undefined;
            }
        }

        request.send(null);
    }

    //Fetch the feed for the first time
    this.onMapChange();

    //Add event handlers
    GEvent.bind(map, 'moveend', this, this.onMapChange);
    GEvent.bind(map, 'zoom', this, this.onMapChange);

 }

 //A KMLHandler handles (fetching, updating) KML feeds for a map
 function KMLHandler(map) {
    this.map = map;
    this.feeds = [];

    this.addFeed = function(url) {
        //Add the feed to the feeds array
        this.feeds[url] = new KMLFeed(this.map, url);
    }

    this.removeFeed = function(url) {
        //Remove the feed from the feeds array
        this.feeds[url].destroy();
        delete this.feeds[url];
    } 
 }
 
 // This function loads the map, but only after the page has loaded.      
 function initMap() {
  // Checks to see if the browser is compatible with Google Maps API
  if(GBrowserIsCompatible) {
   // Not quite sure why this is here.
   i = 0;
   // Initialize the map
   map = new GMap2(document.getElementById("map"));
   // Now to show all the various widgets on the map
   mapOptions(showType,showScale,whichZoom);
   // Here we set the center of the map and the map type
   map.setCenter(new GLatLng(centerLat,centerLng),zoomLevel,whichType);
   // Enable zoom options
   zoomOptions(contZoom, doubleclickZoom);
   // This gets the marker data and plots the points to the map
   getXml(xmlUrl, catDisplay, pointsArray, sidebar_exists);
   // If tooltips are enabled then this sets up the tooltips
   initTooltip(tooltipShow);
   // If the overview map is enabled then it is envoked here.
   initOverview(overviewShow,overviewWidth,overviewHeight);
  } else {
    alert("Your browser is not compatible with the Google Maps API");
  }
 }
