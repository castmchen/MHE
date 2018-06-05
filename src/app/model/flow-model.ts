import { TriggerModel, ActionModel } from './connector-model';


export class FlowModel{
    constructor(){
        this.Actions = new Array<ActionModel>();
    }
    public Id: any;
    public Name: string;
    public Number: number;
    public Description: string;
    public Trigger: TriggerModel;
    public Actions: Array<ActionModel>;
}