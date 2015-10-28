define([
    'backbone',
    'libs/backbone.wreqr.min'
],function(Backbone,Wreqr){
  return new Backbone.Wreqr.EventAggregator();
});