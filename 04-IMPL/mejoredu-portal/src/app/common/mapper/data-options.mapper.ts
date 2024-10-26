import { IItemActivitiesResponse } from "@common/interfaces/activities.interface";
import { IItemProductResponse } from "@common/interfaces/products.interface";
import { IItemProjectsResponse } from "@common/interfaces/projects.interface";
import { IItmeAccionFollowResponse } from "@common/interfaces/seguimiento/actions.interface";
import { IItemConsultarPRoyectosResponse } from "@common/interfaces/seguimiento/consultarProyectos.interface";

export function mapOptionProjects(data: IItemProjectsResponse[] | IItemConsultarPRoyectosResponse[]) {
  return data.map((item) => {
    return {
      id: item.idProyecto,
      value: item.nombre,
    };
  });
}

export function mapOptionActivities(data: IItemActivitiesResponse[]) {
  return data.map((item) => {
    return {
      id: item.idActividad,
      value: item.cxNombreActividad,
    };
  });
}

export function mapOptionProducts(data: IItemProductResponse[]) {
  return data.map((item) => {
    return {
      id: item.idProducto,
      value: item.nombre,
    };
  });
}

export function mapOptionActions(data: IItmeAccionFollowResponse[]) {
  return data.map((item) => {
    return {
      id: item.idAccion,
      value: item.nombre,
    };
  });
}
