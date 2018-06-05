import { Injectable } from '@angular/core';
import { connectorDomain, flowDomain, trigger, triggerAndActionForAdapt, action, connectionAndFlow, connection, flow, connectionDetail } from '../../domain/connector';
import { ConnectorModel, TriggerModel, ActionModel, Propertry, AdapterModel } from '../../model/connector-model';
import { HttpService } from '../http-service.service';
import { FlowModel } from '../../model/flow-model';

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  constructor(private httpService: HttpService) { 
    let baseUrl = "http://localhost:2001/api/";
    this.getConnectorUrl = baseUrl + "BusinessesFlow/GetAllConnectorWithTriggerAndAction";
    this.getPropertiesUrl = baseUrl + "BusinessesFlow/GetTrigerAndActionById";
    this.saveFlowUrl = baseUrl + "BusinessesFlow/ConnectionAndFlow";
    this.getFlowUrl = baseUrl + "BusinessesFlow/GetFlowByEnterpriseID?enterpriseID=";
  }
  
  private getConnectorUrl: string;
  private getFlowUrl: string;
  private getPropertiesUrl: string;
  private saveFlowUrl: string;

  //#region dummydata

  // getDummyData(): Array<ConnectorModel> {
  //     let result: Array<connectorDomain> = new Array<connectorDomain>(); 

  //     let connector: connectorDomain = new connectorDomain();
  //     connector.connectorId = "1";
  //     connector.connectorName = "myOps";
  //     connector.destription = "myOps Description";

  //     let trigger1: trigger = new trigger();
  //     trigger1.triggerId = "1";
  //     trigger1.triggerName = "Swimming Club Event";
  //     trigger1.connectorId = "1";
  //     trigger1.destription = "Swimming Club Event Description";
  //     trigger1.type = "User";
  //     trigger1.status = "Debug";
  //     let property1: property = new property();
  //     property1.name = "LeaveType";
  //     property1.description = "Leave Type";
  //     trigger1.inputJson.push(property1);
  //     let property2: property = new property();
  //     property2.name = "LeaveDate";
  //     property2.description = "Leave Date";
  //     trigger1.inputJson.push(property2);

  //     connector.triggers.push(trigger1);

  //     let trigger2: trigger = new trigger();
  //     trigger2.triggerId = "2";
  //     trigger2.triggerName = "Swimming Club Event2";
  //     trigger2.connectorId = "1";
  //     trigger2.destription = "Swimming Club Event Description2";
  //     trigger2.type = "Application";
  //     trigger2.status = "Release";
  //     trigger2.inputJson.push(property1);
  //     trigger2.inputJson.push(property2);
  //     connector.triggers.push(trigger2);

  //     let action1: action = new action();
  //     action1.actionId = "1";
  //     action1.actionName = "Submit";
  //     action1.connectorId = "1";
  //     action1.description = "Submit Action";
  //     action1.endPoint = "https://myteservices-capability.ciostage.accenture.com/Expenses/AddExpense";
  //     action1.type = "Application";
  //     action1.status = "Debug";
  //     let property3: property = new property();
  //     property3.name = "CostCollector";
  //     property3.description = "Cost Collector";
  //     let property4: property = new property();
  //     property4.name = "TimeEntry";
  //     property4.description = "Time Entry";
  //     action1.inputJson.push(property3);
  //     action1.inputJson.push(property4);
      
  //     connector.actions.push(action1);


  //     let connector11: connectorDomain = new connectorDomain();
  //     connector11.connectorId = "11";
  //     connector11.connectorName = "myOps11";
  //     connector11.destription = "myOps Description11";

  //     let trigger11: trigger = new trigger();
  //     trigger11.triggerId = "11";
  //     trigger11.triggerName = "Swimming Club Event";
  //     trigger11.connectorId = "11";
  //     trigger11.destription = "Swimming Club Event Description";
  //     trigger11.type = "User";
  //     trigger11.status = "Debug";
  //     let property11: property = new property();
  //     property11.name = "LeaveType";
  //     property11.description = "Leave Type";
  //     trigger11.inputJson.push(property11);
  //     let property21: property = new property();
  //     property21.name = "LeaveDate";
  //     property21.description = "Leave Date";
  //     trigger1.inputJson.push(property21);

  //     connector11.triggers.push(trigger11);

  //     let trigger21: trigger = new trigger();
  //     trigger21.triggerId = "21";
  //     trigger21.triggerName = "Swimming Club Event2";
  //     trigger21.connectorId = "11";
  //     trigger21.destription = "Swimming Club Event Description2";
  //     trigger21.type = "Application";
  //     trigger21.status = "Release";
  //     trigger21.inputJson.push(property11);
  //     trigger21.inputJson.push(property21);
  //     connector11.triggers.push(trigger21);

  //     let action11: action = new action();
  //     action11.actionId = "11";
  //     action11.actionName = "Add Expense";
  //     action11.connectorId = "11";
  //     action11.description = "Add Expense";
  //     action11.endPoint = "https://myteservices-capability.ciostage.accenture.com/Expenses/AddExpense";
  //     action11.type = "Application";
  //     action11.status = "Debug";
  //     let property31: property = new property();
  //     property31.name = "CostCollector";
  //     property31.description = "Cost Collector";
  //     let property41: property = new property();
  //     property41.name = "TimeEntry";
  //     property41.description = "Time Entry";
  //     action11.inputJson.push(property31);
  //     action11.inputJson.push(property41);
  //     connector11.actions.push(action11);

  //     result.push(connector);
  //     result.push(connector11);
  //     return this.ConvertConnectorDomainToModel(result);
  // }

  //#endregion

  getConnector(callback: any){
    this.httpService.HttpGet<Array<connectorDomain>>(this.getConnectorUrl).subscribe( p =>{ callback(this.ConvertConnectorDomainToModel(p)) });
  }

  ConvertConnectorDomainToModel(connectors: Array<connectorDomain>): Array<ConnectorModel>{
    let connectorModels : Array<ConnectorModel> = new Array<ConnectorModel>();
    for(var i in connectors){
      let connectorModel = new ConnectorModel();
      connectorModel.Id = connectors[i].connectorId;
      connectorModel.Name = connectors[i].connectorName;
      connectorModel.Discription = connectors[i].destription;

      connectors[i].triggers.forEach(trigger => {
        let triggerModel = new TriggerModel();
        triggerModel.Id = trigger.connectorId;
        triggerModel.Name = trigger.triggerName;
        triggerModel.Discription = trigger.destription;
        triggerModel.ConnectorId = trigger.connectorId;

        connectorModel.Triggers.push(triggerModel);
      });

      connectors[i].actions.forEach(action => {
        let actionModel = new ActionModel();
        actionModel.Id = action.actionId;
        actionModel.Name = action.actionName;
        actionModel.Discription = action.description;
        actionModel.ConnectorId = action.connectorId;

        connectorModel.Actions.push(actionModel);
      });

      connectorModels.push(connectorModel);
    }
    return connectorModels;
  }

  ConvertAdapterPropertiesDomainToModel(adapterInfo: triggerAndActionForAdapt): AdapterModel{
    let triggerProperties = adapterInfo.triggerInfo.inputJson;
    let actionProperties = adapterInfo.actionInfo.inputJson;

    let adapterModel = new AdapterModel();
    triggerProperties.forEach(p=>{
      let property = {
        Name: p.name,
        Description: p.description
      } as Propertry;
      adapterModel.Trigger.push(property);
    });

    actionProperties.forEach(p=>{
      let property = {
        Name: p.name,
        Description: p.description
      } as Propertry;
      adapterModel.Action.push(property);
    });
    return adapterModel;
  }


  getAdapterProperties(triggerId: any, actionId: any, callback: any){
    let urlParams = "?triggerId=" + triggerId + "&" + "actionId=" + actionId;
    let fullUrl = this.getPropertiesUrl + urlParams;
    this.httpService.HttpGet<triggerAndActionForAdapt>(fullUrl).subscribe( p => { 
      callback(this.ConvertAdapterPropertiesDomainToModel(p)); 
    });
  }

  saveFlow(flowModel: FlowModel, callback: any){
    let postData: connectionAndFlow = this.ConvertFlowModelToDomain(flowModel);
    var aa = JSON.stringify(postData);
    this.httpService.HttpPost<connectionAndFlow>(this.saveFlowUrl, postData).subscribe( (p) => {
      var flowInfo =  this.ConvertFlowDomainToModel(p, flowModel);
      callback(flowInfo);
    });
  }

  ConvertFlowDomainToModel(flowDomain: any, flowModel: FlowModel): FlowModel{
    flowModel.Trigger.Name = flowDomain.trigger.triggerName;
    flowModel.Id = flowDomain.flowId;
    flowModel.Actions.forEach(p=>{
       var tempFlow = flowDomain.actions.find(pro=>pro.actionId == p.Id && pro.connectorId == p.ConnectorId);
       if(tempFlow != null && tempFlow != undefined){
          p.Name = tempFlow.actionName;
       }
    });
    return flowModel;
  }

  ConvertFlowModelToDomain(flowModel: FlowModel): connectionAndFlow{
    let flowDomain: flow = new flow();
    flowDomain.flowName = flowModel.Name;
    flowDomain.description = flowModel.Description;
    flowDomain.type = "RELEASE";
    flowDomain.enterpriseId = "qiang.c.chen";

    let connectionDomain: connection = new connection();
    if(flowModel.Trigger != null && flowModel.Trigger != undefined && flowModel.Actions != null && flowModel.Actions.length > 0){
      let triggerId: string = flowModel.Trigger.Id;
      let triggerConnectorId: string = flowModel.Trigger.ConnectorId;

      for(var i in flowModel.Actions){
        let actionId: string = flowModel.Actions[i].Id;
        let actionConnectorId = flowModel.Actions[i].ConnectorId;

        let connectionDetailDomain = {
          triggerId: triggerId,
          triggerConnector: triggerConnectorId,
          actionId: actionId,
          actionConnector: actionConnectorId
        } as connectionDetail;
        connectionDomain.connections.push(connectionDetailDomain);
      }
    }
    
    let connectionAndFlowDomain : connectionAndFlow = new connectionAndFlow();
    connectionAndFlowDomain.flow = flowDomain;
    connectionAndFlowDomain.connection = connectionDomain;

    return connectionAndFlowDomain;
  }

  getFlows(eid: string, callback: any){
    this.httpService.HttpGet<Array<flowDomain>>(this.getFlowUrl + eid).subscribe( p=> {
      let flowModels: Array<FlowModel> = new Array<FlowModel>();
      for(var i in p){
        let tempFlow: FlowModel = flowModels.find(p=>p.Id == p[i].flowID);
        if(tempFlow != null && tempFlow != undefined){
          tempFlow.Actions.push({Id: p[i].actionId, Name: p[i].actionName} as ActionModel);
        }else{
          let tempFlow: FlowModel = new FlowModel();
          tempFlow.Id = p[i].flowID;
          tempFlow.Name = p[i].flowName;
          tempFlow.Description = p[i].flowDescription;
          tempFlow.Trigger = {Id: p[i].triggerId, Name: p[i].triggerName} as TriggerModel;
          tempFlow.Actions.push({Id: p[i].actionId, Name: p[i].actionName} as ActionModel);

          flowModels.push(tempFlow);
        }
      }

      callback(flowModels);
    })
  }

}
