var app = null;

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc2/doc/">App SDK 2.0rc2 Docs</a>'},
    launch: function() {
        //Write app code here
        app = this;
        var store = this.getSnapshotStore();

        this.add({
            xtype: 'rallygrid',
             store : store,
             columnCfgs: [
                 {dataIndex:'_UnformattedID',text:"ID"},
                 {text:"From State", renderer : function(v,m,r) {
                 	return r.get("_PreviousValues").State;
                 }},
                 {dataIndex:'State',text:"State"},
                 {dataIndex:'Priority',text:"Priority"},
                 {dataIndex:'Severity',text:"Severity"},
                 {dataIndex:'_ValidFrom',text:"Valid From", renderer: function(value) {
                 	return Rally.util.DateTime.fromIsoString(value);
                 }}
             ]
        });

    },

    getSnapshotStore : function() {

        var that = this;
        var fetch = ['ObjectID','_UnformattedID','State','Priority','Severity','_ItemHierarchy','_TypeHierarchy','_ValidFrom','_PreviousValues'];
        var hydrate = ['_TypeHierarchy','State','Priority','Severity','_PreviousValues'];
        
        var find = {
                '_TypeHierarchy' : { "$in" : ["Defect","Task"]} ,
                '_ProjectHierarchy' : { "$in": app.getContext().getProject().ObjectID }
                // 'State' : "Open",
                // '_PreviousValues.State' : { "$ne" : null}
                // '_PreviousValues.State' : { "$in" : ["Closed","Re-opened"]}
        };

        var storeConfig = {
            find : find,
            autoLoad : true,
            pageSize:100,
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
