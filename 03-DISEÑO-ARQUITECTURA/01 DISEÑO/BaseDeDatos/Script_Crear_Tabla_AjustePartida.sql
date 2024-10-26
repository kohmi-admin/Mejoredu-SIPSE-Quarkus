drop TABLE `mejoreduDB`.`met_partida_adecuacion`;
CREATE TABLE `mejoreduDB`.`met_partida_adecuacion` (
  `id_ajuste_partida` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador secuencial automatico del ajuste a la partida',
  `id_partida_gasto` INT NULL COMMENT 'Identificador de la partida, en segunda fase se relacionará con la table met_gasto_partida',
  `id_presupuesto` INT NULL COMMENT 'Identificador del presupuesto, en segunda fase se relacionará con la table met_cortoplazo_presupuesto',
  `ix_mes` DOUBLE NULL COMMENT 'Mes a considerar en el movimiento de ajuste sobre la partida',
  `ix_monto` DOUBLE NULL COMMENT 'Monto a considerar en el movimiento de ajuste sobre la partida',
  `ix_tipo` INT NULL DEFAULT 1 COMMENT 'Tipo de movimiento sobre la partida 1= Ampliacion, 2= reducción, 3=traspaso, 4=reingreso',
  `cve_partida` VARCHAR(80) NULL COMMENT 'Clave de la partida, es registrada en duro, no se relaciona con ninguna tabla',
  `cs_estatus` VARCHAR(1) NULL COMMENT 'Bandera que permite conocer A=Activo o I=Inactivo el registro',
  PRIMARY KEY (`id_ajuste_partida`))
COMMENT = 'Registra los aumentos, reducciones a solicitar en la partida de gasto, relacionada con la tabla met_partida de gasto';
