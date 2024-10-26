-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mejoreduDB
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mejoreduDB` ;

-- -----------------------------------------------------
-- Schema mejoreduDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mejoreduDB` DEFAULT CHARACTER SET utf8 ;
USE `mejoreduDB` ;

-- -----------------------------------------------------
-- Table `mejoreduDB`.`seg_tipo_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`seg_tipo_usuario` (
  `id_tipo_usuario` INT NOT NULL COMMENT 'Identificador de tipo de usuario',
  `cd_tipo_usuario` VARCHAR(45) NOT NULL COMMENT 'Descripción del tipo de usuario\n',
  `cs_estatus` VARCHAR(1) NOT NULL DEFAULT 'A' COMMENT 'Clave del estatus que guarda el registro de tipo de usuario\nI Inactivo\nA Activo\nB Bloqueado',
  `id_bitacora` INT NOT NULL COMMENT 'Identificador del registro con el fin de manejar la auditoria del dato y su historico de cambios, relacionada con la tabla bit_registro',
  `LOCK_FLAG` INT NULL,
  PRIMARY KEY (`id_tipo_usuario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`seg_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`seg_usuario` (
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT '\'Clave del usuario corresponde al userName del DA\'',
  `cs_estatus` VARCHAR(1) NOT NULL COMMENT 'Clave del estatus del usuario, relacionada con la tabla de seg_estatus',
  `df_baja` DATE NULL COMMENT 'Fecha de baja del usuario, nulo si es activo',
  `id_tipo_usuario` INT NOT NULL COMMENT 'Tipo de usuario, relacionado con la tabla de seg_tipo_usuario',
  `LOCK_FLAG` INT NULL,
  PRIMARY KEY (`cve_usuario`),
  CONSTRAINT `fk_seg_usuario_seg_tipo_usuario1`
    FOREIGN KEY (`id_tipo_usuario`)
    REFERENCES `mejoreduDB`.`seg_tipo_usuario` (`id_tipo_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_seg_usuario_tipo_usuario_idx` ON `mejoreduDB`.`seg_usuario` (`id_tipo_usuario` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_cortoPlazo_Proyectos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_cortoPlazo_Proyectos` (
  `idProyectos` INT(11) NOT NULL,
  `cx_Nombre_Unidad` VARCHAR(45) NULL DEFAULT NULL,
  `cve_Clave` INT(11) NULL DEFAULT NULL,
  `cx_Nombre_Proyecto` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Objetivo` VARCHAR(400) NULL DEFAULT NULL,
  `cx_objetivo_prioritario` VARCHAR(400) NULL,
  PRIMARY KEY (`idProyectos`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
COMMENT = '																				';


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_Presupuestal`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_Presupuestal` (
  `idSubmod_Presupuestal` INT(11) NOT NULL,
  `cx_Nombre_programa_presupuestal` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Ramo_sector` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Unidad_Responsable` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Finalidad` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Funcion` VARCHAR(45) NULL DEFAULT NULL,
  `cx_SubFuncion` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Actividad_Institucional` VARCHAR(45) NULL DEFAULT NULL,
  `df_Anhio_Registro` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Vinculacion_ODS` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Diagnóstico_presupuestario` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Acta_Aprobacion` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idSubmod_Presupuestal`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_Presupuestal_Diagnostico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_Presupuestal_Diagnostico` (
  `id` INT(11) NOT NULL,
  `cx_Antecedentes` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Definicion_Problema` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Estado_Problema` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Evolucion_problema` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Cobertura` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Identificacion_poblacion_potencial` VARCHAR(45) NULL DEFAULT NULL,
  `cx_identificacion_poblacion_objetivo` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Cuantificacion_poblacion_objetivo` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Frecuencia_actualizacion_potencial/objetivo` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Analisis_alternativas` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_cortoPlazo_Actividades`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_cortoPlazo_Actividades` (
  `idActividad` INT(11) NOT NULL,
  `cve_clave_Actividades` INT(11) NULL DEFAULT NULL,
  `cx_Nombre_actividad` VARCHAR(45) NULL DEFAULT NULL,
  `cx_descripcion` VARCHAR(400) NULL DEFAULT NULL,
  `cx_accion_Puntual` VARCHAR(45) NULL DEFAULT NULL,
  `cx_articulacion_actividades` VARCHAR(45) NULL DEFAULT NULL,
  `cx_accion_transversal` VARCHAR(45) NULL DEFAULT NULL,
  `cx_reuniones` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idActividad`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_cortoPlazo_Productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_cortoPlazo_Productos` (
  `idProductos` INT(11) NOT NULL,
  `cx_numero_Producto` VARCHAR(45) NULL DEFAULT NULL,
  `cve_clave` INT(11) NULL DEFAULT NULL,
  `cx_descripcion` VARCHAR(400) NULL DEFAULT NULL,
  `cx_categorizacion_Producto` VARCHAR(45) NULL DEFAULT NULL,
  `cs_Indicador` VARCHAR(45) NULL DEFAULT NULL,
  `cs_Indicador_Pl` VARCHAR(45) NULL DEFAULT NULL,
  `cx_nivel_Educativo` VARCHAR(45) CHARACTER SET 'cp1251' NULL DEFAULT NULL,
  `cx_vinculacion_Productos` VARCHAR(45) NULL DEFAULT NULL,
  `cx_continuidad_Productos` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Por_Publicar` VARCHAR(45) NULL DEFAULT NULL,
  `df_calendarizacion` DATE NULL DEFAULT NULL,
  `cx_Productos_Vinculados_POTIC` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idProductos`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_planeacion_mediano`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_planeacion_mediano` (
  `id` INT(11) NOT NULL,
  `cx_Titulo` VARCHAR(45) NULL DEFAULT NULL,
  `df_Fecha` DATE NULL DEFAULT NULL,
  `dh_Hora` TIME NULL DEFAULT NULL,
  `cx_Documento` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_presupuestal_ArbolObjetivos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_presupuestal_ArbolObjetivos` (
  `idSubmod_presupuestal_ArbolObjetivos` INT(11) NOT NULL,
  `cx_Fin` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Proposito` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Medio` VARCHAR(45) NULL DEFAULT NULL,
  `cd_Opcion_Actividad` VARCHAR(45) NULL DEFAULT NULL,
  `cd_Opcion_componente` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idSubmod_presupuestal_ArbolObjetivos`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_presupuestal_ArbolProblema`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_presupuestal_ArbolProblema` (
  `idArbolProblema` INT(11) NOT NULL,
  `cx_Causa` VARCHAR(400) NULL DEFAULT NULL,
  `cx_Efecto` VARCHAR(400) NULL DEFAULT NULL,
  PRIMARY KEY (`idArbolProblema`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_presupuestal_MIR_Ficha`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_presupuestal_MIR_Ficha` (
  `idSubmod_presupuestal_MIR/Ficha` INT(11) NOT NULL,
  `cx_Tipo_Nivel` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Nivel` VARCHAR(8) NULL DEFAULT NULL,
  `cx_Objetivo_ResumenNarrativo` VARCHAR(200) NULL DEFAULT NULL,
  `cx_Nombre_indicador` VARCHAR(200) NULL DEFAULT NULL,
  `cx_Supuestos` VARCHAR(350) NULL DEFAULT NULL,
  `cx_Medios_Verificacion` VARCHAR(510) NULL DEFAULT NULL,
  PRIMARY KEY (`idSubmod_presupuestal_MIR/Ficha`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_presupuestal_ProblemaPublico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_presupuestal_ProblemaPublico` (
  `idSubmod_presupuestal_ProblemaPublico` INT(11) NOT NULL,
  `cx_Poblacion_Area_afectada` VARCHAR(50) NULL DEFAULT NULL,
  `cx_Problematica_central` VARCHAR(120) NULL DEFAULT NULL,
  `cx_Magnitud_problema` VARCHAR(110) NULL DEFAULT NULL,
  `cx_Estrategia_Cobertura` VARCHAR(120) NULL DEFAULT NULL,
  PRIMARY KEY (`idSubmod_presupuestal_ProblemaPublico`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_Presupuestal_M001`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_Presupuestal_M001` (
  `idSubmod_Presupuestal_M001` INT(11) NOT NULL,
  `cx_Carga_Documento` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Diagnostico` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Ficha_Desempenhio_FID` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idSubmod_Presupuestal_M001`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_cortoPlazo_Formulacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_cortoPlazo_Formulacion` (
  `idSubmod_cortoPlazo_Formulacion` INT(11) NOT NULL,
  `cx_Nombre_unidad` VARCHAR(45) NULL DEFAULT NULL,
  `cve_Clave` INT(11) NULL DEFAULT NULL,
  `cx_Objetivo` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Fundamentacion` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Alcance` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Contribucion_objetivo_Pl` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Contribucion_programasEspecial_PND` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idSubmod_cortoPlazo_Formulacion`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_cortoPlazo_Metas_MIR_FID`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_cortoPlazo_Metas_MIR_FID` (
  `idMetas` INT(11) NOT NULL,
  PRIMARY KEY (`idMetas`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`submod_cortoPlazo_Presupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`submod_cortoPlazo_Presupuesto` (
  `idSubmod_cortoPlazo_Presupuesto` INT(11) NOT NULL,
  `cve_Clave` INT(11) NULL DEFAULT NULL,
  `cx_Nombre_Accion` VARCHAR(45) NULL DEFAULT NULL,
  `cve_Clave_nivel_educativo` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Centro_costos` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Partida_Gastos` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Presupuesto_anual` VARCHAR(45) NULL DEFAULT NULL,
  `df_Calendarizacion_gasto` VARCHAR(45) NULL DEFAULT NULL,
  `cx_Productos_Asociados` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idSubmod_cortoPlazo_Presupuesto`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`bit_registro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`bit_registro` (
  `id_registro` INT NOT NULL COMMENT 'Identificador el registro autoincrementable con el fin de manejar el historico de cambios de la información del sistema, tendremos tipo de registro, cambio, fecha y hora, y usuario',
  `df_registro` DATETIME NOT NULL COMMENT 'Fecha y hora del evento de registro',
  `cd_tabla_alterada` VARCHAR(45) NOT NULL,
  `cd_campos_alterados` VARCHAR(2000) NOT NULL,
  `cx_valoranteriorB64` VARCHAR(4000) NOT NULL,
  `cx_valornuevoB64` VARCHAR(4000) NOT NULL,
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que realiza el cambio',
  `LOCK_FLAG` INT NULL,
  PRIMARY KEY (`id_registro`),
  CONSTRAINT `fk_bit_registro_seg_usuario`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_bit_registro_seg_usuario_idx` ON `mejoreduDB`.`bit_registro` (`cve_usuario` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`seg_facultad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`seg_facultad` (
  `id_facultad` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la facultad, opción del sistema a considerar como asignable a un tipo de usuario(rol)\n',
  `cd_facultad` VARCHAR(45) NULL COMMENT 'Descripción de la facultad',
  `cs_status` VARCHAR(1) NULL COMMENT 'Estatus que guarda la facultad, podrá ser 1 activa, 0 Baja, 2 Bloqueda',
  `LOCK_FLAG` INT NULL,
  `ce_facultad` VARCHAR(45) NULL COMMENT 'Clave externa de la facultad, la cual será reconocida en el sistema y será la clave que debe retornar el servicio al ser un usuario valido en el arreglo de roles asociados al usuario',
  PRIMARY KEY (`id_facultad`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`seg_usuario_facultad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`seg_usuario_facultad` (
  `id_usu_fac` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la relación entre tabla de usuarios vs facultades',
  `id_registro` INT NOT NULL COMMENT 'Identificador de registro del evento, relacionada con tabla bit_registro',
  `id_facultad` INT NOT NULL,
  `id_tipo_usuario` INT NOT NULL COMMENT 'Identificador del tipo de usuario al que será asignada la facultad',
  `LOCK_FLAG` INT NULL,
  PRIMARY KEY (`id_usu_fac`, `id_facultad`, `id_tipo_usuario`),
  CONSTRAINT `fk_seg_usuario_facultad_seg_facultad1`
    FOREIGN KEY (`id_facultad`)
    REFERENCES `mejoreduDB`.`seg_facultad` (`id_facultad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_seg_usuario_facultad_seg_tipo_usuario1`
    FOREIGN KEY (`id_tipo_usuario`)
    REFERENCES `mejoreduDB`.`seg_tipo_usuario` (`id_tipo_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_seg_usuario_facultad_facultad_idx` ON `mejoreduDB`.`seg_usuario_facultad` (`id_facultad` ASC) VISIBLE;

CREATE INDEX `fk_seg_usuario_facultad_tipo_usuario_idx` ON `mejoreduDB`.`seg_usuario_facultad` (`id_tipo_usuario` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`seg_persona`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`seg_persona` (
  `id_persona` INT NOT NULL COMMENT 'Identificador de la persona que será registrada en el sistema',
  `cx_nombre` VARCHAR(120) NOT NULL COMMENT 'Nombre de la persona a registrar',
  `cx_primer_apellido` VARCHAR(120) NOT NULL COMMENT 'Primer apellido de la persona a registrar',
  `cx_segundo_apellido` VARCHAR(120) NULL COMMENT 'Segundo apellido de la persona a registrar',
  `df_fecha_nacimiento` DATE NOT NULL,
  `cx_correo` VARCHAR(120) NOT NULL COMMENT 'Cuenta de correo electrónico de la persona no puede ser repetido en el sistema',
  `LOCK_FLAG` INT NULL,
  PRIMARY KEY (`id_persona`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `cx_correo_UNIQUE` ON `mejoreduDB`.`seg_persona` (`cx_correo` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`seg_usuario_persona`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`seg_usuario_persona` (
  `cs_estatus` VARCHAR(1) NOT NULL COMMENT 'Clave del estatus que guarda el registro A Activo I Inactivo B Bloqueado',
  `id_persona` INT NOT NULL COMMENT 'Identificador de la persona, se relaciona con la tabla seg_persona',
  `cve_usuario` VARCHAR(45) NOT NULL,
  `id_usuario_persona` INT NOT NULL,
  `LOCK_FLAG` INT NULL,
  PRIMARY KEY (`id_usuario_persona`),
  CONSTRAINT `fk_seg_usuario_persona_seg_persona1`
    FOREIGN KEY (`id_persona`)
    REFERENCES `mejoreduDB`.`seg_persona` (`id_persona`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_seg_usuario_persona_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_seg_usuario_persona_idx` ON `mejoreduDB`.`seg_usuario_persona` (`id_persona` ASC) VISIBLE;

CREATE INDEX `fk_seg_usuario_persona_usuario_idx` ON `mejoreduDB`.`seg_usuario_persona` (`cve_usuario` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`seg_contrasenhia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`seg_contrasenhia` (
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave del usuario a registrar contraseña, se relaciona con la tabla de seg_usuario',
  `cx_palabra_secreta` VARCHAR(120) NOT NULL,
  `df_fecha` DATE NULL DEFAULT NULL,
  `cs_estatus` VARCHAR(1) NOT NULL COMMENT 'Clave del estatus que guarda la contraseña A = Activa, B = Bloqueada, I = Inactiva',
  `ix_numero_intentos` INT NOT NULL COMMENT 'Numero de intentos erroneos de acceso al sistema',
  `id_contra` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la contraseña del usuario',
  `LOCK_FLAG` INT NULL,
  PRIMARY KEY (`id_contra`),
  CONSTRAINT `fk_seg_contrasenhia_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`cat_master_catalogo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`cat_master_catalogo` (
  `id_catalogo` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la opción del catalogo',
  `cd_opcion` VARCHAR(500) NOT NULL COMMENT 'Descripción de la opción del catálogo por ejemplo un catalago de pais la descripción será México\n',
  `cc_externa` VARCHAR(45) NULL COMMENT 'Clave del catalogo como lo conoce negocio, por ejemplo pais opción mexico, la clave externa es MX',
  `df_baja` DATE NULL COMMENT 'Fecha de baja del registro, si existe info significa que no está activo el registro, si es nulo el registro está activo',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que afecta el registro se relaciona con la tabla seg_usuario',
  `id_catalogo_padre` INT NULL COMMENT 'Identificador del catalogo que permite conocer el catálogo padre',
  `cd_descripcionDos` VARCHAR(500) NULL COMMENT 'Descripción Dos de la opción del catalogo',
  `cc_externaDos` VARCHAR(45) NULL COMMENT 'Clave de la descripción dos del catalogo',
  `LOCK_FLAG` INT NULL COMMENT 'Identificador de control en transacciones concurrentes en contenedores',
  PRIMARY KEY (`id_catalogo`),
  CONSTRAINT `fk_cat_seg_usuario`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_cat_catalogo`
    FOREIGN KEY (`id_catalogo_padre`)
    REFERENCES `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_cat_seg_usuario_idx` ON `mejoreduDB`.`cat_master_catalogo` (`cve_usuario` ASC) VISIBLE;

CREATE INDEX `fk_cat_catalogo_idx` ON `mejoreduDB`.`cat_master_catalogo` (`id_catalogo_padre` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_anho_planeacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_anho_planeacion` (
  `id_anhio` INT NOT NULL COMMENT 'Identificador del año de planeación de entrada se cargan los 5 ultimos años y el vigente',
  `cs_estatus` VARCHAR(1) NOT NULL COMMENT 'Estatus que guarda el año, Activo y vigente = A, Inactivo = I',
  `df_baja` DATE NULL COMMENT 'Fecha de baja del año, no está activo para consultar',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que realiza el ajuste(ABCM) en años posibles de planeación',
  PRIMARY KEY (`id_anhio`),
  CONSTRAINT `fk_met_anho_planeacion_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE UNIQUE INDEX `id_anhio_UNIQUE` ON `mejoreduDB`.`met_anho_planeacion` (`id_anhio` ASC) VISIBLE;

CREATE INDEX `fk_met_anho_planeacion_seg_usuario1_idx` ON `mejoreduDB`.`met_anho_planeacion` (`cve_usuario` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_tipo_documento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_tipo_documento` (
  `id_tipo_documento` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador del documento, secuencial numérico y único',
  `cd_tipo_documento` VARCHAR(45) NOT NULL COMMENT 'Descripción del tipo de documento',
  `cx_extension` VARCHAR(45) NOT NULL COMMENT 'Extensión del archivo que puede ser PDF, Imagen (jpg, gif, png) , Video(mp4, mov)',
  `cx_tipo_contenido` VARCHAR(45) NULL COMMENT 'Descripción técnica del contenido del archivo por ejemplo',
  PRIMARY KEY (`id_tipo_documento`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_archivo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_archivo` (
  `id_archivo` INT NOT NULL,
  `cx_nombre` VARCHAR(45) NULL COMMENT 'Nombre del archivo sin extensión, debido que la extensión tiene su propio atributo',
  `cx_uuid` VARCHAR(45) NOT NULL COMMENT 'UUID del archivo registrado en el Gestor documental Alfresco',
  `id_tipo_documento` INT NOT NULL COMMENT 'Identificador del tipo de documento, atributo relacionado con la tabla met_tipo_documento',
  `id_anhio` INT NULL COMMENT 'Identificador del año de planeación asociado al archivo, referencia con la tabla met_anho_planeacion',
  `df_fecha_carga` DATE NOT NULL COMMENT 'Fecha del momento en que se carga el archivo',
  `dh_hora_carga` TIME NOT NULL COMMENT 'Hora de momento en que se carga el archivo',
  `cs_estatus` VARCHAR(1) NOT NULL COMMENT 'Clave de estatus que guarda el archivo A=Activo. B=Dado de baja',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que registra el archivo, referencia con la tabla seg_usuario',
  PRIMARY KEY (`id_archivo`, `cs_estatus`, `dh_hora_carga`, `df_fecha_carga`),
  CONSTRAINT `fk_met_archivo_met_tipo_documento1`
    FOREIGN KEY (`id_tipo_documento`)
    REFERENCES `mejoreduDB`.`met_tipo_documento` (`id_tipo_documento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_archivo_met_anho_planeacion1`
    FOREIGN KEY (`id_anhio`)
    REFERENCES `mejoreduDB`.`met_anho_planeacion` (`id_anhio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_archivo_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_archivo_met_tipo_documento1_idx` ON `mejoreduDB`.`met_archivo` (`id_tipo_documento` ASC) VISIBLE;

CREATE INDEX `fk_met_archivo_met_anho_planeacion1_idx` ON `mejoreduDB`.`met_archivo` (`id_anhio` ASC) VISIBLE;

CREATE INDEX `fk_met_archivo_seg_usuario1_idx` ON `mejoreduDB`.`met_archivo` (`cve_usuario` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_espacio_trabajo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_espacio_trabajo` (
  `id_espacio` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador del espacio de trabajo',
  `cd_espacio` LONGTEXT NOT NULL COMMENT 'Descripción extensa del espacio de trabajo',
  `df_registro` DATE NOT NULL COMMENT 'Fecha de registro del espacio de trabajo',
  `dh_registro` TIME NOT NULL COMMENT 'Hora de registro del espacio de trabajo',
  `cs_estatus` VARCHAR(1) NOT NULL COMMENT 'Clave del estatus que guarda el espacio de trabajo, A=Activo B=Dado de baja',
  `id_anhio` INT NOT NULL COMMENT 'Identificador del año del espacio de trabajo, referencia con la tabla met_anho_planeacion',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Identificador del usuario que registra el espacio de trabajo, referencia con la tabla seg_usuario',
  PRIMARY KEY (`id_espacio`),
  CONSTRAINT `fk_met_espacio_trabajo_met_anho_planeacion1`
    FOREIGN KEY (`id_anhio`)
    REFERENCES `mejoreduDB`.`met_anho_planeacion` (`id_anhio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_espacio_trabajo_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_espacio_trabajo_met_anho_planeacion1_idx` ON `mejoreduDB`.`met_espacio_trabajo` (`id_anhio` ASC) VISIBLE;

CREATE INDEX `fk_met_espacio_trabajo_seg_usuario1_idx` ON `mejoreduDB`.`met_espacio_trabajo` (`cve_usuario` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_formulario_analitico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_formulario_analitico` (
  `id_formulario` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador del formulario del documento analítico, secuencial numérico automático',
  `cx_nombre_unidad` VARCHAR(500) NULL,
  `cc_clave` VARCHAR(45) NULL COMMENT 'clave del formulario',
  `cx_objetivo` VARCHAR(45) NULL COMMENT 'objetivo del formulario',
  `cx_fundamentacion` VARCHAR(45) NULL COMMENT 'Fundamento del formulario',
  `cx_alcance` VARCHAR(45) NULL COMMENT 'Alcance del formulario',
  `cx_contribucion_pi` VARCHAR(45) NULL COMMENT 'Descripción de la contribución de prioritario de PI',
  `cx_contribucion_pnd` VARCHAR(45) NULL COMMENT 'Descripción de la contribución a programas especiales derivados del PND',
  `df_registro` VARCHAR(45) NULL COMMENT 'Fecha de registro del formulario',
  `dh_registro` VARCHAR(45) NULL COMMENT 'Hora de registro del formulario',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que registra el formulario, referencia con la tabla seg_usuario',
  PRIMARY KEY (`id_formulario`),
  CONSTRAINT `fk_met_formulario_analitico_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_formulario_analitico_seg_usuario1_idx` ON `mejoreduDB`.`met_formulario_analitico` (`cve_usuario` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_registro_estructura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_registro_estructura` (
  `idmet_registro_estructura` INT NOT NULL,
  PRIMARY KEY (`idmet_registro_estructura`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_apartado_Estructura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_apartado_Estructura` (
  `idmet_apartado_Estructura` INT NOT NULL,
  PRIMARY KEY (`idmet_apartado_Estructura`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_concepto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_concepto` (
  `idmet_concepto` INT NOT NULL,
  PRIMARY KEY (`idmet_concepto`))
ENGINE = InnoDB;

USE `mejoreduDB` ;

-- -----------------------------------------------------
-- Placeholder table for view `mejoreduDB`.`vt_autenticador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`vt_autenticador` (`id_contra` INT, `cve_usuario` INT, `cx_palabra_secreta` INT, `cs_estatus` INT, `cx_nombre` INT, `cx_primer_apellido` INT, `cx_segundo_apellido` INT, `cx_correo` INT);

-- -----------------------------------------------------
-- Placeholder table for view `mejoreduDB`.`vt_anhio_vigente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`vt_anhio_vigente` (`id_anhio` INT, `fecha` INT, `hora` INT);

-- -----------------------------------------------------
-- Placeholder table for view `mejoreduDB`.`vt_roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`vt_roles` (`id_tipo_usuario` INT, `cd_tipo_usuario` INT, `ce_facultad` INT);

-- -----------------------------------------------------
-- View `mejoreduDB`.`vt_autenticador`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mejoreduDB`.`vt_autenticador`;
USE `mejoreduDB`;
CREATE  OR REPLACE VIEW `vt_autenticador` AS
select sc.id_contra, su.cve_usuario, sc.cx_palabra_secreta, su.cs_estatus, sp.cx_nombre, sp.cx_primer_apellido, sp.cx_segundo_apellido, sp.cx_correo
from seg_usuario su, seg_contrasenhia sc, seg_usuario_persona sup, seg_persona sp
where su.cve_usuario = sc.cve_usuario 
and su.cs_estatus = 'A'
and su.cve_usuario = sup.cve_usuario and sup.id_persona =sp.id_persona;

-- -----------------------------------------------------
-- View `mejoreduDB`.`vt_anhio_vigente`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mejoreduDB`.`vt_anhio_vigente`;
USE `mejoreduDB`;
CREATE  OR REPLACE VIEW `vt_anhio_vigente` AS
select id_anhio, current_date() fecha, current_time() hora from met_anho_planeacion where cs_estatus = 'A';

-- -----------------------------------------------------
-- View `mejoreduDB`.`vt_roles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mejoreduDB`.`vt_roles`;
USE `mejoreduDB`;
CREATE  OR REPLACE VIEW `vt_roles` AS
select stu.id_tipo_usuario, stu.cd_tipo_usuario ,sf.ce_facultad
from  seg_tipo_usuario stu, seg_usuario_facultad suf, seg_facultad sf
where  
stu.id_tipo_usuario = suf.id_tipo_usuario  and suf.id_facultad = sf.id_facultad 
and stu.cs_estatus = 'A' and sf.cs_status = 'A';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`seg_tipo_usuario`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`seg_tipo_usuario` (`id_tipo_usuario`, `cd_tipo_usuario`, `cs_estatus`, `id_bitacora`, `LOCK_FLAG`) VALUES (1, 'Super usuario', 'A', -1, NULL);
INSERT INTO `mejoreduDB`.`seg_tipo_usuario` (`id_tipo_usuario`, `cd_tipo_usuario`, `cs_estatus`, `id_bitacora`, `LOCK_FLAG`) VALUES (2, 'Administrador', 'A', -1, NULL);
INSERT INTO `mejoreduDB`.`seg_tipo_usuario` (`id_tipo_usuario`, `cd_tipo_usuario`, `cs_estatus`, `id_bitacora`, `LOCK_FLAG`) VALUES (3, 'Consultor', 'A', -1, NULL);
INSERT INTO `mejoreduDB`.`seg_tipo_usuario` (`id_tipo_usuario`, `cd_tipo_usuario`, `cs_estatus`, `id_bitacora`, `LOCK_FLAG`) VALUES (4, 'Enlace', 'A', -1, NULL);
INSERT INTO `mejoreduDB`.`seg_tipo_usuario` (`id_tipo_usuario`, `cd_tipo_usuario`, `cs_estatus`, `id_bitacora`, `LOCK_FLAG`) VALUES (5, 'Supervisor', 'A', -1, NULL);
INSERT INTO `mejoreduDB`.`seg_tipo_usuario` (`id_tipo_usuario`, `cd_tipo_usuario`, `cs_estatus`, `id_bitacora`, `LOCK_FLAG`) VALUES (6, 'Planeacion', 'A', -1, NULL);
INSERT INTO `mejoreduDB`.`seg_tipo_usuario` (`id_tipo_usuario`, `cd_tipo_usuario`, `cs_estatus`, `id_bitacora`, `LOCK_FLAG`) VALUES (7, 'Presupuesto', 'A', -1, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`seg_usuario`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`seg_usuario` (`cve_usuario`, `cs_estatus`, `df_baja`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES ('superusuario', 'A', NULL, 1, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`seg_facultad`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`seg_facultad` (`id_facultad`, `cd_facultad`, `cs_status`, `LOCK_FLAG`, `ce_facultad`) VALUES (1, 'Herramienta de configuración', 'A', NULL, 'ROL_CONFIG');
INSERT INTO `mejoreduDB`.`seg_facultad` (`id_facultad`, `cd_facultad`, `cs_status`, `LOCK_FLAG`, `ce_facultad`) VALUES (2, 'Módulo de planeación', 'A', NULL, 'ROL_MOD_PLANEACION');
INSERT INTO `mejoreduDB`.`seg_facultad` (`id_facultad`, `cd_facultad`, `cs_status`, `LOCK_FLAG`, `ce_facultad`) VALUES (3, 'Módulo de Seguimiento', 'A', NULL, 'ROL_MOD_SEGUIMIENTO');
INSERT INTO `mejoreduDB`.`seg_facultad` (`id_facultad`, `cd_facultad`, `cs_status`, `LOCK_FLAG`, `ce_facultad`) VALUES (4, 'Módulo de Evaluación', 'A', NULL, 'ROL_MOD_EVALUACION');
INSERT INTO `mejoreduDB`.`seg_facultad` (`id_facultad`, `cd_facultad`, `cs_status`, `LOCK_FLAG`, `ce_facultad`) VALUES (5, 'Módulo de Reportes', 'A', NULL, 'ROL_MOD_REPORTES');

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`seg_usuario_facultad`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (1, -1, 1, 1, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (2, -1, 2, 1, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (3, -1, 3, 1, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (4, -1, 4, 1, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (5, -1, 5, 1, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (6, -1, 1, 2, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (7, -1, 2, 2, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (8, -1, 3, 2, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (9, -1, 4, 2, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (10, -1, 5, 2, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (11, -1, 2, 3, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (12, -1, 3, 3, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (13, -1, 5, 3, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (14, -1, 2, 4, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (15, -1, 3, 4, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (16, -1, 5, 4, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (17, -1, 2, 5, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (18, -1, 3, 5, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (19, -1, 4, 5, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (20, -1, 5, 5, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (21, -1, 1, 6, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (22, -1, 2, 6, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (23, -1, 3, 6, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (24, -1, 4, 6, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (25, -1, 5, 6, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (26, -1, 2, 7, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (27, -1, 3, 7, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_facultad` (`id_usu_fac`, `id_registro`, `id_facultad`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES (28, -1, 5, 7, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`seg_persona`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`seg_persona` (`id_persona`, `cx_nombre`, `cx_primer_apellido`, `cx_segundo_apellido`, `df_fecha_nacimiento`, `cx_correo`, `LOCK_FLAG`) VALUES (1, 'superusuario', 'superusuario', 'superusuario', '1976-01-24', 'superusuario@mejoredu.mx', NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`seg_usuario_persona`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`seg_usuario_persona` (`cs_estatus`, `id_persona`, `cve_usuario`, `id_usuario_persona`, `LOCK_FLAG`) VALUES ('A', 1, 'superusuario', 1, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`seg_contrasenhia`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`seg_contrasenhia` (`cve_usuario`, `cx_palabra_secreta`, `df_fecha`, `cs_estatus`, `ix_numero_intentos`, `id_contra`, `LOCK_FLAG`) VALUES ('superusuario', 'superusuario', NULL, '1', 0, 1, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`cat_master_catalogo`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Catalogo Articulacion Actividad', '1', NULL, 'superusuario', Null, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Elaborar sugerencias de elementos que contribuyan a la mejora de la educación inicial, para fortalecer el enfoque de educación inclusiva', '110', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Elaborar sugerencias de elementos que contribuyan a la mejora de los planes y programas de estudio de EMS, para fortalecer el enfoque de educación inclusiva', '120', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Elaborar sugerencias de elementos que contribuyan a la mejora de los planes y programas de estudio de educación básica para favorecer la atención de las personas, pueblos y comunidades indígenas desde un enfoque de educación inclusiva', '130', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Elaborar lineamientos para la mejora de las escuelas de educación básica', '140', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Elaborar lineamientos para la mejora de los planteles escolares de educación media superior', '150', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Elaborar sugerencias de elementos que contribuyan a la mejora de los planes y programas de estudio de EB, para fortalecer el enfoque de educación inclusiva', '160', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Gestionar la difusión en medios institucionales', '170', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Diseñar materiales para la difusión de productos institucionales', '180', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Coordinar el funcionamiento del Comité Editorial de la Comisión', '190', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Gestionar el programa editorial anual ', '200', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Gestionar el Centro de Documentación', '210', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Elaborar un repositorio digital de materiales educativos en educación básica y media superior', '220', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Elaborar estrategias de apoyo pedagógico para Educación Media Superior', '230', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Implementar la estrategia para la definición de indicadores educativos clave', '240', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Determinar indicadores para el seguimiento de los avances del Sistema Educativo Nacional', '250', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Realizar análisis estadísticos por temas prioritarios ', '260', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Desarrollar el proyecto gobierno y administración de datos en apoyo a los procesos de segumiento a la mejora continua de la educación', '270', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Coordinar la gestión interna', '280', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Desarrollar herramientas de apoyo para el seguimiento de la mejora continua de la educación', '290', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'No aplica', '300', NULL, 'superusuario', 1, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Catálogo de Tipo de Producto', '2', NULL, 'superusuario', Null, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Intermedio', '110', NULL, 'superusuario', 22, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Final', '120', NULL, 'superusuario', 22, NULL, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`, `LOCK_FLAG`) VALUES (DEFAULT, 'Periódico', '130', NULL, 'superusuario', 22, NULL, NULL, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`met_anho_planeacion`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`met_anho_planeacion` (`id_anhio`, `cs_estatus`, `df_baja`, `cve_usuario`) VALUES (2023, 'A', NULL, 'superusuario');
INSERT INTO `mejoreduDB`.`met_anho_planeacion` (`id_anhio`, `cs_estatus`, `df_baja`, `cve_usuario`) VALUES (2022, 'I', '2023/01/01', 'superusuario');
INSERT INTO `mejoreduDB`.`met_anho_planeacion` (`id_anhio`, `cs_estatus`, `df_baja`, `cve_usuario`) VALUES (2021, 'I', '2023/01/01', 'superusuario');
INSERT INTO `mejoreduDB`.`met_anho_planeacion` (`id_anhio`, `cs_estatus`, `df_baja`, `cve_usuario`) VALUES (2020, 'I', '2023/01/01', 'superusuario');
INSERT INTO `mejoreduDB`.`met_anho_planeacion` (`id_anhio`, `cs_estatus`, `df_baja`, `cve_usuario`) VALUES (2019, 'I', '2023/01/01', 'superusuario');
INSERT INTO `mejoreduDB`.`met_anho_planeacion` (`id_anhio`, `cs_estatus`, `df_baja`, `cve_usuario`) VALUES (2018, 'I', '2023/01/01', 'superusuario');

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`met_tipo_documento`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`met_tipo_documento` (`id_tipo_documento`, `cd_tipo_documento`, `cx_extension`, `cx_tipo_contenido`) VALUES (1, 'pdf', 'pdf', 'application/pdf');
INSERT INTO `mejoreduDB`.`met_tipo_documento` (`id_tipo_documento`, `cd_tipo_documento`, `cx_extension`, `cx_tipo_contenido`) VALUES (2, 'jpg', 'jpg', 'image/jpeg');
INSERT INTO `mejoreduDB`.`met_tipo_documento` (`id_tipo_documento`, `cd_tipo_documento`, `cx_extension`, `cx_tipo_contenido`) VALUES (3, 'png', 'png', 'image/png');
INSERT INTO `mejoreduDB`.`met_tipo_documento` (`id_tipo_documento`, `cd_tipo_documento`, `cx_extension`, `cx_tipo_contenido`) VALUES (4, 'gif', 'gif', 'image/gif');

COMMIT;

