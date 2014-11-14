
// Bing Constants

var roadLayerName = 'Road';
var satelliteLayerName = 'AerialWithLabels';
var bingKey = 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3';

// Layer Array Constants
var roadLayer = 0;
var satelliteLayer = 1;
var markerLayer = 2;

// Projection Constants
var projectionSource = 'EPSG:4326';
var projectionDestination = 'EPSG:3857';

// Element Data Key Contants
var mapContextKey = 'mapcontext';

// OpenLayers Constants
var startZoom = 12;
var minZoom = 1;
var maxZoom = 19;

// Timer Constants
var TIMER_OFF = -1;
var timerPeriod = 5000;

// MM Map Modes
var UNKNOWN = -1;
var TRACKER = 0;
var SELECTOR = 1;
var VIEWER = 2;

var locationImage = 'static/img/place.png';

function MapContext(mapid)
{
	// OL Objects
	this.map = {};
	this.layers = [];
	
	// Refresh Timer
	this.firstTime = true;
	this.timerid = TIMER_OFF;
	
	// HTML elements
	this.mapElement = $('#'+mapid); 

	// Click Management in Selector Mode
	this.toolTip = false;

	this.mode = UNKNOWN;
}

function getMapContext(mapid)
{
	var mm_map = $('#'+mapid);
	if(mm_map == null)
		return null;
	
	var mapContext = mm_map.data(mapContextKey);
	if(mapContext == null)
	{
		mapContext = new MapContext(mapid);
		mm_map.data(mapContextKey, mapContext);
	}
	
	return mapContext;
}

