export class ConnectorModel {
    constructor(){
        this.Triggers = new Array<TriggerModel>();
        this.Actions = new Array<ActionModel>();
    }
    public Id: any;
    public Name: string;
    public Discription: string;
    public Triggers: Array<ActionModel>;
    public Actions: Array<ActionModel>;
}

export class TriggerModel{
    public Id: any;
    public Name: string;
    public Discription: string;
    public ConnectorId: any;
}

export class ActionModel{
    public Id: any;
    public Name: string;
    public Discription: string;
    public ConnectorId: any;
}

export class Propertry{
    public Name: string;
    public Description: string;
}

export class AdapterModel{
    constructor(){
        this.Trigger = new Array<Propertry>();
        this.Action = new Array<Propertry>();
    }
    public Trigger: Array<Propertry>;
    public Action: Array<Propertry>;
}

export class Connection{
    
}