import { Component, OnInit, TemplateRef } from '@angular/core';
import { TankModel, TriggerModel, ActionModel, FlowModel, FlowActionModel } from '../model/tank-model';
import { TankService } from '../service/tank-service.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { IfStmt } from '@angular/compiler';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { debug } from 'util';
import { jsPlumb } from '../../../node_modules/jsplumb/dist/js/jsplumb';
import * as $ from 'jquery';
import { Action } from 'rxjs/internal/scheduler/Action';
import { forEach } from '@angular/router/src/utils/collection';



@Component({
  selector: 'app-app-management',
  templateUrl: './app-management.component.html',
  styleUrls: ['./app-management.component.css']
})
export class AppManagementComponent implements OnInit {

  constructor(private tankService: TankService, private modalService: BsModalService) { }
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  ngOnInit(){
    this.BuildData();
  }

  ngAfterViewInit(){
    this.jsplumbDraw();
};

  public containers: Array<TankModel>;
  public newOneFlag: boolean = false;
  public newContainer: TankModel;
  public newTrigger: TriggerModel;
  public newAction: ActionModel;
  public sideTree: Tree;
  public instance: any;
  public activeTrigger: any;
  public activeActions: Array<any> = new Array<any>();
  public Offset: any;
  public messageInfo: MessageModel = new MessageModel();

  showhideLi(): any {
    return {
      "visibility": "hidden"
    };
}

  BuildData = function (){
    this.containers = this.tankService.InitData();
    if(this.containers != null && typeof(this.containers) != undefined && this.containers.length > 0){
      this.sideTree = new Tree();
      this.containers.forEach(container => {
        let triggerChildTreeList = new Array<TriggerChild>();
        container.Triggers.forEach(trigger => {
          let triggerChild =  {
            TriggerChildId: trigger.Id,
            TriggerChildName: trigger.Name,
            IsValid: true
          } as TriggerChild;
          triggerChildTreeList.push(triggerChild);
        });

        let actionChildTreeList = new Array<ActionChild>();
        container.Actions.forEach(action => {
          let actionChild = {
             ActionChildId: action.Id,
             ActionChildName: action.Name,
             IsValid: true
          } as ActionChild;
          actionChildTreeList.push(actionChild);
        });


        let triggerTree = new TriggerTree();
        triggerTree.ExpansionFlag = false;
        triggerTree.TriggerChild = triggerChildTreeList;

        let actionTree = new ActionTree();
        actionTree.ExpansionFlag = false;
        actionTree.ActionChild = actionChildTreeList;

        let containerTree = new ContainerTree();
        containerTree.ContainerId = container.Id;
        containerTree.ContainerName = container.Name;
        containerTree.ExpansionFlag = false;
        containerTree.TriggerTree = triggerTree;
        containerTree.ActionTree = actionTree;

        this.sideTree.TreeRoot.push(containerTree);
      });
    }
  };

  addNewContainer = function(newContainerTemplate: TemplateRef<any>){
    this.BuildNewContainer();
    this.modalRef = this.modalService.show(newContainerTemplate, this.config);
  }

  addNewTrigger = function(){
    if(this.newContainer.Triggers == null || typeof(this.newContainer.Triggers) == undefined){
      this.newContainer.Triggers = new Array<TriggerModel>();
    }
     this.newTrigger =  new TriggerModel();
     this.newTrigger.TankId = this.newContainer.Id;
     this.newTrigger.Id = this.newContainer.Triggers.length > 0 ? this.newContainer.Triggers[this.newContainer.Triggers.length-1] : 1;
  }

  saveNewTrigger = function(){
    this.newContainer.Triggers.push(this.newTrigger);
    this.newTrigger = null;
  }

  addNewAction = function(triggerId : any){
    if(this.newContainer.Actions == null || typeof(this.newContainer.Actions) == undefined){
      this.newContainer.Actions = new Array<ActionModel>();
    }
    this.newAction = new ActionModel();
    this.newAction.TankId = this.newContainer.Id;
    this.newAction.TriggerId = triggerId;
    this.newAction.Id =  this.newContainer.Actions.length > 0 ? this.newContainer.Actions[this.newContainer.Actions.length-1] : 1;
  }

  saveNewAction = function(){
    this.newContainer.Actions.push(this.newAction);
    this.newAction = null;
  }

  BuildNewContainer = function(){
    this.newContainer = new TankModel();
    this.newContainer.Id = this.containers[this.containers.length - 1].Id + 1;
    this.newOneFlag = true;
  }

