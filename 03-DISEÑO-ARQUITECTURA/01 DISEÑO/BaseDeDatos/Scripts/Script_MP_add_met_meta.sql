CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_mp_meta` (
  `id_metas_bienestar` INT NOT NULL,
  `cx_nombre` VARCHAR(45) NULL COMMENT 'Se obtiene del nombre de la meta o parámetro que fue registrado en el submódulo de planeación a mediano plazo',
  `cx_meta` VARCHAR(45) NULL COMMENT 'Campo editable numérico de 4 dígitos de longitud para indicar el año, (se subdivide en dos columnas, en la primera muestra el número que representa esa meta o parámetro y en la segunda el porcentaje que representa dicha meta o parámetro)',
  `cx_periodicidad` VARCHAR(45) NULL COMMENT 'Se obtiene de la periodicidad que fue registrada dentro del submódulo de mediano plazo',
  `cx_unidad_medida` VARCHAR(45) NULL COMMENT 'Se obtiene de la unidad de medida que fue registrada dentro del submódulo de mediano plazo',
  `cx_tendencia_esperada` VARCHAR(45) NULL COMMENT 'Se obtiene de la tendencia esperada que fue registrada dentro del submódulo de mediano plazo',
  `cx_fuente_variable_uno` VARCHAR(45) NULL COMMENT 'Se obtiene de la fuente variable 1 que fue registrada dentro del submódulo de mediano plazo',
  `cve_usuario` VARCHAR(45) NOT NULL,
  `id_estructura` INT NOT NULL COMMENT 'Identificador del objetivo prioritario a relacionar con las metas para el bienestar, se relaciona con la tabla met_mp_estructura\n',
  `cs_estatus` VARCHAR(1) NULL,
  PRIMARY KEY (`id_metas_bienestar`),
  INDEX `fk_met_metas_bienestar_seg_usuario1_idx` (`cve_usuario` ASC) VISIBLE,
  INDEX `fk_met_metas_bienestar_met_mp_estructura1_idx` (`id_estructura` ASC) VISIBLE,
  CONSTRAINT `fk_met_metas_bienestar_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_metas_bienestar_met_mp_estructura1`
    FOREIGN KEY (`id_estructura`)
    REFERENCES `mejoreduDB`.`met_mp_estructura` (`id_estructura`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB