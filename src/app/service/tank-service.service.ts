import { Injectable } from '@angular/core';
import { TankModel, FlowModel, TriggerModel, ActionModel, FlowActionModel } from '../model/tank-model';

@Injectable({
  providedIn: 'root'
})

export class TankService {

  constructor() { }

  InitData(): Array<TankModel>{
    let tankList = new Array<TankModel>();
    let tankInfo1: TankModel = new TankModel();
    tankInfo1.Id = 1;
    tankInfo1.Name = "container1";
    tankInfo1.Discription = "container1";
    let triggerInfo1: TriggerModel = new TriggerModel();
    triggerInfo1.Id = 1;
    triggerInfo1.Name = "tigger1";
    triggerInfo1.Discription = "Discription1";
    tankInfo1.Triggers.push(triggerInfo1);
    let actionInfo1: ActionModel = new ActionModel();
    actionInfo1.Id = 1;
    actionInfo1.Name = "action1";
    actionInfo1.Discription = "action1";
    actionInfo1.TriggerId = triggerInfo1.Id;
    tankInfo1.Actions.push(actionInfo1);



    let tankInfo2: TankModel = new TankModel();
    tankInfo2.Id = 2;
    tankInfo2.Name = "container2";
    tankInfo2.Discription = "container2";
    let triggerInfo2: TriggerModel = new TriggerModel();
    triggerInfo2.Id = 2;
    triggerInfo2.Name = "tigger2";
    triggerInfo2.Discription = "Discription2";
    tankInfo2.Triggers.push(triggerInfo2);
    let actionInfo2: ActionModel = new ActionModel();
    actionInfo2.Id = 2;
    actionInfo2.Name = "action2";
    actionInfo2.Discription = "action2";
    actionInfo2.TriggerId = triggerInfo2.Id;
    tankInfo2.Actions.push(actionInfo2);


    let tankInfo3: TankModel = new TankModel();
    tankInfo3.Id = 3;
    tankInfo3.Name = "container3";
    tankInfo3.Discription = "container3";
    let triggerInfo3: TriggerModel = new TriggerModel();
    triggerInfo3.Id = 3;
    triggerInfo3.Name = "tigger3";
    triggerInfo3.Discription = "Discription3";
    tankInfo3.Triggers.push(triggerInfo3);
    let actionInfo3: ActionModel = new ActionModel();
    actionInfo3.Id = 3;
    actionInfo3.Name = "action3";
    actionInfo3.Discription = "action3";
    actionInfo3.TriggerId = triggerInfo3.Id;
    tankInfo3.Actions.push(actionInfo3);

    //#region  flow

    let flowInfo1 = new FlowModel();
    flowInfo1.FlowTankId = tankInfo2.Id;
    flowInfo1.FlowNumber = 1;
    let flowActionInfo = new FlowActionModel();
    flowActionInfo.FlowActionId = tankInfo2.Actions[0].Id;
    flowActionInfo.FlowACtionNumber = 1;
    flowInfo1.FlowAction.push(flowActionInfo);
    tankInfo1.Triggers[0].FlowList.push(flowInfo1);

    //#endregion
    tankList.push(tankInfo1);
    tankList.push(tankInfo2);
    tankList.push(tankInfo3);
    return tankList;
  }

}