  saveNewContainer = function(){
    this.containers.unshift(this.newContainer);
    var newContainerTree = this.convertModelToTree(this.newContainer);
    this.sideTree.TreeRoot.unshift(newContainerTree);
    this.closeContainer();
  }

  closeContainer = function(){
    this.modalRef.hide();
  }

  showHideContainer = function(container){
    container.ExpansionFlag = !container.ExpansionFlag;
    container.TriggerTree.ExpansionFlag = false;
    container.ActionTree.ExpansionFlag = false;
  }

  showHideTrigger(triggerTree){
    triggerTree.ExpansionFlag = !triggerTree.ExpansionFlag;
  }

  showHideAction(actionTree){
    actionTree.ExpansionFlag = !actionTree.ExpansionFlag;
  }

  convertModelToTree(container: TankModel){
    let rootNode = new ContainerTree();
    rootNode.ContainerId = container.Id;
    rootNode.ContainerName = container.Name;
    rootNode.ExpansionFlag = false;
    rootNode.TriggerTree = new TriggerTree();
    container.Triggers.forEach(p=>{
      let childNode = {
        TriggerChildId : p.Id,
        TriggerChildName: p.Name,
        IsValid : true
      } as TriggerChild;
      rootNode.TriggerTree.TriggerChild.push(childNode);
    });
    rootNode.ActionTree = new ActionTree();
    container.Actions.forEach(p=>{
      let childNode = {
         ActionChildId: p.Id,
         ActionChildName: p.Name,
         IsValid: true
      } as ActionChild;
      rootNode.ActionTree.ActionChild.push(childNode);
    })
    return rootNode;
  }

  saveFlow(){
    if(this.activeTrigger == null || this.activeActions.length == 0){
      this.messageInfo.MessageType = MessageEnum.Error;
      this.messageInfo.Message = "Please assign a flow, trigger and action can't be null.";
    }
    var flowTrigger: TriggerModel;
    var flowActionList = new Array<FlowActionModel>();
    var breakTrigger = false;
    for(var i in this.containers){
      if(!breakTrigger){
        var tempId = this.activeTrigger.split('_')[0];
        for(var j in this.containers[i].Triggers){
          if(tempId == this.containers[i].Triggers[j].Id){
            flowTrigger = this.containers[i].Triggers[j];
            flowTrigger.FlowList = new Array<FlowModel>();

            var flowObj = new FlowModel();
            flowObj.FlowTankId = this.containers[i].Id;
            flowObj.FlowNumber = i as any;
            flowObj.FlowAction = new Array<FlowActionModel>();
            flowTrigger.FlowList.push(flowObj);
            break;
          }
        }
      }
      if(this.activeActions.length > 0){
        var tempIds = [];
        this.activeActions.forEach(p => {
           tempIds.push(p.split('_')[0]);
        });
        for(var l in this.containers[i].Actions){
          var currentAction = this.containers[i].Actions[l];
          if(tempIds.indexOf(currentAction.Id)){
            var flowAction = new FlowActionModel();
            flowAction.FlowActionId = currentAction.Id;
            flowAction.FlowACtionNumber = l as any;
            flowActionList.push(flowAction);
          }
        }
      }
    }
    flowTrigger.FlowList[0].FlowAction = flowActionList;
    $('#flow-panel').empty();
    this.activeTrigger = null;
    this.activeActions = [];
    console.log("The new flow has been saved successfully.");
    }

    // showError(messageInfo: MessageModel){
    //   switch(messageInfo.MessageType){
    //     case MessageEnum.Info:{

    //     };
    //     case MessageEnum.Wainning: {

    //     };
    //     case MessageEnum.Error: {

    //     };

    //     default: break;
    //   }
    // }

  //#region draw

