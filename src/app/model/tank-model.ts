export class TankModel {
    public Id: any;
    public Name: string;
    public Discription: string;
    public Triggers: Array<TriggerModel> = new Array<TriggerModel>();
    public Actions: Array<ActionModel> = new Array<ActionModel>();
}

export class TriggerModel{
    public Id: any;
    public Name: string;
    public Discription: string;
    public TankId: any;
    public FlowList: Array<FlowModel> = new Array<FlowModel>();
}

export class ActionModel{
    public Id: any;
    public Name: string;
    public Discription: string;
    public TankId: any;
    public TriggerId: any;
}

export class FlowModel{
    public FlowTankId: any;
    public FlowAction: Array<FlowActionModel> = new Array<FlowActionModel>();
    public FlowNumber: number;
}

export class FlowActionModel{
    public FlowActionId: any;
    public FlowACtionNumber: number;
}