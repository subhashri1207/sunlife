({
    Accountcontroller : function(component, event, helper) {
        component.set('v.mycolumns', [
            { label: 'Name', fieldName: 'Name', type: 'string ', sortable: true, editable: true},
            { label: 'Owner Name', fieldName: 'AccountOwner', type: 'string ',sortable: true, editable: true},
            { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true},
            { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'integer', editable: true},
            { label: 'Website', fieldName: 'Website', type: 'string', editable: true}
        ]);
        
        helper.Accounthelpermethod(component);	
    },
    handleSort: function(component, event, helper) {
        var sortBy = event.getParam("fieldName");
        var sortDirection = event.getParam("sortDirection");
        component.set("v.sortBy",sortBy);
        component.set("v.sortDirection",sortDirection);
        helper.sortData(component,sortBy,sortDirection);    
    },
    handleSaveEdition: function (component, event, helper) {
        var draftValues = component.find( "acctTable" ).get( "v.draftValues" );  
        helper.saveEdition(component, draftValues);
    }
})({
    Accounthelpermethod:function(component,event,helper){
        var action = component.get("c.fetchAccountRecords");
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var accList = response.getReturnValue();
                accList.forEach(function(acc){
                    try{
                        acc['AccountOwner'] = acc.Owner.Name; /* You can adjust the field name here. So here basically we are populating the nested property on the main object. */
                        console.log('--acc--'+acc);
                    }catch(e){}
                });
                component.set("v.mydata", accList);
            }
        });
        $A.enqueueAction(action);
    },
    sortData : function(component,fieldName,sortDirection){
        var data = component.get("v.mydata");
        //function to return the value stored in the field
        var key = function(a) { return a[fieldName]; }
        var reverse = sortDirection == 'asc' ? 1: -1;
        
        // to handel number/currency type fields 
        if(fieldName == 'AnnualRevenue'){ 
            data.sort(function(a,b){
                var a = key(a) ? key(a) : '';
                var b = key(b) ? key(b) : '';
                return reverse * ((a>b) - (b>a));
            }); 
        }
        else{// to handel text type fields 
            data.sort(function(a,b){ 
                var a = key(a) ? key(a).toLowerCase() : '';//To handle null values , uppercase records during sorting
                var b = key(b) ? key(b).toLowerCase() : '';
                return reverse * ((a>b) - (b>a));
            });    
        }
        //set sorted data to accountData attribute
        component.set("v.mydata",data);
    },
    saveEdition: function (component, draftValues) {
        var action = component.get("c.updateAccountRecords");
        action.setParams({ accLstToUpdate : draftValues});
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var accList = response.getReturnValue();
                accList.forEach(function(acc){
                    try{
                        acc['AccountOwner'] = acc.Owner.Name; /* You can adjust the field name here. So here basically we are populating the nested property on the main object. */
                        console.log('--acc--'+acc);
                    }catch(e){}
                });
                component.set("v.mydata", accList);
                component.set("v.draftValues", []);
            }
        });
        $A.enqueueAction(action);    
    }
})