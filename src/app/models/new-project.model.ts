export class NewProjectModel {
    public id: number;
    public customerId: number;
    public customer: string;
    public projectName: string;
    public projectType: string; // posiblemente este esta estandarizado por lo tanto se pueda hacer un modelo aparte
    public projectState: string;
    public projectStateId: number;
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
    public sponsorId: number;
    public managementAreaInChargeId: number;
    public managementAreaInCharge: string;
    public description: string;
}
