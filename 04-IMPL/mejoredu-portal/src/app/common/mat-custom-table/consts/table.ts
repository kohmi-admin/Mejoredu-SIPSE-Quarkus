export const TableConsts = {
  actionButton: {
    edit: 'edit',
    delete: 'delete',
    view: 'view',
    custom: 'custom',
  },
}

export interface CustomActionI {
  id?: string;
  name: string;
  icon: string;
  toggleDisabled?: boolean;
  color?: string;
}

export interface TableActionsI {
  edit?: boolean;
  delete?: boolean;
  view?: boolean;
  custom?: CustomActionI[];
}
