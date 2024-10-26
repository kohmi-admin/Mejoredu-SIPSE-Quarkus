ALTER TABLE `mejoreduDB`.`met_mp_elemento` 
ADD COLUMN `id_catalogo_objetivo` INT NULL COMMENT 'Identificador del objetivo prioritario asociado al elemento(meta), relacionado con la tabla de cat_master_catalogo' AFTER `LOCK_FLAG`,
ADD INDEX `fk_met_mp_elemento_cat_master_catalogo1_idx` (`id_catalogo_objetivo` ASC) VISIBLE;
;
ALTER TABLE `mejoreduDB`.`met_mp_elemento` 
ADD CONSTRAINT `fk_met_mp_elemento_cat_master_catalogo1`
  FOREIGN KEY (`id_catalogo_objetivo`)
  REFERENCES `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;