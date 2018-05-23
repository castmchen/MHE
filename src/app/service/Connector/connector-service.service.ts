import { Injectable } from '@angular/core';
import { trigger, ConnectorModel, property, action } from '../../model/connector-model';

@Injectable({
  providedIn: 'root'
})
export class ConnectorServiceService {

  constructor() { }

  getDummyData(): Array<ConnectorModel> {
      var result = new Array<ConnectorModel>(); 
      var connector = new ConnectorModel();
      connector.connectorId = "1";
      connector.connectorName = "myOps";
      connector.destription = "myOps Description";

      var trigger1 = new trigger();
      trigger1.triggerId = "1";
      trigger1.triggerName = "Swimming Club Event";
      trigger1.connectorId = "1";
      trigger1.destription = "Swimming Club Event Description";
      trigger1.type = "User";
      trigger1.status = "Debug";
      var property1 = new property();
      property1.name = "LeaveType";
      property1.description = "Leave Type";
      trigger1.inputJson.push(property1);
      var property2 = new property();
      property2.name = "LeaveDate";
      property2.description = "Leave Date";
      trigger1.inputJson.push(property2);

      connector.triggers.push(trigger1);

      var trigger2 = new trigger();
      trigger2.triggerId = "2";
      trigger2.triggerName = "Swimming Club Event2";
      trigger2.connectorId = "1";
      trigger2.destription = "Swimming Club Event Description2";
      trigger2.type = "Application";
      trigger2.status = "Release";
      trigger2.inputJson.push(property1);
      trigger2.inputJson.push(property2);
      connector.triggers.push(trigger2);

      var action1 = new action();
      action1.actionId = "1";
      action1.actionName = "Add Expense";
      action1.connectorId = "1";
      action1.description = "Add Expense";
      action1.endPoint = "https://myteservices-capability.ciostage.accenture.com/Expenses/AddExpense";
      action1.type = "Application";
      action1.status = "Debug";
      var property3 = new property();
      property3.name = "CostCollector";
      property3.description = "Cost Collector";
      var property4 = new property();
      property4.name = "TimeEntry";
      property4.description = "Time Entry";
      action1.inputJson.push(property3);
      action1.inputJson.push(property4);
      
      connector.actions.push(action1);

      result.push(connector);
      return result;
  }
}