var MapLocator = function()
{
	var init = function(mapid, newSelection)
	{
		//var mapContext = getMapContext(mapid);
		var mapContext = getMapContext(mapid);
		
		// Road Layer Initialization
		mapContext.layers.push(
			new ol.layer.Tile(
			{
				visible: true,
				preload: Infinity,
				source: new ol.source.BingMaps(
				{
					key: bingKey,
					imagerySet: roadLayerName
				})
			}));

		// Satellite Layer Initialization
		mapContext.layers.push(
			new ol.layer.Tile(
			{
				visible: false,
				preload: Infinity,
				source: new ol.source.BingMaps(
				{
					key: bingKey,
					imagerySet: satelliteLayerName
				})
			}));
		
		// Markers Layer Initialization
		var vectorSource = new ol.source.Vector();
	
		var vectorLayer = new ol.layer.Vector(
		{
			visible: true,
			source: vectorSource
		});
	
		mapContext.layers.push(vectorLayer);
	

		// Create The ol.Map object
		mapContext.map = new ol.Map(
		{
			layers: mapContext.layers,
			target: mapid,
			view: new ol.View(
			{
				center: ol.proj.transform([-73.602875,45.531521], projectionSource, projectionDestination),
				zoom: startZoom,
				maxZoom: maxZoom
			})
		});
		
		// Find the popup element
		var popup_element = mapContext.mapElement.find('.mm_popup');
		var popup = new ol.Overlay(
		{
			element: popup_element,
			positioning: 'bottom-center',
			stopEvent: false
		});
		
		mapContext.map.addOverlay(popup);

		// On click ...
		// display popup on click
		mapContext.map.on('singleclick', function(evt) 
		{
			$(popup_element).popover('destroy');
			
			var feature = mapContext.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) 
			{
		    	return feature;
		    });

			if (feature) 
			{
				var geometry = feature.getGeometry();
				var coord = geometry.getCoordinates();
				popup.setPosition(coord);
				$(popup_element).popover(
				{
					'placement': 'top',
					'html': true,
					'content': feature.get('title') + ((feature.get('body')!=null)?'\n' + feature.get('body'):'') + ((feature.get('footer')!=null)?'\n' + feature.get('footer'):'')
				});

				$(popup_element).popover('show');

				mapContext.toolTip = true;
			} 
			else
			{
				if(mapContext.mode == SELECTOR)
				{
					if(!mapContext.toolTip)
					{
						// Reverse transformation ...
						var transform = ol.proj.getTransform(projectionDestination, projectionSource);

						// Handle direct location
						//findAddress(mapid, 'j9z1g8', null, null);
						var pointFeature = new ol.Feature();
						pointFeature.setGeometry(new ol.geom.Point(evt.coordinate));
						var pointCoord = transform(pointFeature.getGeometry().getCoordinates());

						if(evt.originalEvent.ctrlKey)
						{
							setLocation(mapid, pointCoord[1], pointCoord[0]);
							if(newSelection != null)
								newSelection({event:'SET', latitude:pointCoord[1], longitude:pointCoord[0]});
						}
						else if(evt.originalEvent.altKey)
						{
							addLocation(mapid, pointCoord[1], pointCoord[0]);
							if(newSelection != null)
								newSelection({event:'ADD', latitude:pointCoord[1], longitude:pointCoord[0]});
						}
					}				

					mapContext.toolTip = false;
				}
			}
		});
		
		// Find the map layer selector if any ...
		mapContext.mapElement.parent().find('.mm_map_select').change(function() 
		{
			var style = $(this).find(':selected').val();
			setSatellite(mapid, style==satelliteLayerName);
		});
	};
	
	var initTracker = function(mapid)
	{
		init(mapid, null);
		
		var mapContext = getMapContext(mapid);
		mapContext.mode = TRACKER;
		
		var timerId = setTimeout(function()
		{
			mostRecentSpaceTimeFix(mapid);
		}, 1000);
		
		mapContext.timerid = timerId;
	};
	
	var initSelector = function(mapid, newSelection)
	{
		init(mapid, newSelection);

		var mapContext = getMapContext(mapid);
		mapContext.mode = SELECTOR;

		// Find the map layer selector if any ...
		mapContext.mapElement.parent().find('.mm_map_address').change(function() 
		{
			var address = $(this).val();
			findAddress(mapid, address, null, null);
		});
	};

	var initViewer = function(mapid, newSelection)
	{
		init(mapid, newSelection);

		var mapContext = getMapContext(mapid);
		mapContext.mode = VIEWER;
	};

	var setSatellite = function(mapid, enabled)
	{
		var mapContext = getMapContext(mapid);

		mapContext.layers[roadLayer].setVisible(!enabled);
		mapContext.layers[satelliteLayer].setVisible(enabled);
	};

	var setLocation = function(mapid, latitude, longitude, label)
	{
		clearFeatures(mapid);
		addLocation(mapid, latitude, longitude, label);
	};

	var addLocation = function(mapid, latitude, longitude, label)
	{
		var mapContext = getMapContext(mapid);
		var locationPoint = [longitude,latitude];

		if(label == null)
			label = longitude.toString() + ',' + latitude.toString();

		//Icon stuff
		var iconFeature = new ol.Feature(
		{
			geometry: new ol.geom.Point(ol.proj.transform(locationPoint, projectionSource, projectionDestination)),
			title: label,
			body: '',
			footer: '',
			location: locationPoint,
		});
	
		var iconStyle = new ol.style.Style(
		{
			image: new ol.style.Icon( (
			{
				anchor: [0.5, 1.0],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
				opacity: 0.9,
				src: locationImage
			}))
		});
	
		iconFeature.setStyle(iconStyle);
		mapContext.layers[markerLayer].getSource().addFeature(iconFeature);
	};

	var addSpaceTimeFix = function(mapid, spaceTimeFix)
	{
		var mapContext = getMapContext(mapid);

		var spaceTimeFixPoint = [spaceTimeFix.longitude,spaceTimeFix.latitude];

		//Icon stuff
		var iconFeature = new ol.Feature(
		{
			geometry: new ol.geom.Point(ol.proj.transform(spaceTimeFixPoint, projectionSource, projectionDestination)),
			title: spaceTimeFix.user.username,
			body: spaceTimeFix.user.firstname + ' ' + spaceTimeFix.user.lastname ,
			footer: spaceTimeFix.user.emailaddress,
			location: spaceTimeFixPoint,
		});
	
		var iconStyle = new ol.style.Style(
		{
			image: new ol.style.Icon( (
			{
				anchor: [0.5, 1.0],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
				opacity: 0.9,
				src: locationImage
			}))
		});
	
		iconFeature.setStyle(iconStyle);
		mapContext.layers[markerLayer].getSource().addFeature(iconFeature);
	};
	
	var clearFeatures = function(mapid)
	{
		var mapContext = getMapContext(mapid);
		mapContext.layers[markerLayer].getSource().clear();
	};
	
	var showAllMarkers = function(mapid)
	{
		var mapContext = getMapContext(mapid);
		var extent = mapContext.layers[markerLayer].getSource().getExtent();

		// Add margins to the extent
		if(isFinite(extent[0])) extent[0] -= Math.abs(extent[0])*.01;
		if(isFinite(extent[1])) extent[1] -= Math.abs(extent[1])*.01;
		if(isFinite(extent[2])) extent[2] += Math.abs(extent[2])*.01;
		if(isFinite(extent[3])) extent[3] += Math.abs(extent[3])*.01;

		var view = mapContext.map.getView();

		view.fitExtent(extent, mapContext.map.getSize());
		var zoom = view.getZoom();
		if(zoom > startZoom)
			zoom = startZoom;
		view.setZoom(zoom);
	};
	
	var mostRecentSpaceTimeFix = function(mapid)
	{
		var mapContext = getMapContext(mapid);
		
	   	$.ajax({
			type: "GET",
			cache:false,
			url: encodeURI("mmservices/spacetimefix/last"),
			contentType: "application/json;",
			dataType: "json",
			success: function(spaceTimeFixList) 
			{
				for(var i=0; i<spaceTimeFixList.length; i++)
				{
					if(i==0)
						MapLocator.clearFeatures(mapid);
					
					var spaceTimeFix = spaceTimeFixList[i];
					MapLocator.addSpaceTimeFix(mapid, spaceTimeFix);
				}

				var mapContextSuccess = getMapContext(mapid);
				if( mapContextSuccess.firstTime )
				{
					mapContextSuccess.firstTime = false;
					showAllMarkers(mapid);
				}
			},
			error: function(e)
			{
			}
	   	});
	   	
	   	var timerId = setTimeout(function()
		{
			mostRecentSpaceTimeFix(mapid);
		}, timerPeriod);
		
	   	mapContext.timerid = timerId;
	};

	// Returns [[lon,lat],[lon,lat],...]
	var getCurrentLocations = function(mapid)
	{
		var locations = [];

		var mapContext = getMapContext(mapid);
		var features = mapContext.layers[markerLayer].getSource().getFeatures();
		for(var i=0; i<features.length; i++)
		{
			var location = features[i].get('location');
			if(location != null)
				locations.push(location);
		}

		return locations;
	};

	var findAddress = function(mapid, address, success, failure)
	{
		var geocoder = new google.maps.Geocoder();		
		geocoder.geocode( { 'address': address}, function(results, status) 
		{
			if (status == google.maps.GeocoderStatus.OK && results.length > 0) 
			{
	    		console.log(results[0].geometry.location); 
	    		MapLocator.setLocation(mapid, results[0].geometry.location.lat(), results[0].geometry.location.lng(), address);
	    		showAllMarkers(mapid);

	    		if(success != null)
	    			success([results[0].geometry.location.lng(), results[0].geometry.location.lat()]);
	  		} 
	  		else
	  		{
	  			if(failure != null)
	  				failure('Google Geocoder call failed!');
	  		}
		});

		return null;
	}

	var testIt = function(mapid)
	{
		var user = {};
		user.username = 'pchretien';
		user.firstname = 'Philippe';
		user.lastname = 'Chretien';
		user.emailaddress = 'philippechretien@hotmail.com';

		var spaceTimeFix = {};
		spaceTimeFix.latitude = 45.531521;
		spaceTimeFix.longitude = -73.602875;
		spaceTimeFix.user = user;

		MapLocator.addSpaceTimeFix(mapid, spaceTimeFix);
	};

	var testIt2 = function(mapid)
	{
		var user = {};
		user.username = 'pchretien';
		user.firstname = 'Philippe2';
		user.lastname = 'Chretien';
		user.emailaddress = 'philippe2chretien@hotmail.com';

		var spaceTimeFix = {};
		spaceTimeFix.latitude = 45.533521;
		spaceTimeFix.longitude = -73.602875;
		spaceTimeFix.user = user;

		MapLocator.addSpaceTimeFix(mapid, spaceTimeFix);
	};

	var testIt3 = function(mapid)
	{
		var user = {};
		user.username = 'pchretien';
		user.firstname = 'Philippe3';
		user.lastname = 'Chretien';
		user.emailaddress = 'philippe2chretien@hotmail.com';

		var spaceTimeFix = {};
		spaceTimeFix.latitude = 45.533521;
		spaceTimeFix.longitude = -73.602675;
		spaceTimeFix.user = user;
		MapLocator.addSpaceTimeFix(mapid, spaceTimeFix);

		user.firstname = 'Philippe4';
		spaceTimeFix.latitude = 45.542521;
		spaceTimeFix.longitude = -73.612775;
		spaceTimeFix.user = user;
		MapLocator.addSpaceTimeFix(mapid, spaceTimeFix);

		user.firstname = 'Philippe5';
		spaceTimeFix.latitude = 45.551521;
		spaceTimeFix.longitude = -73.622875;
		spaceTimeFix.user = user;
		MapLocator.addSpaceTimeFix(mapid, spaceTimeFix);

		user.firstname = 'Philippe6';
		spaceTimeFix.latitude = 45.560521;
		spaceTimeFix.longitude = -73.632975;
		spaceTimeFix.user = user;
		MapLocator.addSpaceTimeFix(mapid, spaceTimeFix);
	};

	return {
		initTracker: initTracker,
		initSelector: initSelector,
		initViewer: initViewer,
		setSatellite: setSatellite,	
		addSpaceTimeFix: addSpaceTimeFix,
		clearFeatures: clearFeatures,
		mostRecentSpaceTimeFix: mostRecentSpaceTimeFix,
		showAllMarkers: showAllMarkers,
		addLocation: addLocation,
		setLocation: setLocation,
		getCurrentLocations: getCurrentLocations,
		findAddress: findAddress,
		
		testIt: testIt,	
		testIt2: testIt2,	
		testIt3: testIt3,
	};
	
} ();

