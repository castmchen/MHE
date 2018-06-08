import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConnectorModel, TriggerModel, ActionModel, Propertry, AdapterModel } from '../model/connector-model';
import { ConnectorService } from '../service/Connector/connector-service.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { IfStmt } from '@angular/compiler';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { jsPlumb } from '../../../node_modules/jsplumb/dist/js/jsplumb';
import * as $ from 'jquery';
import { Action } from 'rxjs/internal/scheduler/Action';
import { forEach } from '@angular/router/src/utils/collection';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { connectorDomain, action } from '../domain/connector';
import { ConnectorTree, ConnectorNode, TriggerNode, TriggerChildNode, ActionNode, ActionChildNode } from '../model/connector-tree';
import { FlowModel } from '../model/flow-model';


@Component({
  selector: 'app-management',
  templateUrl: './app-management.component.html',
  styleUrls: ['./app-management.component.css']
})
export class AppManagementComponent implements OnInit {
  @ViewChild('adapter') adapter: ModalDirective;
  constructor(private connectorService: ConnectorService, private modalService: BsModalService) { }
  modalRef: BsModalRef;
  public config: any = {
    backdrop: true,
    ignoreBackdropClick: true
  }

  ngOnInit(){
    this.instance = jsPlumb.getInstance();
    this.connectorService.getConnector(p=>{ this.BuildData(p)});
    this.connectorService.getFlows("qiang.c.chen", p => {this.flows = p});
  }

  ngAfterViewInit(){
    
  }

  ngAfterViewChecked(){
    if(this.redrawFlag){
      this.jsplumbDraw(this.instance);
      this.redrawFlag = false;
    }
  }

  public connectorModels: Array<ConnectorModel>;
  public newOneFlag: boolean = false;
  public newConnector: ConnectorModel;
  public newTrigger: TriggerModel;
  public newAction: ActionModel;
  public sideTree: ConnectorTree;
  public treeConnector: ConnectorTree;
  public activeTrigger: any;
  public activeActions: Array<any> = new Array<any>();
  public messageInfo: MessageModel = new MessageModel();
  public adapterInfo: AdapterModel;
  public currentFlow: FlowModel= new FlowModel();
  public currentFlowId: any;
  public flows: Array<FlowModel> = new Array<FlowModel>();
  public redrawFlag: boolean = false;
  private instance: any;

  showAdapter(triggerId: any, actionId: any): void {
    this.connectorService.getAdapterProperties(triggerId, actionId, (p)=>{
      this.adapterInfo = p != null ? p : new AdapterModel();
      this.adapter.config = this.config;
      this.adapter.show();
    });
  }
 
  hideAdapter(): void {
    this.adapter.hide();
  }

  BuildData(models:Array<ConnectorModel>): void{
    this.connectorModels = models;
    if(this.connectorModels != null && typeof(this.connectorModels) != undefined && this.connectorModels.length > 0){
      this.treeConnector = new ConnectorTree();
      this.connectorModels.forEach(connector => {
        this.treeConnector.TreeRoot.push(this.convertConnectorModelToTree(connector));
      });
      this.sideTree = this.treeConnector;
    }
    this.redrawFlag = true;
  }

  addNewConnector(newConnectorTemplate: TemplateRef<any>): void{
    this.BuildNewConnector();
    this.modalRef = this.modalService.show(newConnectorTemplate, this.config);
  }

  addNewTrigger(): void{
    if(this.newConnector.Triggers == null || typeof(this.newConnector.Triggers) == undefined){
      this.newConnector.Triggers = new Array<TriggerModel>();
    }
     this.newTrigger =  new TriggerModel();
     this.newTrigger.Id = this.newConnector.Triggers.length > 0 ? this.newConnector.Triggers[this.newConnector.Triggers.length-1] : 1;
     this.newTrigger.ConnectorId = this.newConnector.Id;
  }

