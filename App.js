var app = null;

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc2/doc/">App SDK 2.0rc2 Docs</a>'},
    launch: function() {
        //Write app code here
        app = this;
        var store = this.getSnapshotStore();

        this.grid = Ext.create('Rally.ui.grid.Grid',{
            // xtype: 'rallygrid',
             store : store,
             columnCfgs: [
                {dataIndex:'_UnformattedID',text:"ID"},
                {dataIndex:'ScheduleState',text:"To State"},

                 {text:"From State", renderer : function(v,m,r) {
                 	//return r.get("_PreviousValues").State;
                    return r.get("_PreviousValues").ScheduleState;
                 }},
                 //{dataIndex:'State',text:"State"},
                 //{dataIndex:'ScheduleState',text:"State"},
                 {dataIndex:'Priority',text:"Priority"},
                 {dataIndex:'Severity',text:"Severity"},
                 {dataIndex:'_ValidFrom',text:"Valid From", renderer: function(value) {
                 	return Rally.util.DateTime.fromIsoString(value);
                 }},
                  {dataIndex:'_ValidTo',text:"Valid To", renderer: function(value) {
                    return Rally.util.DateTime.fromIsoString(value);
                 }}

             ]
        });

        this.add(this.grid);
        this.grid.reconfigure(store);
        store.loadPage(1);

    },

    getSnapshotStore : function() {

        var that = this;
        var fetch = ['ObjectID','_UnformattedID','ScheduleState','State','Priority','Severity','_ItemHierarchy','_TypeHierarchy','_ValidFrom','_PreviousValues'];
        var hydrate = ['_TypeHierarchy','State','Priority','Severity','_PreviousValues','ScheduleState'];
        
        // var find = {
        //         '_TypeHierarchy' : { "$in" : ["Defect","Task"]} ,
        //         '_ProjectHierarchy' : { "$in": app.getContext().getProject().ObjectID },
        //         'State' : "Open",
        //         // '_PreviousValues.State' : { "$ne" : null}
        //         '_PreviousValues.State' : { "$in" : ["Closed","Re-opened","Fixed"]}
        // };

        var find = {
                '_TypeHierarchy' : { "$in" : ["Defect","HierarchicalRequirement"]} ,
                '_ProjectHierarchy' : { "$in": app.getContext().getProject().ObjectID },
                'ScheduleState' : "In-Progress",
                // '_PreviousValues.State' : { "$ne" : null}
                '_PreviousValues.ScheduleState' : { "$in" : ["Completed","Accepted"]}
        };

        var storeConfig = {
            find : find,
            // autoLoad : true,
            showPagingToolbar: true,
            pageSize : 25,
            limit: 'Infinity',
            fetch: fetch,
            hydrate: hydrate,
            listeners : {
                scope : this,
                load: function(store, snapshots, success) {
                    console.log("completed snapshots:", snapshots.length);
                }
            }
        };

        var snapshotStore = Ext.create('Rally.data.lookback.SnapshotStore', storeConfig);

        return snapshotStore;

    }


});
