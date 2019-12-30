export class NewProjectModel {
    public id: number;
    public projectName: string;
    public projectType: string; // posiblemente este esta estandarizado por lo tanto se pueda hacer un modelo aparte
    public projectState: string;
    public projectStateId: number;
    public startDate: Date;
    public endDate: Date;
    public sinOrdenCompra: number;
    public repositorioSVN: string;
    public numeroDeCompra: number;
    public estimateHours: number;
    public realHours: number;
    public realStartDate: Date;
    public realEndDate: Date;
    public customerId: number;
    public customer: string;
    public projetRiesgo: string; // es un combo box
    public displayName: string;
    public description: string;
    public managementAreaInChargeId: number;
    public managementAreaInCharge: string;
    public sponsor: string;
    public sponsorId: number;
}