  saveNewTrigger(): void{
    this.newConnector.Triggers.push(this.newTrigger);
    this.newTrigger = null;
  }

  addNewAction(triggerId : any): void{
    if(this.newConnector.Actions == null || typeof(this.newConnector.Actions) == undefined){
      this.newConnector.Actions = new Array<ActionModel>();
    }
    this.newAction = new ActionModel();
    this.newAction.Id =  this.newConnector.Actions.length > 0 ? this.newConnector.Actions[this.newConnector.Actions.length-1] : 1;
    this.newAction.ConnectorId = this.newConnector.Id;
  }

  saveNewAction(): void{
    this.newConnector.Actions.push(this.newAction);
    this.newAction = null;
  }

  BuildNewConnector(): void{
    this.newConnector = new ConnectorModel();
    this.newConnector.Id = this.connectorModels[this.connectorModels.length - 1].Id + 1;
    this.newOneFlag = true;
  }

  saveNewConnector(): void{
    this.connectorModels.unshift(this.newConnector);
    var newConnectorNode = this.convertConnectorModelToTree(this.newConnector);
    this.treeConnector.TreeRoot.unshift(newConnectorNode);
    this.closeConnector();
  }

  closeConnector(): void{
    this.modalRef.hide();
  }

  showHideConnector(connector): void{
    connector.ExpansionFlag = !connector.ExpansionFlag;
    if(connector.TriggerTree){
      connector.TriggerTree.ExpansionFlag = false;
    }
    if(connector.ActionTree){
      connector.ActionTree.ExpansionFlag = false;
    }
  }

  showHideTrigger(triggerTree): void{
    triggerTree.ExpansionFlag = !triggerTree.ExpansionFlag;
  }

  showHideAction(actionTree): void{
    actionTree.ExpansionFlag = !actionTree.ExpansionFlag;
  }

  searchByKeyword(): void{
    var keyword = (document.getElementById('keyword') as HTMLInputElement).value;
    if(keyword != null && keyword != '' && typeof(keyword) != undefined){
      let tempTree = new ConnectorTree();
      tempTree.TreeRoot =  new Array<ConnectorNode>();
      for(var i in this.treeConnector.TreeRoot){
        let tempRoot = this.treeConnector.TreeRoot[i];
        if(tempRoot.ConnectorName.indexOf(keyword) > -1){
          tempTree.TreeRoot.push(tempRoot);
        }else{

          let newConnectorNode = new ConnectorNode();
          newConnectorNode.ConnectorId =  tempRoot.ConnectorId
          newConnectorNode.ConnectorName = tempRoot.ConnectorName;
          newConnectorNode.TriggerTree = null;
          newConnectorNode.ActionTree = null;
          newConnectorNode.ExpansionFlag = true;

          let newTriggerTree = new TriggerNode();
          newTriggerTree.ExpansionFlag = true;
          for(var l in tempRoot.TriggerTree.TriggerChild){
            let tempTrigger = tempRoot.TriggerTree.TriggerChild[l];
            if(tempTrigger.TriggerChildName.includes(keyword)){
              newTriggerTree.TriggerChild.push(tempTrigger);
            }
          }

          let newActionTree = new ActionNode();
          newActionTree.ExpansionFlag = true;
          for(var k in tempRoot.ActionTree.ActionChild){
            let tempAction = tempRoot.ActionTree.ActionChild[k];
            if(tempAction.ActionChildName.includes(keyword)){
              newActionTree.ActionChild.push(tempAction);
            }
          }
          if(newTriggerTree.TriggerChild.length > 0){
            newConnectorNode.TriggerTree = newTriggerTree;
          }

          if(newActionTree.ActionChild.length > 0){
            newConnectorNode.ActionTree = newActionTree;
          }

          if(newConnectorNode.TriggerTree != null || newConnectorNode.ActionTree != null){
            tempTree.TreeRoot.push(newConnectorNode);
          }
        }
      }
      this.sideTree = tempTree;
    }else{
      this.sideTree = this.treeConnector;
    }
    this.redrawFlag = true;
  }

