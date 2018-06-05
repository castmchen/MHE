export class connectorDomain {
    constructor(){
        this.triggers = new Array<trigger>();
        this.actions = new Array<action>();
    }
    connectorId: string;
    connectorName: string;
    destription: string;
    triggers: Array<trigger>;
    actions: Array<action>;
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
    inputJson: Array<triggerInputInfo>;
    constructor(){
        this.inputJson = new Array<triggerInputInfo>();
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
    inputJson:Array<actionInputInfo>;
    constructor(){
        this.inputJson = new Array<actionInputInfo>();
    }
}

export class triggerInputInfo{
    name: string;
    description: string;
}

export class actionInputInfo{
    name: string;
    description: string;
}

export class triggerAndActionForAdapt{
    triggerInfo: trigger;
    actionInfo: action;
}

export class connection{
    constructor(){
        this.connections = new Array<connectionDetail>();
    }
    _id: any;
    connectionId: string;
    connectionName: string;
    description: string;
    status: string;
    connections: Array<connectionDetail>;
}

export class connectionDetail{
    sequence: string;
    triggerConnector: string;
    triggerId: string;
    actionConnector: string;
    actionId: string;
}

export class flow{
    _id: any;
    flowId: string;
    flowName: string;
    description: string;
    type: string;
    enterpriseId: string;
    connectionId: string;
    status: string;
}

export class connectionAndFlow{
    constructor(){
        this.connection = new connection();
        this.flow = new flow();
    }
   connection: connection;
   flow: flow; 
}

export class flowDomain{
    flowID: any;
    flowName: string;
    flowDescription: string;
    triggerId: any;
    triggerName: string;
    actionId: any;
    actionName: string;
    createdBy: string;
    createdDateTime: string;
    updatedBy: string;
    updatedDateTime: string;
}