define([
	'jquery',
	'underscore',
	'marionette',
	'text!templates/mapTemplate.html'
], function($, _, Marionette, template){
	
	var MapView = Backbone.Marionette.ItemView.extend({
		
		initialize: function(options) {
			
			//create marker object so collection can add to
			this.markers = new L.MarkerClusterGroup({
				maxClusterRadius : 25,
				showCoverageOnHover: false,
				spiderfyOnMaxZoom: true
			});
			
			//remove Leaflet's L Object 
			//Leaflet.noConflict();
			this.model = options.model;this.collection = options.collection;
			this.collection.on('add', this.addFeature, this);
			this.collection.on('reset', this.onCollectionSync,this);
			
			// setup map Layers
			this.tileLayers = [
					L.tileLayer('http://a.tile.stamen.com/toner-background/{z}/{x}/{y}.png', {
						attribution: '-',
						//opacity: 0.5,
						maxZoom: 18
					}),
					L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
						attribution: '-',
						//opacity: 0.9
						maxZoom: 18
						
					}),
					L.tileLayer.canvas()
			
			];
			this.tileLayersIndex = 0;
			this.overlayLayer = L.tileLayer('http://a.tile.stamen.com/toner-labels/{z}/{x}/{y}.png', {
				attribution: '-',
				//opacity: 1,
				maxZoom: 18
			});
			
			var self = this;
			//setup geomarker options
			this.geoLayerOptions = {
				pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {icon : L.icon({ // style markers
						iconUrl : 'images/marker-placeholder.png',
						clickable: true,
						className: feature.properties.className,
						id: feature.properties.idName
					})});
				},
				onEachFeature: function(feature, layer) { // connect to event
					if (feature.properties.type == 'marker')
						layer.on("click", function() {
							self.onMarkerClick(this,feature);
						});
				}
			};
		},
		
		template: _.template(template),
		
		events: {
			'click #zoomInButton' : 'onZoomInButtonPressed',
			'click #zoomOutButton' : 'onZoomOutButtonPressed',
			'click #layerButton' : 'onLayerButtonPressed',
			'click #overlayButton': 'onOverlayButtonPressed',
			'click #menuButton': 'onMenuButtonPressed'
		},
		
		onShow: function() {
			this.map = L.map(this.$('#map')[0], {
				center: [ this.model.get('location').latitude,this.model.get('location').longitude],
				maxZoom: 18,
				minZoom: 5,
				zoom: 16,
				layers: [this.tileLayers[0]],
				zoomControl: false
			});
			this.map.addLayer(this.markers);
		},
		
		onCollectionSync: function() {
			this.collection.each(this.addFeature,this);
		},
		
		addFeature: function(model) {
			var geoJson = model.toGeoJSON();
			if (geoJson) {
				var layer = L.geoJson(geoJson,this.geoLayerOptions);
				this.markers.addLayer(layer);
			}
		},
		
		onMarkerClick: function(clickevent) {
			var result = this.collection.get(clickevent.feature.properties.id);
			this.trigger('show:result',result);
			
			this.focusMarker([result]);
		},
		
		focusMarker: function(results) {

			$('.marker').css({'z-index' : ''});
			
			//first remove all focused 
			$('.marker').removeClass('focused');
			
			var self = this;
			_.each(results,function(result) {
				var id = result.get('id');
				self.$('.marker.'+id).addClass('focused');
			});
			
			//center map
			if (results.length > 0) {
				var location = results[0].get('location');
				if (location != 'false')
					this.map.setView([location.latitude,location.longitude]);
			}
		},
		
		onZoomInButtonPressed: function() {
			this.map.zoomIn();
		},
		
		onZoomOutButtonPressed: function() {
			this.map.zoomOut();
		},
		
		onLayerButtonPressed: function() {
			
			//switch tile layer
			this.map.removeLayer(this.tileLayers[this.tileLayersIndex])
			this.tileLayersIndex = (this.tileLayersIndex + 1)%3;
			this.map.addLayer(this.tileLayers[this.tileLayersIndex])
		},
		
		onOverlayButtonPressed: function() {
			
			if (this.map.hasLayer(this.overlayLayer))
				this.map.removeLayer(this.overlayLayer);
			else {
				this.map.addLayer(this.overlayLayer);
				this.overlayLayers.Labels.bringToFront();
			}
		},
		
		onMenuButtonPressed: function() {
			this.trigger('show:menu');
		}
		
	});
	// Our module now returns our view
	return MapView;
	
});