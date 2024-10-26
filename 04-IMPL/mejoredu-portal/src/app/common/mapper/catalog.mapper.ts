import {
  ICatalogResponse,
  IItemCatalogoResponse,
} from '@common/interfaces/catalog.interface';

export function mapCatalogData({
  data,
  withIdx,
  withOrder,
  keyForOrder,
  withOptionNoAplica,
  withOptionSelect,
  viewId,
  getCustomValue,
}: {
  data: ICatalogResponse;
  withIdx?: boolean;
  withOrder?: boolean;
  keyForOrder?: string;
  withOptionSelect?: boolean;
  withOptionNoAplica?: boolean;
  viewId?: boolean;
  getCustomValue?: (data: IItemCatalogoResponse) => string;
}) {
  let arrReturn: any[] = [];
  if (withOptionSelect)
    arrReturn.push({
      id: '',
      value: 'Seleccionar',
    });

  if (withOptionNoAplica)
    arrReturn.push({
      id: '0',
      value: 'No aplica',
    });

  if (withOrder) {
    data.catalogo.sort((a, b) =>
      a[keyForOrder ?? 'cdOpcion'].localeCompare(b[keyForOrder ?? 'cdOpcion'])
    );
  }
  const arrCatalog = data.catalogo.map((item: any, idx: number) => {
    return {
      id: item.idCatalogo,
      value: `${withIdx ? String(`${idx + 1}. `) : ''}${viewId
          ? item.ccExterna
          : getCustomValue
            ? getCustomValue(item)
            : item.cdOpcion
        }`,
    };
  });

  const idxFindedNoAplica = arrCatalog.findIndex((itemFind) =>
    itemFind.value.toLowerCase().includes('no aplica')
  );

  if (idxFindedNoAplica > 0) {
    arrReturn.push(arrCatalog[idxFindedNoAplica]);
    arrCatalog.splice(idxFindedNoAplica, 1);
  }
  arrReturn = arrReturn.concat(arrCatalog);
  return arrReturn;
}
