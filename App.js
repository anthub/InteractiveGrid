Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    
    myStore: undefined,
    myGrid: undefined,
    launch: function(){
	console.log("Hello World");
	
	//build container
	this.pulldownContainer = Ext.create('Ext.container.Container', {
	    id: "pulldowncontainer_1",
	    layout: {
		type: 'hbox',
		align: 'stretch'
	    }
	});
	this.add(this.pulldownContainer);
	this._loadIterations();
    },
    _loadIterations: function(){
	this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
	fieldLabel: "Iteration",
	labelAlign: "top",
	width: "300",
	listeners: {
	    ready: function(combobox){
		this._loadSeverities();
	    },
	    select: function(combobox, records){
		this._loadData();
	    },
	    scope: this
	}
	 //renderTo: Ext.getBody().dom
	});
        this.pulldownContainer.add(this.iterComboBox);
    },
    _loadSeverities: function() {
	this.severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
	    model: 'Defect',
	    field: 'Severity',
	    fieldLabel: "Severity",
	    labelAlign: "top",

	listeners: {
	    ready: function(severityCombobox){
		this._loadData();
	    },
	    select : function(severityComboBox){
		this._loadData();
	    },
	    scope: this
	 }
	});
	    
	this.pulldownContainer.add(this.severityComboBox);
    },
    //get data from Rally
    _loadData: function(){
	var selectedIterRef = this.iterComboBox.getRecord().get("_ref");
	var selectedSeverityValue = this.severityComboBox.getRecord().get('value');
	console.log("selected Severity", selectedSeverityValue);
    	var myFilters = [
	    {
	     property: "Iteration",
	     operation: "=",
	     value: selectedIterRef
	    },
	    {
		property: "Severity",
		operation: "=",
		value: selectedSeverityValue
	    }
	];
    
	// if store exists just load new data
	if(this.defectStore){
	    this.defectStore.setFilter(myFilters);
	    this.defectStore.load();
	// else create store
	}else{
	
    
	    this.defectStore = Ext.create('Rally.data.wsapi.Store', {
	    model: 'Defect',
	    autoLoad: true,	
	    filters: myFilters,
	    //events that will fire
	    listeners: {
		load: function(myStore, myData, success) {
		//add grid logic after store loaded...
		    if(!this.myGrid){
			this. _createGrid(myStore);
		    }
		
		},
		scope: this
	    },
	    fetch: ['FormattedID', 'Name', 'Severity', 'Iteration', 'Project']
	   });
	}
    },
    //create and show a grid of given stories
    _createGrid: function(myStore){
	this.myGrid= Ext.create('Rally.ui.grid.Grid', {
	    store: myStore,
	    columnCfgs: [
		 'FormattedID', 'Name', 'Severity', 'Iteration', 'Project'
	    ]
	});
	this.add(this.myGrid);
	console.log("What is this?", this);	
    }
});