  jsplumbDraw(){
    let that = this;
    let location = null;
    let instance = jsPlumb.getInstance();
    buildListener($(".liSide"));

    function buildListener(nodes){
        nodes.attr("draggable", "true").on("dragstart", function(event){
        location = {"X": event.target.offsetLeft, "Y": event.target.offsetTop};
        let param = event.target.id + "_" + event.currentTarget.getAttribute("elementflag") + "_" + event.target.textContent;
        event.originalEvent.dataTransfer.setData("text", param);
      });
      
      $("#flow-panel").on("dragover", function(event){
        event.preventDefault();
      }).on("drop", function(event){
        var inputString = event.originalEvent.dataTransfer.getData("text");
        var valueToBind = inputString.substring(0,inputString.lastIndexOf("_"));
        var valueToDisplay = inputString.substring(inputString.lastIndexOf("_") + 1, inputString.length)
        let type = inputString.substring(inputString.indexOf("_")+1, inputString.lastIndexOf("_"))
        let localX = '' + event.originalEvent.offsetX + 'px';
        let localY = '' + event.originalEvent.offsetY + 'px';
        if(type == '1'){
          if(that.activeTrigger != null && that.activeTrigger != '' && that.activeTrigger != "undefined"){
            console.log("current flow has more than one trigger, so can't move the new trigger.");
            // rollback location
          }else{
            event.preventDefault();
            let newOne = buildNewDocument({X: localX, Y: localY}, valueToBind, valueToDisplay);
            buildDragAttribute(instance, newOne, type)
            that.activeTrigger = valueToBind;
          }
        }else if(type == '2'){
          event.preventDefault();
          let newOne = buildNewDocument({X: localX, Y: localY}, valueToBind, valueToDisplay);
          buildDragAttribute(instance, newOne, type)
          // that.activeActions.push(valueToBind);
        }else{
          console.log("move failed");
        }
      });
      jsPlumb.fire("jsFlowLoaded", instance);
    }

    function buildNewDocument(location, id, value){
      let newDoc = "<div id=" + id +"></div>";
      $("#flow-panel").append(newDoc);
      $("#"+ id).css({'width':'120', 'height':'50', 'position':'absolute','top':location.Y, 'left':location.X, 'border': '2px #9DFFCA solid', 'cursor' : 'pointer'}).attr('align','center').text(value);
      return $('#'+ id)[0];
    }

    function buildDragAttribute(instance, doc, type){
      if(type == "1"){
        // let formStyle = {
        //   isSource: true,
        //   endpoint: ["Dot", {radius: 5}],
        //   EndpointHoverStyle : null,
        //   EndpointHoverStyles : [ null, null ],
        //   PaintStyle : { lineWidth : 8, strokeStyle : "#456" },
        //   connectorStyle:{ strokeStyle:"#316b31", lineWidth:6 }
        // }

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
                     endpoint: ["Dot", { radius: 8 }], 
                     paintStyle: { stroke: "#FF8891", fill: "transparent", strokeWidth: 2},
                     connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
                     maxConnections: -1,  
                     HoverPaintStyle : {stroke:"#7073EB" },
                     EndpointHoverStyle : {stroke:"#7073EB" },
                     connectorStyle:{ stroke:"#7073EB", strokeWidth:3 },
                     connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }],
                     ["Label", {label:"Adapter", location:0.5, id:"myLabel", events: {
                      "click": function(label, event){
                         console.log("adapter");
                      }
                    }}]]
                    };
        instance.addEndpoint(doc, formStyle);
      }else if(type == "2"){
        var toStyle = {
          isTarget: true,   
          endpoint: ["Dot", { radius: 8 }], 
          paintStyle: { stroke: "#FF8891", fill: "transparent", strokeWidth: 2},
          connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
          maxConnections: -1,  
          HoverPaintStyle : {stroke:"#7073EB" },
          EndpointHoverStyle : {stroke:"#7073EB" },
          connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]]};
        instance.addEndpoint(doc, toStyle);
      }

      instance.bind("connection",function(info, originalEvent){
        if(info.sourceId == that.activeTrigger){
          that.activeActions.push(info.targetId);
        }
      });

      instance.bind("connectionDetached", function(info,originalEvent){
        var index = that.activeActions.indexOf(info.targetId);
        if(info.sourceId == that.activeTrigger && index > -1){
          that.activeActions.splice(index, 1);
        }
      });

      instance.draggable(doc.id, {containment: "flow-panel"});
    }
  }
  
//#endregion

}

export class Tree{
  public TreeRoot: Array<ContainerTree> = new Array<ContainerTree>();
}

export class ContainerTree{
  public ContainerId: any;
  public ContainerName: string;
  public ExpansionFlag: boolean;
  public TriggerTree: TriggerTree;
  public ActionTree: ActionTree;
};

export class TriggerTree{
  public TriggerNodeName: string = "Trigger";
  public ExpansionFlag: boolean;
  public TriggerChild: Array<TriggerChild> = new Array<TriggerChild>();
}

export class TriggerChild{
  public TriggerChildId: any;
  public TriggerChildName: string;
  public IsValid: boolean;
}

export class ActionTree{
  public ActionNodeName: string = "Action";
  public ExpansionFlag: boolean;
  public ActionChild: Array<ActionChild> = new Array<ActionChild>();
}

export class ActionChild{
  public ActionChildId: any;
  public ActionChildName: string;
  public IsValid: boolean;
}

export enum MessageEnum{
  Info = 0,
  Wainning = 1,
  Error = 2,
  Success = 3
}

export class MessageModel{
  public MessageType: MessageEnum;
  public Message: string;
}

