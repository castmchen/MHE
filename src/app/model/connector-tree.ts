  export class ConnectorTree {
      constructor(){
          this.TreeRoot = new Array<ConnectorNode>();
      }
    public TreeRoot: Array<ConnectorNode>;
  };
  
  export class ConnectorNode{
    constructor(){
      this.ExpansionFlag = false;
    }
    public ConnectorId: any;
    public ConnectorName: string;
    public ExpansionFlag: boolean;
    public TriggerTree: TriggerNode;
    public ActionTree: ActionNode;
  };
  
  export class TriggerNode{
      constructor(){
          this.TriggerNodeName = "Trigger";
          this.TriggerChild = new Array<TriggerChildNode>();
          this.ExpansionFlag = false;
      }
    public TriggerNodeName: string;
    public ExpansionFlag: boolean;
    public TriggerChild: Array<TriggerChildNode>;
  };
  
  export class TriggerChildNode{
    public TriggerChildId: any;
    public TriggerChildName: string;
    public IsValid: boolean;
  };
  
  export class ActionNode{
      constructor(){
          this.ActionNodeName = "Action";
          this.ActionChild = new Array<ActionChildNode>();
          this.ExpansionFlag = false;
      }
    public ActionNodeName: string;
    public ExpansionFlag: boolean;
    public ActionChild: Array<ActionChildNode> ;
  };
  
  export class ActionChildNode{
    public ActionChildId: any;
    public ActionChildName: string;
    public IsValid: boolean;
  };
  
