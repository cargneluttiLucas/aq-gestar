export class NewProjectModel {
    public id: number; // hiden
    public customerId: number; // hiden
    public customer: string;
    public projectName: string;
    public projectType: string; // posiblemente este esta estandarizado por lo tanto se pueda hacer un modelo aparte
    public projectState: string;
    public projectStateId: number; // hiden
    public startDate: Date;
    public realStartDate: Date;
    public endDate: Date;
    public realEndDate: Date;
    public estimatedHours: number;
    public realHours: number;
    public repositorioSVN: string;

    public numeroDeCompra: number;
    // TODO: falta agregar el checkbos para esoto
    public sinOrdenCompra: number;


    public projectRisk: string; // es un combo box
    public displayName: string;
    public sponsor: string;
    public sponsorId: number; // hiden
    public managementAreaInChargeId: number; // hiden
    public managementAreaInCharge: string;
    public description: string;

    public agentactions: string; // hiden
    public icon2: string; // hiden
}
