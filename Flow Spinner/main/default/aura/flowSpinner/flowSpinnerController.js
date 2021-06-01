({
	onInit: function (component, event, helper) {
    console.log('Inside Spinner LC ');
    component.set('v.subscription', null);
   
    // Get empApi component.
    const empApi = component.find('empApi');
    // Define an error handler function that prints the error to the console.
    const errorHandler = function (message) {
      console.error('Received error ', JSON.stringify(message));
    };
    // Register empApi error listener and pass in the error handler function.
    helper.showSpinner(component);
    const timeout = component.get('v.timeout');
    window.setTimeout(
    // spinner shoould timeout if no response is recived from event
        $A.getCallback(function() {
        console.log('Inside setTimeOut of '+ timeout +' miliseconds');
        const eventReceived = component.get('v.eventReceived');
            if(eventReceived != true){
            helper.hideSpinner(component);
            helper.unsubscribe(component,event,helper);
            }
    }), timeout
   	);
    empApi.onError($A.getCallback(errorHandler));
    helper.subscribe(component, event, helper);
 
	}
})