export class ConnectorModel {
    connectorId: string;
    connectorName: string;
    destription: string;
    triggers: Array<trigger>;
    actions: Array<action>;
    constructor(){
        this.triggers = new Array<trigger>();
        this.actions = new Array<action>();
    }
}

export class trigger{
    triggerId: string;
    triggerName: string;
    connectorId: string;
    destription: string;
    type: string;
    status: string;
    createdBy: string;
    createdDateTime: Date
    updatedBy: string;
    updatedDateTime: Date;
    inputJson: Array<property>;
    constructor(){
        this.inputJson = new Array<property>();
    }
}

export class action{
    actionId: string;
    actionName: string;
    connectorId: string;
    description: string;
    endPoint: string;
    type: string;
    status: string;
    createdBy: string;
    createdDatetime: Date;
    updatedBy: string;
    updatedDatetime: Date;
    inputJson:Array<property>;
    constructor(){
        this.inputJson = new Array<property>();
    }
}

export class property{
    name: string;
    description: string;
}
