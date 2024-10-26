export interface ChartLabelI {
    active: boolean;
    chart: any;
    dataIndex: number;
    dataset: {
        label: string,
        data: number[],
        backgroundColor: string[],
    }
    datasetIndex: 0,
}