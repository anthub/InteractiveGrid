//custom rally app
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    //build container showing general layout
    items:[
    {
	xtype: 'container',
	itemId: 'pulldownContainer',
	layout: {
	    type: 'hbox',
	    align: 'stretch'
	}
    }],
    
    defectStore: undefined,
    myGrid: undefined,
    launch: function(){
	console.log("Hello World");
    	
	this._loadIterations();
    },
    _loadIterations: function(){
	//me = the app
	var me = this;
	console.log('GOT ME', me);

	var iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
	    itemId: "iterBox",
	    fieldLabel: "Iteration",
	    labelAlign: "top",
	    width: "300",
	    listeners: {
		//pointers to the function
		ready: me._onIterationsReady, //or this._loadSeverities()
		select: me._loadData,
		scope: me	
	    },
    });
    me.down('#pulldownContainer').add(iterComboBox);
    },
    _onIterationsReady: function(combobox, eOpts){
	this._loadSeverities();
    },
    _loadSeverities: function() {
	var me = this;
	var severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
	    itemId: 'severityBox',
	    model: 'Defect',
	    field: 'Severity',
	    fieldLabel: "Severity",
	    labelAlign: "top",

	listeners: {
	    ready: me._loadData,
	    select: me._loadData,
	    scope: me 
	 }
	});
	    
	me.down('#pulldownContainer').add(severityComboBox);
    },
    
    _getFilters: function(iterationValue, severityValue){

	var iterationFilter = Ext.create('Rally.data.wsapi.Filter', {
	     property: "Iteration",
	     operation: "=",
	     value: iterationValue

	});	
	var severityFilter = Ext.create('Rally.data.wsapi.Filter', {
	     property: "Severity",
	     operation: "=",
	     value: severityValue

	});
    	 	
	return iterationFilter.and(severityFilter);    

    },
    //get data from Rally
    _loadData: function(){
	var me = this;
	var selectedIterRef = me.down('#iterBox').getRecord().get("_ref");
	var selectedSeverityValue = me.down('#severityBox').getRecord().get('value');
	var myFilters = me._getFilters(selectedIterRef, selectedSeverityValue);
	// if store exists just load new data
	if(me.defectStore){
	    me.defectStore.setFilter(myFilters);
	    me.defectStore.load();
	// else create store
	}else{
	
    
	    me.defectStore = Ext.create('Rally.data.wsapi.Store', {
	    model: 'Defect',
	    autoLoad: true,	
	    filters: myFilters,
	    //events that will fire
	    listeners: {
		load: function(myStore, myData, success) {
		//add grid logic after store loaded...
		    if(!me.myGrid){
			me. _createGrid(myStore);
		    }
		
		},
		scope: me
	    },
	    fetch: ['FormattedID', 'Name', 'Severity', 'Iteration', 'Project']
	   });
	}
    },
    //create and show a grid of given stories
    _createGrid: function(myStore){
	var me = this;
	me.myGrid= Ext.create('Rally.ui.grid.Grid', {
	    store: myStore,
	    columnCfgs: [
		 'FormattedID', 'Name', 'Severity', 'Iteration', 'Project'
	    ]
	});
	me.add(me.myGrid);
    }
});


