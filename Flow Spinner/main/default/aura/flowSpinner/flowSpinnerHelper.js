({
	showSpinner:function(cmp){
  		cmp.set("v.IsSpinner",true);
	},
 	hideSpinner:function(cmp){
 	 cmp.set("v.IsSpinner",false);
	},
    subscribe: function (component, event, helper) {
    console.log('Inside Subscriber');
 	const empApi = component.find('empApi');
    const channel = component.get('v.channel');
    const replayId = -1;
 	const callback = function (message) {
      console.log('Event Received : ' + JSON.stringify(message));
      helper.onReceiveNotification(component, message,event,helper);
    };
     empApi.subscribe(channel, replayId, $A.getCallback(callback)).then($A.getCallback(function (newSubscription) {
      console.log('Subscribed to channel ' + channel);
      component.set('v.subscription', newSubscription);
    }));
  },

  unsubscribe: function (component, event, helper) {
    console.log('Inside UnSubscribe ');
    const empApi = component.find('empApi');
    // Get the channel from the component attribute.
    const channel = component.get('v.subscription').channel;
    // Callback function to be passed in the unsubscribe call.
    const callback = function (message) {
      console.log('Unsubscribed from channel ' + message.channel);
    };
    // Unsubscribe from the channel using the subscription object.
    empApi.unsubscribe(component.get('v.subscription'), $A.getCallback(callback));
  },
  // Client-side function that displays the platform event message
  // in the console app and displays a toast if not muted.
  onReceiveNotification: function (component, message,event,helper) {
      console.log('Inside onReceiveNotification ');
      const wdRequest = component.get('v.wdRequestId');
      console.log('WD Request from Component ::  ' + wdRequest );
      if(wdRequest == message.data.payload.WD_Request__c){
       console.log('WD Request from Event    ::  ' + message.data.payload.WD_Request__c );
       component.set('v.IsSpinner', false);
       component.set('v.eventReceived', true);   
       helper.unsubscribe(component,event,helper);
      }
    // Extract notification from platform event
    const newNotification = {
      time: $A.localizationService.formatDateTime(
        message.data.payload.CreatedDate, 'HH:mm'),
      message: message.data.payload.Message__c
    };
    // Save notification in history
    const notifications = component.get('v.notifications');
    notifications.push(newNotification);
    component.set('v.notifications', notifications);
    
    // Display notification in a toast
 //   this.displayToast(component, 'info', newNotification.message);
  },
  // Displays the given toast message.
  displayToast: function (component, type, message) {
    const toastEvent = $A.get('e.force:showToast');
    toastEvent.setParams({
      type: type,
      message: message
    });
    toastEvent.fire();
  }
})