  saveFlow(): void{
    if(this.activeTrigger == null || this.activeActions.length == 0){
      this.messageInfo.MessageType = MessageEnum.Error;
      this.messageInfo.Message = "please assign a flow, trigger and action can't be null.";
      return;
    }

    if(this.currentFlow.Name == '' || this.currentFlow.Name == undefined){
      this.messageInfo.MessageType = MessageEnum.Error;
      this.messageInfo.Message = "please input a valid flow name, then try save again.";
      return;
    }

    this.currentFlow.Trigger = { Id : this.activeTrigger.id.substring(0, this.activeTrigger.id.lastIndexOf("_")), ConnectorId: this.activeTrigger.connectorId } as TriggerModel;
    this.currentFlow.Actions = new Array<ActionModel>();
    this.activeActions.forEach(p => {
      let actionModel = {
        Id: p.id.substring(0, p.id.lastIndexOf("_")),
        ConnectorId: p.connectorId
      } as ActionModel;
      this.currentFlow.Actions.push(actionModel);
    });
    

    this.connectorService.saveFlow(this.currentFlow, (p)=>{
      this.flows.push(p);
      this.messageInfo.MessageType = MessageEnum.Success;
      this.messageInfo.Message= "Save flow successfully.";
      this.instance.reset();
      $('#flow-panel').empty();
      this.activeTrigger = null;
      this.activeActions = [];
      this.currentFlow = new FlowModel();
      console.log("The new flow has been saved successfully.");
    });
  }

    selectFlow(flowId: any): void{
      this.currentFlowId = flowId;
    }

    viewFlow(): void{
      if(this.currentFlowId != null && this.currentFlowId != undefined){
        this.instance.reset(); 
        $('#flow-panel').empty();
        this.currentFlow = this.flows.find(p=>p.Id == this.currentFlowId);
        this.drawFlowDetail(this.currentFlow);
      }
    }

  //#region draw

  drawFlowDetail(flowInfo: FlowModel){
    var that = this;
    let instance = that.instance;
    let trigger = flowInfo.Trigger;
    let actions = flowInfo.Actions;
    let panel = $('#flow-panel');
    let triggerOffsetX = "250px";
    let triggerOffsetY = panel.height()/2 - 40 + "px";
    let triggerDom = this.buildNewDocument({X: triggerOffsetX, Y: triggerOffsetY}, trigger.Id + "_1", trigger.ConnectorId, trigger.Name);
    this.buildDragAttribute(instance, triggerDom, "1");
    let actionOffsetX = panel.width()/2 + 120 + "px";
    
    for(var i = 0; i < actions.length; i++){
     let actionOffsetY = panel.height()/(actions.length + 1) * (i + 1) - 40 + "px";
     let actionDom = this.buildNewDocument({X:actionOffsetX, Y:actionOffsetY}, actions[i].Id + "_2", actions[i].ConnectorId, actions[i].Name);
     this.buildDragAttribute(instance, actionDom, "2");
     this.buildConnector(instance, triggerDom, actionDom, that);
    }     
  }

  //#endregion

  //#region draw

