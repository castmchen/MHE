import { Component, OnInit, TemplateRef } from '@angular/core';
import { TankModel, TriggerModel, ActionModel, FlowModel, FlowActionModel } from '../model/tank-model';
import { TankService } from '../service/tank-service.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { IfStmt } from '@angular/compiler';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { debug } from 'util';
import * as flow from '../../assets/flow';

declare var Foo: any;

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
    debugger;
    flow
  }

  public Containers: Array<TankModel>;
  public newOneFlag: boolean = false;
  public newContainer: TankModel;
  public newTrigger: TriggerModel;
  public newAction: ActionModel;
  public SideTree: Tree;

  BuildData = function (){
    this.Containers = this.tankService.InitData();
    if(this.Containers != null && typeof(this.Containers) != undefined && this.Containers.length > 0){
      this.SideTree = new Tree();
      this.Containers.forEach(container => {
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

        this.SideTree.TreeRoot.push(containerTree);
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
    this.newContainer.Id = this.Containers[this.Containers.length - 1].Id + 1;
    this.newOneFlag = true;
  }

  saveNewContainer = function(){
    this.Containers.unshift(this.newContainer);
    var newContainerTree = this.convertModelToTree(this.newContainer);
    this.SideTree.TreeRoot.unshift(newContainerTree);
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


