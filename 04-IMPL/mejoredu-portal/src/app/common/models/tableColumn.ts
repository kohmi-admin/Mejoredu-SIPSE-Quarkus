export interface TableColumn {
  columnDef: string;
  header: string;
  width?: string;
  display?: boolean;
  isSortable?: boolean;
  alignLeft?: boolean;
  alignRight?: boolean;
  isCurrency?: boolean;
}