  jsplumbDraw(instance: any){
    let that = this;
    let location = null;
    
    buildListener($(".liSide"));

    function buildListener(nodes){
        nodes.attr("draggable", "true").on("dragstart", function(event){
        location = {"X": event.target.offsetLeft, "Y": event.target.offsetTop};
        let connectorId = event.target.lastElementChild.value;
        let param = connectorId + "_" + event.target.id + "_" + event.currentTarget.getAttribute("elementflag") + "_" + event.target.textContent;
        event.originalEvent.dataTransfer.setData("text", param);
      });
      
      $("#flow-panel").on("dragover", function(event){
        event.preventDefault();
      }).on("drop", function(event){
        let inputString = (event.originalEvent as DragEvent).dataTransfer.getData("text");
        let valueToBind = inputString.substring(inputString.indexOf("_") + 1, inputString.lastIndexOf("_"));
        let type = valueToBind.substring(valueToBind.lastIndexOf("_") + 1, valueToBind.length);
        let valueToDisplay = inputString.substring(inputString.lastIndexOf("_") + 1, inputString.length);
        let rootId = inputString.substring(0, inputString.indexOf("_"));
        let localX = '' + (event.originalEvent as DragEvent).offsetX + 'px';
        let localY = '' + (event.originalEvent as DragEvent).offsetY + 'px';
        if(type == '1'){
          if(that.activeTrigger != null && that.activeTrigger != '' && that.activeTrigger != undefined){
            console.log("current flow has more than one trigger, so can't move the new trigger.");
          }else{
            event.preventDefault();
            let newOne = that.buildNewDocument({X: localX, Y: localY}, valueToBind, rootId, valueToDisplay);
            that.buildDragAttribute(instance, newOne, type);
            that.activeTrigger = { id: valueToBind, connectorId: rootId };
          }
        }else if(type == '2' && document.getElementById(valueToBind) == null){
          event.preventDefault();
          let newOne = that.buildNewDocument({X: localX, Y: localY}, valueToBind, rootId, valueToDisplay);
          that.buildDragAttribute(instance, newOne, type);
        }else{
          console.log("move failed");
        }
      });
      jsPlumb.fire("jsFlowLoaded", instance);
    }
  }
  
//#endregion


//#region draw

 buildNewDocument(location, noodId, rootId, value){
  var newElement = document.createElement('div');
  newElement.id = noodId;
  newElement.innerHTML = value;
  newElement.setAttribute('connector', rootId);
  if(noodId.substring(noodId.lastIndexOf('_')+1, noodId.length) == '1'){
    newElement.setAttribute('style', "position: absolute; top:" + location.Y + ";left:" + location.X + ";width: 120px; height: 80px;border: 1px #009966 solid; cursor:pointer; color: white; background: #009966");
  }else{
    newElement.setAttribute('style', "position: absolute; top:" + location.Y + ";left:" + location.X + ";width: 120px; height: 80px;border: 1px #0099CC solid; cursor:pointer; color: white; background: #0099CC");
  }
  
  newElement.setAttribute('align', 'center');
  document.getElementById('flow-panel').appendChild(newElement);
  
  return newElement;
}

