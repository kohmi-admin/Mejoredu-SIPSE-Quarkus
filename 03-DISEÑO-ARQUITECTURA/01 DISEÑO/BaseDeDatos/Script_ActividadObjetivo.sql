 SELECT 
        `vao`.`cve_usuario` AS `cveUsuario`,
        `vao`.`id_anhio` AS `anhio`,
        `vao`.`id_proyecto` AS `id_proyecto`,
        `vao`.`id_catalogo_unidad` AS `id_catalogo_unidad`,
        `vai`.`id_catalogo_indicador` AS `id_catalogo_indicador`,
        `mme`.`id_elemento` AS `idMeta`,
        `vao`.`cveObjetivo` AS `cveObjetivo`,
        '.' AS `cveMetaPara`,
        `vai`.`nomIndicador` AS `nomIndicador`,
        `cmc`.`cd_opcion` AS `periodicidad`,
        `mme`.`cx_periodo` AS `periodicidadOtro`,
        `cmcMed`.`cd_opcion` AS `unidadMedida`,
        `mme`.`cx_unidad_medida` AS `unidadMedidaOtro`,
        `cmcTend`.`cd_opcion` AS `tendencia`,
        'tendenciaOtro' AS `tendenciaOtro`,
        'Encuesta' AS `fuente`,
        'fuenteOtro' AS `fuenteOtro`,
        (select entregables from vt_productoActivoEntregable cpae where cpae.id_producto = `cpp`.`id_producto`) AS `entregables`
    FROM
        ((`vt_actividadObjetivo` `vao`
        JOIN `vt_actividadIndicadorPI` `vai`)
        JOIN (((`met_mp_elemento` `mme`
        LEFT JOIN `cat_master_catalogo` `cmc` ON ((`mme`.`id_catalogo_periodicidad` = `cmc`.`id_catalogo`)))
        LEFT JOIN `cat_master_catalogo` `cmcMed` ON ((`mme`.`id_catalogo_unidad_medida` = `cmcMed`.`id_catalogo`)))
        LEFT JOIN `cat_master_catalogo` `cmcTend` ON ((`mme`.`id_catalogo_tendencia` = `cmcTend`.`id_catalogo`))))
    WHERE
        ((`vao`.`id_actividad` = `vai`.`id_actividad`)
            AND (`mme`.`id_catalogo_objetivo` = `vao`.`id_catalogo_objetivo`))
    GROUP BY `vao`.`cve_usuario` , `vao`.`id_anhio` , `vao`.`id_proyecto` , `vao`.`id_catalogo_unidad` , `vai`.`id_catalogo_indicador` , `mme`.`id_elemento` , 
    `vao`.`cveObjetivo` , '.' , `vai`.`nomIndicador` , `cmc`.`cd_opcion` ,
    `mme`.`cx_periodo` , `cmcMed`.`cd_opcion` , `mme`.`cx_unidad_medida` , `cmcTend`.`cd_opcion` , 'tendenciaOtro' , 'Encuesta'