export interface ISubMenu {
  id: number;
  name: string;
  icon?: string;
  path: string;
  width?: number;
  roles?: string[];
  children?: ISubMenu[];
}

export interface IMenu {
  name: string;
  icon: string;
  facultad: string;
  active: boolean;
  children?: ISubMenu[];
}