 buildDragAttribute(instance, doc, type){
   var that = this;
  if(type == "1"){
         var connectorPaintStyle = {
              lineWidth: 4,
              strokeStyle: "#61B7CF",
              joinstyle: "round",
              outlineColor: "white",
              outlineWidth: 2
          };

          var connectorHoverStyle = {
              lineWidth: 4,
              strokeStyle: "#216477",
              outlineWidth: 2,
              outlineColor: "white"
          };
    var formStyle = {
                 isSource: true,   
                 endpoint: ["Dot", { radius: 6 }], 
                 paintStyle: { stroke: "#FF9933", fill: "#FF9933", strokeWidth: 1},
                 connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
                 maxConnections: -1,  
                 HoverPaintStyle : {stroke:"#CCCC00" },
                 EndpointHoverStyle : {stroke:"#CCCC00" },
                 connectorStyle:{ stroke:"#CCCC00", strokeWidth:3 },
                 connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }],
                 ["Label", {label:"Adapter", location:0.5, id:"myLabel", cssClass:"labelClass", events: {
                  "click": function(info, event){
                      let triggerId = info.component.sourceId.substring(0, info.component.sourceId.lastIndexOf("_"));
                      let actionId = info.component.targetId.substring(0, info.component.targetId.lastIndexOf("_"));
                      that.showAdapter(triggerId, actionId);
                  }
                }}]]
                };
    instance.addEndpoint(doc, formStyle);
  }else if(type == "2"){
    var toStyle = {
      isTarget: true,   
      endpoint: ["Dot", { radius: 6 }], 
      paintStyle: { stroke: "#FF9933", fill: "#FF9933", strokeWidth: 2},
      connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
      maxConnections: -1,  
      HoverPaintStyle : {stroke:"#7073EB" },
      EndpointHoverStyle : {stroke:"#7073EB" },
      connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]]};
    instance.addEndpoint(doc, toStyle);
  }

  instance.bind("connection",function(info, originalEvent){
    if(info.sourceId == that.activeTrigger.id){
      let id: any = info.targetId;
      let connectorId: any = info.target.attributes["connector"].value;
      if(!checkIfInclude({id:id, connectorId: connectorId}, that.activeActions, "boolean")){
        that.activeActions.push({ id: info.targetId, connectorId: connectorId });
      }
    }
  });

  instance.bind("connectionDetached", function(info,originalEvent){
    let id: any = info.targetId;
    let connectorId: any = info.target.attributes["connector"].value;
    let index: any = checkIfInclude({id:id, connectorId: connectorId}, that.activeActions, "int");
    if(info.sourceId == that.activeTrigger.id && index > -1){
      that.activeActions.splice(index, 1);
    }
  });

  function checkIfInclude(target: any, source: any, returnParam: string){
    if(returnParam == "boolean"){
      for(var i in source){
        if(source[i].id == target.id && source[i].connectorId == target.connectorId){
          return true;
        }
      }                
      return false; 
    }else if(returnParam == "int"){
      for(var i in source){
        if(source[i].id == target.id && source[i].connectorId == target.connectorId){
          return i;
        }
      }
      return -1;
    }
  }

  instance.draggable(doc.id, {containment: "flow-panel"});
}

 buildConnector(instance, fromDom, toDom, that){
  instance.connect({
    source: fromDom, 
    target: toDom, 
    paintStyle: { stroke: "#CCCC00", fill: "#CCCC00", strokeWidth: 3}, 
    connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
    maxConnections: 1,
    endpointStyle:{ radius:6, fillStyle: "#CCCC00", fill: "transparent" },
    HoverPaintStyle : {stroke:"#CCCC00" },
    EndpointHoverStyle : {stroke:"#CCCC00" },
    connectorStyle:{ stroke:"#CCCC00", strokeWidth:3 },
    overlays: [["Arrow", { width: 10, length: 10, location: 1 }],
    ["Label", { label:"Adapter", location:0.5, id:"myLabel", cssClass: "labelClass", events: {
     "click": function(info, event){
         let triggerId = info.component.sourceId.substring(0, info.component.sourceId.lastIndexOf("_"));
         let actionId = info.component.targetId.substring(0, info.component.targetId.lastIndexOf("_"));
         that.showAdapter(triggerId, actionId);
     }
   }}]]
  });
}

//#endregion


convertConnectorModelToTree(connector: ConnectorModel): ConnectorNode{
  let rootNode = new ConnectorNode();
  rootNode.ConnectorId = connector.Id;
  rootNode.ConnectorName = connector.Name;
  rootNode.ExpansionFlag = false;
  rootNode.TriggerTree = new TriggerNode();
  connector.Triggers.forEach(p=>{
    let childNode = {
      TriggerChildId : p.Id,
      TriggerChildName: p.Name,
      IsValid : true
    } as TriggerChildNode;
    rootNode.TriggerTree.TriggerChild.push(childNode);
  });
  rootNode.ActionTree = new ActionNode();
  connector.Actions.forEach(p=>{
    let childNode = {
       ActionChildId: p.Id,
       ActionChildName: p.Name,
       IsValid: true
    } as ActionChildNode;
    rootNode.ActionTree.ActionChild.push(childNode);
  })
  return rootNode;
}
}

export enum MessageEnum{
  Info = 0,
  Wainning = 1,
  Error = 2,
  Success = 3
};

export class MessageModel{
  public MessageType: MessageEnum;
  public Message: string;
};

