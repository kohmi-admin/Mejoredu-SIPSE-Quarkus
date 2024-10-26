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
-- Table `mejoreduDB`.`seg_perfil_laboral`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`seg_perfil_laboral` (
  `id_perfil_laboral` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador numerico autoincrementable del perfil del usuario, podrá manejar perfil historico.',
  `ci_numero_empleado` INT(11) NULL DEFAULT NULL COMMENT 'Numero de empleado valor numerico.',
  `cx_puesto` VARCHAR(120) NULL DEFAULT NULL COMMENT 'Descripción del puesto al que pertenece el usuario',
  `cx_telefono_oficina` VARCHAR(45) NULL DEFAULT NULL COMMENT 'Cadena que permite registrar el número de teléfono del usuario',
  `cx_extension` VARCHAR(45) NULL DEFAULT NULL COMMENT 'Cadena que permite registrar el número de la extensión telefónica del usuario',
  `cx_dg_administacion` VARCHAR(45) NULL DEFAULT NULL COMMENT 'Descripción de la dirección general a la que pertenece el usuario',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que será asociado a la información del laboral del usuario',
  `id_catalogo_area` INT(11) NOT NULL COMMENT 'Identificador del catálogo de área (Unidad responsable), relacionada con la tabla cat_master_catalogo',
  `cs_status` VARCHAR(1) NULL DEFAULT NULL COMMENT 'Estatus del registro de la información laboral, A activo B Baja',
  PRIMARY KEY (`id_perfil_laboral`),
  CONSTRAINT `fk_seg_perfil_laboral_cat_master_catalogo1`
    FOREIGN KEY (`id_catalogo_area`)
    REFERENCES `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`),
  CONSTRAINT `fk_seg_perfil_laboral_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE INDEX `fk_seg_perfil_laboral_seg_usuario1_idx` ON `mejoreduDB`.`seg_perfil_laboral` (`cve_usuario` ASC) VISIBLE;

CREATE INDEX `fk_seg_perfil_laboral_cat_master_catalogo1_idx` ON `mejoreduDB`.`seg_perfil_laboral` (`id_catalogo_area` ASC) VISIBLE;


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
  `df_fecha_carga` DATE NOT NULL COMMENT 'Fecha del momento en que se carga el archivo',
  `dh_hora_carga` TIME NOT NULL COMMENT 'Hora de momento en que se carga el archivo',
  `cs_estatus` VARCHAR(1) NOT NULL COMMENT 'Clave de estatus que guarda el archivo A=Activo. B=Dado de baja',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que registra el archivo, referencia con la tabla seg_usuario',
  PRIMARY KEY (`id_archivo`),
  CONSTRAINT `fk_met_archivo_met_tipo_documento1`
    FOREIGN KEY (`id_tipo_documento`)
    REFERENCES `mejoreduDB`.`met_tipo_documento` (`id_tipo_documento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_archivo_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_archivo_met_tipo_documento1_idx` ON `mejoreduDB`.`met_archivo` (`id_tipo_documento` ASC) VISIBLE;

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
  `cx_nombre_unidad` VARCHAR(90) NULL,
  `cc_clave` VARCHAR(10) NULL COMMENT 'clave del formulario',
  `cx_nombre_proyecto` VARCHAR(90) NULL,
  `cx_objetivo` VARCHAR(80) NULL COMMENT 'objetivo del formulario',
  `cx_fundamentacion` VARCHAR(200) NULL COMMENT 'Fundamento del formulario',
  `cx_alcance` VARCHAR(200) NULL COMMENT 'Alcance del formulario',
  `cx_contribucion_pi` VARCHAR(200) NULL COMMENT 'Descripción de la contribución de prioritario de PI',
  `cx_contribucion_pnd` VARCHAR(100) NULL COMMENT 'Descripción de la contribución a programas especiales derivados del PND',
  `df_registro` VARCHAR(45) NULL COMMENT 'Fecha de registro del formulario',
  `dh_registro` VARCHAR(45) NULL COMMENT 'Hora de registro del formulario',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que registra el formulario, referencia con la tabla seg_usuario',
  `id_anhio` INT NOT NULL COMMENT 'año de planeacion al cual sera registrado el formulario analitico, relacionanda con la tabla met_anho_planeacion',
  PRIMARY KEY (`id_formulario`),
  CONSTRAINT `fk_met_formulario_analitico_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_formulario_analitico_met_anho_planeacion1`
    FOREIGN KEY (`id_anhio`)
    REFERENCES `mejoreduDB`.`met_anho_planeacion` (`id_anhio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_formulario_analitico_seg_usuario1_idx` ON `mejoreduDB`.`met_formulario_analitico` (`cve_usuario` ASC) VISIBLE;

CREATE INDEX `fk_met_formulario_analitico_met_anho_planeacion1_idx` ON `mejoreduDB`.`met_formulario_analitico` (`id_anhio` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_registro_estructura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_registro_estructura` (
  `met_anho_planeacion_id_anhio` INT NOT NULL,
  CONSTRAINT `fk_met_registro_estructura_met_anho_planeacion1`
    FOREIGN KEY (`met_anho_planeacion_id_anhio`)
    REFERENCES `mejoreduDB`.`met_anho_planeacion` (`id_anhio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_registro_estructura_met_anho_planeacion1_idx` ON `mejoreduDB`.`met_registro_estructura` (`met_anho_planeacion_id_anhio` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_apartado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_apartado` (
  `id_apartado` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador del apartado de la estructura de registro de planeación',
  `cd_apartado` VARCHAR(120) NOT NULL COMMENT 'Descripción del apartado de la estructura de registro de planeación. por ejemplo Principal, problemas públicos',
  `cs_estatus` VARCHAR(1) NOT NULL COMMENT 'Clave de estatus de apartado A=Activo B=Baja',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave de usuario que registra información, referncia con la tabla seg_usuario',
  PRIMARY KEY (`id_apartado`),
  CONSTRAINT `fk_met_apartado_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_apartado_seg_usuario1_idx` ON `mejoreduDB`.`met_apartado` (`cve_usuario` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_apartado_estructura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_apartado_estructura` (
  `id_estructura_apartado` INT NOT NULL AUTO_INCREMENT COMMENT 'Indentificador de registro de la estructura por año',
  `df_registro` DATE NULL COMMENT 'Fecha de registro de la estructura por año',
  `dh_registro` TIME NULL COMMENT 'Hora de registro del año apartado registro',
  `id_anhio` INT NOT NULL COMMENT 'Identificador del año de planeación, referencia a la tabla met_anho_planeacion',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que registra la estructura en el año, referencia con la tabla seg_usuario',
  PRIMARY KEY (`id_estructura_apartado`),
  CONSTRAINT `fk_met_apartado_estructura_met_anho_planeacion1`
    FOREIGN KEY (`id_anhio`)
    REFERENCES `mejoreduDB`.`met_anho_planeacion` (`id_anhio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_apartado_estructura_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_apartado_estructura_met_anho_planeacion1_idx` ON `mejoreduDB`.`met_apartado_estructura` (`id_anhio` ASC) VISIBLE;

CREATE INDEX `fk_met_apartado_estructura_seg_usuario1_idx` ON `mejoreduDB`.`met_apartado_estructura` (`cve_usuario` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_concepto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_concepto` (
  `id_concepto` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador del concepto utilizado en la estructura de registro Planeación mediano plazo',
  `cd_concepto` VARCHAR(120) NOT NULL COMMENT 'Concepto utilizado en la estructura de registro Planeación mediano plazo por ejemplo Nombre del programa, Alineación, Análisis de estado actual, etc',
  `ic_tipo_dato` INT NOT NULL COMMENT 'Tipo de dato a capturar 1=Texto 1 liena, 2= Texto 3=Multilinea, 4=Numérico, 5=Fecha',
  `cs_estatus` VARCHAR(1) NOT NULL,
  `ix_requerido` INT NULL COMMENT 'Indicador numerico del concepto para conocer si es requerido 1=Requerido 0=No requerido',
  PRIMARY KEY (`id_concepto`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_pmp_apartado_concepto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_pmp_apartado_concepto` (
  `id_apartadoconcepto` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador del apartado concepto utilizado en la estructura de registro Planeación mediano plazo',
  `ic_nivel` INT NOT NULL COMMENT 'Identificador del nivel de captura de información por ejemplo Nombre del programa es nivel 1 y en programas públicos Registro y acciones, sería nivel 2. Máximo se limita a 2 por el aplicativo',
  `id_apartado` INT NOT NULL COMMENT 'Identificador del apartado a relacionar con el concepto, referencia con la tabla met_apartado',
  `id_concepto` INT NOT NULL COMMENT 'Identificador del concepto utilizado en la estructura de registro Planeación mediano plazo, referencia con la tabla met_concepto',
  `cs_estatus` VARCHAR(1) NULL COMMENT 'Clave del estatus que guarda el valor capturado A=Activo B= Baja',
  PRIMARY KEY (`id_apartadoconcepto`),
  CONSTRAINT `fk_met_pmp_apartado_concepto_met_concepto1`
    FOREIGN KEY (`id_concepto`)
    REFERENCES `mejoreduDB`.`met_concepto` (`id_concepto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_pmp_apartado_concepto_met_apartado1`
    FOREIGN KEY (`id_apartado`)
    REFERENCES `mejoreduDB`.`met_apartado` (`id_apartado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_pmp_apartado_concepto_met_concepto1_idx` ON `mejoreduDB`.`met_pmp_apartado_concepto` (`id_concepto` ASC) VISIBLE;

CREATE INDEX `fk_met_pmp_apartado_concepto_met_apartado1_idx` ON `mejoreduDB`.`met_pmp_apartado_concepto` (`id_apartado` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_pmp_apartado_valor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_pmp_apartado_valor` (
  `id_apartado_valor` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador del apartado valor',
  `cx_valor` LONGTEXT NULL COMMENT 'Valor capturado por el usuario en el apartado concepto',
  `df_registro` DATE NULL COMMENT 'Fecha de registro del valor por apartado y concepto',
  `dh_registro` TIME NULL COMMENT 'Hora de registro de la información en el apartado concepto',
  `cs_estatus` VARCHAR(1) NULL COMMENT 'Clave del estatus que guarda el valor capturado A=Activo B= Baja',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que registra la estructura en el año, referencia con la tabla seg_usuario',
  `ic_apartadoconcepto` INT NOT NULL COMMENT 'Identificador del apartado concepto que registra información, referencia con la tabla met_pmp_apartado_concepto',
  `met_apartado_estructura_id_estructura_apartado` INT NOT NULL,
  PRIMARY KEY (`id_apartado_valor`),
  CONSTRAINT `fk_met_pmp_apartado_valor_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_pmp_apartado_valor_met_pmp_apartado_concepto1`
    FOREIGN KEY (`ic_apartadoconcepto`)
    REFERENCES `mejoreduDB`.`met_pmp_apartado_concepto` (`id_apartadoconcepto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_pmp_apartado_valor_met_apartado_estructura1`
    FOREIGN KEY (`met_apartado_estructura_id_estructura_apartado`)
    REFERENCES `mejoreduDB`.`met_apartado_estructura` (`id_estructura_apartado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_pmp_apartado_valor_seg_usuario1_idx` ON `mejoreduDB`.`met_pmp_apartado_valor` (`cve_usuario` ASC) VISIBLE;

CREATE INDEX `fk_met_pmp_apartado_valor_met_pmp_apartado_concepto1_idx` ON `mejoreduDB`.`met_pmp_apartado_valor` (`ic_apartadoconcepto` ASC) VISIBLE;

CREATE INDEX `fk_met_pmp_apartado_valor_met_apartado_estructura1_idx` ON `mejoreduDB`.`met_pmp_apartado_valor` (`met_apartado_estructura_id_estructura_apartado` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_datosgeneral`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_datosgeneral` (
  `id_datosgenerales` INT NOT NULL COMMENT 'Identificador del resgistro de datos generales de la tabla met_presupuestal_datosgenerales',
  `cx_nombre_programa` VARCHAR(50) NOT NULL COMMENT 'Campo que almacena nombre del programa presupuestal',
  `cb_ramo_sector` VARCHAR(50) NOT NULL COMMENT 'Campo que enlista el nombre del ramo y/o sector del plan presupuestal',
  `cb_unidad_responsable` VARCHAR(45) NOT NULL COMMENT 'Campo que enlista la undad responsaple del planificacion presupuestal',
  `cx_finalidad` VARCHAR(200) NOT NULL COMMENT 'Campo que almacena la fina lidad del plan ',
  `cx_funcion` VARCHAR(50) NOT NULL COMMENT 'Campo que almacena la funcion del plan',
  `cx_subfuncion` VARCHAR(50) NOT NULL COMMENT 'Campo que almacena la subfuncion del plan presupuestal',
  `cx_actividad_institucional` VARCHAR(50) NOT NULL COMMENT 'Campo que almacena la actividad institucional',
  `df_anhio_registro` DATE NOT NULL COMMENT 'Campo que almacena el año de registro',
  `dh_hora_registro` TIME NOT NULL COMMENT 'Campo que almacena la hora que se realizo el registro',
  `cb_vinculacion_ODS` VARCHAR(45) NOT NULL COMMENT 'Campo que enlista la vinculacion ODS asociada al plan presupuetal',
  PRIMARY KEY (`id_datosgenerales`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_problemapublico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_problemapublico` (
  `id_problema` INT NOT NULL COMMENT 'Identificador del problema publico en la tabla met_presupuestal_problemapublico',
  `cx_poblacion_area_afectada` VARCHAR(50) NOT NULL COMMENT 'Campo que almacena la poblacion o area afectada del problema',
  `cx_problematica_central` VARCHAR(120) NOT NULL COMMENT 'Campo que almacena la problematica central',
  `cx_magnitud_problema` VARCHAR(110) NOT NULL COMMENT 'Campo que almacena la magnitud del problema',
  `cx_estrategia_cobertura` VARCHAR(120) NOT NULL COMMENT 'Campo que almacena la estrategia de cobertura del problema',
  PRIMARY KEY (`id_problema`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_diagnostico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_diagnostico` (
  `id_diagnostico` INT NOT NULL COMMENT 'Identificador del registro de diagnostico de la tabla met_diagnostico',
  `cx_antecedentes` LONGTEXT NOT NULL COMMENT 'Campo que almacena los antecedentes',
  `cx_definicion_problema` VARCHAR(300) NOT NULL COMMENT 'Campo que almacena la definicion del problema',
  `cx_estado_problema` LONGTEXT NOT NULL COMMENT 'Campo que almacena el estado del problema',
  `cx_evolucion_problema` LONGTEXT NOT NULL COMMENT 'Campo que almacena la evolucion del problema',
  `cx_cobertura` LONGTEXT NOT NULL COMMENT 'Campo que almacena la cobertura que tiene el problema',
  `cx_identificacion_poblacion_potencial` LONGTEXT NOT NULL COMMENT 'Campo que almacena la identificacion de poblacion potencial del problema',
  `cx_identificacion_poblacion_objetivo` LONGTEXT NOT NULL COMMENT 'Campo que almacena la identificacion de poblacion objetivo',
  `cx_cuantificacion_poblacion_objetivo` LONGTEXT NOT NULL COMMENT 'Campo que almacena la cuantificacion de problema de poblacion objetivo',
  `cx_frecuencia_actualizacion_potencialobjetivo` VARCHAR(80) NOT NULL COMMENT 'Campo que almacena la frecuencia de actualizacion potencial u objetivo',
  `cx_analisis_alternativas` LONGTEXT NOT NULL COMMENT 'Campo que almacena un analisis de alternativas del diagnostico del problema',
  `met_problemapublico_id_problema` INT NOT NULL,
  PRIMARY KEY (`id_diagnostico`),
  CONSTRAINT `fk_met_diagnostico_met_problemapublico1`
    FOREIGN KEY (`met_problemapublico_id_problema`)
    REFERENCES `mejoreduDB`.`met_problemapublico` (`id_problema`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE INDEX `fk_met_diagnostico_met_problemapublico1_idx` ON `mejoreduDB`.`met_diagnostico` (`met_problemapublico_id_problema` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_M001`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_M001` (
  `id_M001` INT NOT NULL COMMENT 'identificador de acceco al la planeacion presupuestal M001',
  `cx_nombre_documento` VARCHAR(45) NOT NULL COMMENT 'Campo que almacena el nombre del documento que se presentara en la tabla del plan presupuestal M001',
  `df_fecha_carga` DATE NOT NULL COMMENT 'Campo que almacena la fecha de carga del Documento',
  `cs_carga_documento` VARCHAR(45) NOT NULL COMMENT 'Campo que almacena el estatus del documento',
  `cx_diagnostico` VARCHAR(45) NOT NULL COMMENT 'Campo que almacena el diagnostico',
  `cx_Ficha_Desempenhio_fid` VARCHAR(45) NOT NULL COMMENT 'Campo que almacena la ficha de desempeño FID generada',
  PRIMARY KEY (`id_M001`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_cortoplazo_proyecto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_cortoplazo_proyecto` (
  `id_proyecto` INT NOT NULL COMMENT 'identificador de un proyecto de la tabla met_cortoplazo_proyecto',
  `cve_proyecto` INT(4) NOT NULL COMMENT 'campo que almacena la clave asociada a un proyecto',
  `cx_nombre_proyecto` VARCHAR(90) NOT NULL COMMENT 'campo que almacena el nombre del proyecto',
  `cx_objetivo` VARCHAR(100) NOT NULL COMMENT 'campo que almacena el objetivo de un proyecto',
  `cx_objetivo_prioritario` VARCHAR(300) NOT NULL COMMENT 'campo que almacena el objetivo prioritario del proyecto',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que registra el proyecto en el año indicado, referencia con la tabla seg_usuario',
  `id_anhio` INT NOT NULL COMMENT 'Identificador del año en que será registrado el proyecto, refencia con la tabla met_anho_planeacion',
  `df_proyecto` DATE NULL COMMENT 'Fecha en que se registra el proyecto',
  `dh_proyecto` TIME NULL COMMENT 'Hora en que se registra el proyecto',
  `cs_estatus` VARCHAR(1) NULL COMMENT 'Estatus del proyecto A = Activo, B = Dado de baja ',
  `id_catalogo_contribucionObjPrio` INT NOT NULL COMMENT 'Temporal para persistir el dato de contriibuciones',
  `id_catalogo_contriProgEsp` INT NOT NULL COMMENT 'Temporal para persistir el dato de programas especiales',
  `id_catalogo_PNCCIMGP` INT NOT NULL COMMENT 'Temporal para guardar el dato de contribución PNCCIMGP',
  `met_archivo_id_archivo` INT NOT NULL,
  PRIMARY KEY (`id_proyecto`),
  CONSTRAINT `fk_met_cortoplazo_proyecto_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_cortoplazo_proyecto_met_anho_planeacion1`
    FOREIGN KEY (`id_anhio`)
    REFERENCES `mejoreduDB`.`met_anho_planeacion` (`id_anhio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_cortoplazo_proyecto_cat_master_catalogo1`
    FOREIGN KEY (`id_catalogo_contribucionObjPrio`)
    REFERENCES `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_cortoplazo_proyecto_cat_master_catalogo2`
    FOREIGN KEY (`id_catalogo_contriProgEsp`)
    REFERENCES `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_cortoplazo_proyecto_cat_master_catalogo3`
    FOREIGN KEY (`id_catalogo_PNCCIMGP`)
    REFERENCES `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_cortoplazo_proyecto_met_archivo1`
    FOREIGN KEY (`met_archivo_id_archivo`)
    REFERENCES `mejoreduDB`.`met_archivo` (`id_archivo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
COMMENT = '																				';

CREATE INDEX `fk_met_cortoplazo_proyecto_seg_usuario1_idx` ON `mejoreduDB`.`met_cortoplazo_proyecto` (`cve_usuario` ASC) VISIBLE;

CREATE INDEX `fk_met_cortoplazo_proyecto_met_anho_planeacion1_idx` ON `mejoreduDB`.`met_cortoplazo_proyecto` (`id_anhio` ASC) VISIBLE;

CREATE INDEX `fk_met_cortoplazo_proyecto_cat_master_catalogo1_idx` ON `mejoreduDB`.`met_cortoplazo_proyecto` (`id_catalogo_contribucionObjPrio` ASC) VISIBLE;

CREATE INDEX `fk_met_cortoplazo_proyecto_cat_master_catalogo2_idx` ON `mejoreduDB`.`met_cortoplazo_proyecto` (`id_catalogo_contriProgEsp` ASC) VISIBLE;

CREATE INDEX `fk_met_cortoplazo_proyecto_cat_master_catalogo3_idx` ON `mejoreduDB`.`met_cortoplazo_proyecto` (`id_catalogo_PNCCIMGP` ASC) VISIBLE;

CREATE INDEX `fk_met_cortoplazo_proyecto_met_archivo1_idx` ON `mejoreduDB`.`met_cortoplazo_proyecto` (`met_archivo_id_archivo` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_cortoplazo_actividad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_cortoplazo_actividad` (
  `id_actividad` INT NOT NULL COMMENT 'indentificador de una actividad en la tabla met_cortoplazo_actividades',
  `cve_actividad` INT(4) NOT NULL COMMENT 'campo que almacena la clave asociada a una actividad',
  `cx_nombre_actividad` VARCHAR(90) NOT NULL COMMENT 'campo que almacena el nombre de la actividad',
  `cx_descripcion` VARCHAR(100) NOT NULL COMMENT 'campo que almacena la descripcion de la actividad ',
  `cb_accion_puntual` VARCHAR(50) NULL COMMENT 'campo que almacena la accion puntual que tiene la actividad',
  `cx_articulacion_actividad` VARCHAR(90) NOT NULL COMMENT 'campo que almacena articulaciones enfocada a la actividad',
  `cb_actividad_interunidades` VARCHAR(70) NOT NULL COMMENT 'campo que almacena la accion transversal que se asocie a la actividad',
  `df_reunion` DATE NOT NULL COMMENT 'campo que almacena la fecha de reunion de la actividad',
  `id_anhio` INT NOT NULL COMMENT 'identificador de el año que se presenta en pantalla. se relaciona con la tabla met_anho_planeacion',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'clave que identifica a un usuario, se relaciona con la tabla seg_usuario',
  `df_actividad` DATE NOT NULL COMMENT 'campo que almacena la fecha de registro de la actividad',
  `dh_actividad` TIME NULL COMMENT 'campo que almacena la hora de registro de la actividad',
  `id_proyecto` INT NOT NULL COMMENT 'Identidad del proyecto asociada a la actividad, relacionada con la tabla met_cortoplazo_proyecto',
  PRIMARY KEY (`id_actividad`),
  CONSTRAINT `fk_met_cortoplazo_actividades_met_anho_planeacion1`
    FOREIGN KEY (`id_anhio`)
    REFERENCES `mejoreduDB`.`met_anho_planeacion` (`id_anhio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_cortoplazo_actividades_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_cortoplazo_actividades_met_cortoplazo_proyecto1`
    FOREIGN KEY (`id_proyecto`)
    REFERENCES `mejoreduDB`.`met_cortoplazo_proyecto` (`id_proyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE INDEX `fk_met_cortoplazo_actividades_met_anho_planeacion1_idx` ON `mejoreduDB`.`met_cortoplazo_actividad` (`id_anhio` ASC) VISIBLE;

CREATE INDEX `fk_met_cortoplazo_actividades_seg_usuario1_idx` ON `mejoreduDB`.`met_cortoplazo_actividad` (`cve_usuario` ASC) VISIBLE;

CREATE INDEX `fk_met_cortoplazo_actividades_met_cortoplazo_proyecto1_idx` ON `mejoreduDB`.`met_cortoplazo_actividad` (`id_proyecto` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_cortoplazo_presupuesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_cortoplazo_presupuesto` (
  `id_presupuesto` INT NOT NULL COMMENT 'Identificador de presupuesto de la tabla met_cortoplazo_presupuesto',
  `cve_accion` INT(3) NULL DEFAULT NULL COMMENT 'campo que almacena la clave asociada al presupuesto',
  `cx_nombre_accion` VARCHAR(90) NULL DEFAULT NULL COMMENT 'campo que almacena nombre de la accion que se asocia con el presupuesto',
  `cve_nivel_educativo` VARCHAR(50) NULL DEFAULT NULL COMMENT 'campo que almacena el nivel educativo asociado al presupuesto',
  `cx_centro_costo` VARCHAR(7) NULL DEFAULT NULL COMMENT 'campo que almacena el centro de costos ',
  `cb_partida_gasto` VARCHAR(50) NULL DEFAULT NULL COMMENT 'Lista desplegable concatenando la clave y la descripción de las partidas presupuestales',
  `cx_presupuesto_anual` INT(15) NULL DEFAULT NULL COMMENT 'campo que almacena el presupuesto anual, en moneda nacional',
  `df_calendarizacion_gasto` DATE NULL DEFAULT NULL COMMENT 'campo que almacena la fecha de calendarizacion de gastos',
  `cb_productos_asociados` VARCHAR(45) NULL DEFAULT NULL COMMENT 'lista desplegable concatenando la clave y nombre del producto que fueron registrados en el formulario anterior “Productos”.',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'clave que esta asociada a un usuario, se relaciona con la tabla seg_usuario',
  `id_anhio` INT NOT NULL COMMENT 'identificador del año que se presenta en pantalla, se relaciona con la tabla met_anho_planeacion',
  `df_presupuesto` DATE NOT NULL COMMENT 'campo que almacena la fecha de registro del presupuesto',
  `dh_presupuesto` TIME NOT NULL COMMENT 'campo que almacena la hora de registro del presupuesto',
  PRIMARY KEY (`id_presupuesto`),
  CONSTRAINT `fk_met_cortoplazo_presupuesto_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_cortoplazo_presupuesto_met_anho_planeacion1`
    FOREIGN KEY (`id_anhio`)
    REFERENCES `mejoreduDB`.`met_anho_planeacion` (`id_anhio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE INDEX `fk_met_cortoplazo_presupuesto_seg_usuario1_idx` ON `mejoreduDB`.`met_cortoplazo_presupuesto` (`cve_usuario` ASC) VISIBLE;

CREATE INDEX `fk_met_cortoplazo_presupuesto_met_anho_planeacion1_idx` ON `mejoreduDB`.`met_cortoplazo_presupuesto` (`id_anhio` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_cortoplazo_producto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_cortoplazo_producto` (
  `id_producto` INT NOT NULL COMMENT 'identificador del producto en la tabla',
  `cx_producto` VARCHAR(50) NULL DEFAULT NULL COMMENT 'campo que almacena el tipo de producto',
  `cx_nombre` VARCHAR(50) NULL COMMENT 'Nombre de producto',
  `cve_producto` VARCHAR(12) NULL DEFAULT NULL COMMENT 'Clave almacenada del producto',
  `cx_descripcion` VARCHAR(100) NULL DEFAULT NULL COMMENT 'campo que almacena la descripcion del producto',
  `cb_categorizacion` VARCHAR(70) NULL DEFAULT NULL COMMENT 'Campo que enlista la diferente categorizacion de un producto',
  `cb_indicador_pl` VARCHAR(45) NULL DEFAULT NULL COMMENT 'campo status que enlista el indicador Pl',
  `cx_vinculacion_producto` VARCHAR(90) NULL DEFAULT NULL COMMENT 'Vinculacion con diferentes productos asociados',
  `cb_continuidad` VARCHAR(30) NULL DEFAULT NULL COMMENT 'Campo que enlista los datos de continuidad con otros productos anteriores',
  `cb_por_publicar` VARCHAR(50) NULL DEFAULT NULL COMMENT 'campo que enlista los productos a publicar',
  `df_calendarizacion` DATE NULL DEFAULT NULL COMMENT 'Campo de calendarizacion del producto',
  `cx_productos_vinculados_potic` VARCHAR(50) NULL DEFAULT NULL COMMENT 'producto que esten directamente vinculados con POTIC',
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave de identificacion de un usuario, se relaciona con la tabla seg_usuario',
  `id_anhio` INT NOT NULL COMMENT 'identificador del año que se presentara en pantalla, se relaciona con la tabla met_anho_planeacion',
  `df_producto` DATE NULL COMMENT 'Campo que almacena la fecha de registro del producto',
  `dh_producto` TIME NULL COMMENT 'Campo que almacena la hora de registro del producto',
  `id_actividad` INT NOT NULL,
  PRIMARY KEY (`id_producto`),
  CONSTRAINT `fk_met_cortoplazo_productos_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_cortoplazo_productos_met_anho_planeacion1`
    FOREIGN KEY (`id_anhio`)
    REFERENCES `mejoreduDB`.`met_anho_planeacion` (`id_anhio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_cortoplazo_producto_met_cortoplazo_actividad1`
    FOREIGN KEY (`id_actividad`)
    REFERENCES `mejoreduDB`.`met_cortoplazo_actividad` (`id_actividad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE INDEX `fk_met_cortoplazo_productos_seg_usuario1_idx` ON `mejoreduDB`.`met_cortoplazo_producto` (`cve_usuario` ASC) VISIBLE;

CREATE INDEX `fk_met_cortoplazo_productos_met_anho_planeacion1_idx` ON `mejoreduDB`.`met_cortoplazo_producto` (`id_anhio` ASC) VISIBLE;

CREATE INDEX `fk_met_cortoplazo_producto_met_cortoplazo_actividad1_idx` ON `mejoreduDB`.`met_cortoplazo_producto` (`id_actividad` ASC) VISIBLE;


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
-- Table `mejoreduDB`.`met_arbolobjetivo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_arbolobjetivo` (
  `id_arbolobjetivos` INT NOT NULL COMMENT 'Identificador de registro del arbol de objetivos de la tabla met_presupuestal_arbolobjetivo',
  `cx_fin` VARCHAR(45) NOT NULL COMMENT 'se muestra el texto registrado en el campo efecto del problema público ',
  `cx_proposito` VARCHAR(45) NOT NULL COMMENT 'en este campo se muestra el texto registrado en el campo problemática central del problema público',
  `cx_medio` VARCHAR(45) NOT NULL COMMENT 'en este campo se muestra el texto registrado en el campo causas del problema público',
  `cd_opcion_actividad` VARCHAR(45) NOT NULL COMMENT 'por cada causa o sub causa el sistema presenta esta opción la cual permite al usuario señalar una causa como actividad, (al ser mostrado en el esquema deberá de tener un color xx).',
  `cd_opcion_componente` VARCHAR(45) NOT NULL COMMENT 'por cada causa o sub causa el sistema presenta esta opción la cual permite al usuario señalar una causa como componente, (al ser mostrado en el esquema deberá de tener un color xx).',
  PRIMARY KEY (`id_arbolobjetivos`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_tipo_causaefecto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_tipo_causaefecto` (
  `id_tipo_causaefecto` INT NOT NULL COMMENT 'Identificador que especifica el tipo de registro 1. causa, 2. efecto',
  `cd_tipo` VARCHAR(50) NULL COMMENT 'descripcion del tipo de registro',
  PRIMARY KEY (`id_tipo_causaefecto`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_arbolproblema`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_arbolproblema` (
  `id_arbolproblema` INT NOT NULL COMMENT 'Identificador del arbol de problemas de la tabla met_arbolproblema',
  `ix_nivel` INT NOT NULL COMMENT 'Campo que almacena el nivel de causa o efecto del problema',
  `id_tipo_causaefecto` INT NOT NULL COMMENT 'Identificador que especifica el tipo de registro 1. causa, 2. efecto',
  `cx_causaefecto` VARCHAR(50) NULL COMMENT 'Campo que almacenara la descripcion del elemento ',
  `id_padre` VARCHAR(100) NULL COMMENT 'campo que almacena los nodos padres que se relacionaran con las causas o efectos del arbol de problemas ',
  PRIMARY KEY (`id_arbolproblema`),
  CONSTRAINT `fk_met_presupuestal_arbolproblema_met_tipo_causaefecto1`
    FOREIGN KEY (`id_tipo_causaefecto`)
    REFERENCES `mejoreduDB`.`met_tipo_causaefecto` (`id_tipo_causaefecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE INDEX `fk_met_presupuestal_arbolproblema_met_tipo_causaefecto1_idx` ON `mejoreduDB`.`met_arbolproblema` (`id_tipo_causaefecto` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_ficha_indicadores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_ficha_indicadores` (
  `idmet_ficha_indicadores` INT NOT NULL,
  `cx_nombre_indicador` VARCHAR(45) NOT NULL,
  `cx_dimension` VARCHAR(45) NOT NULL,
  `cx_tipo_indicador` VARCHAR(45) NOT NULL,
  `cx_definicion_indicador` VARCHAR(45) NOT NULL,
  `cx_metodo_calculo_indicador` VARCHAR(45) NOT NULL,
  `cx_unidad_medida` VARCHAR(45) NOT NULL,
  `cx_describir_unidad_medida` VARCHAR(45) NULL,
  `cx_unidad_absoluta` VARCHAR(45) NULL,
  `cx_frecuencia_medicion` VARCHAR(45) NULL,
  `cx_describir_frecuencia_medicion` VARCHAR(45) NULL,
  `cx_linea_base` VARCHAR(45) NULL,
  `cx_numerado_denominador_meta` VARCHAR(45) NULL,
  `cx_meta_anual` VARCHAR(45) NULL,
  `cx_medio_verificacion_indicador` VARCHAR(45) NULL,
  PRIMARY KEY (`idmet_ficha_indicadores`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_MIR`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_MIR` (
  `id_MIR_ficha` INT NOT NULL COMMENT 'identificador del registro MIR_ficha de la tabla met_presupuestal_MIR_ficha',
  `cx_nivel` VARCHAR(45) NOT NULL COMMENT 'Campo nivel, en esta columna se mostrará un tipo de nivel y se ajustará según la cantidad de niveles identificados en el árbol de objetivos (fin, propósito, componente y actividades).\n',
  `cx_resumen_narrativo` VARCHAR(100) NOT NULL COMMENT 'Campo Resumen Narrativo, en estos campos se describen los cuatro niveles de objetivos (fin, propósito, componente y actividades).\n\nSe deberán visualizar los textos obtenidos en el árbol de objetivos, donde se recuperará el texto señalado y mostrado en el árbol en color azul como fin, para el propósito el texto en verde, para componentes el texto en morado y para actividades el texto en color rosa. ',
  `cx_nombre_indicador` VARCHAR(100) NOT NULL COMMENT 'Campo Indicador, en estos campos el usuario expresará los conceptos relevantes a medir de cada uno de los cuatro niveles de objetivos en forma de indicadores.\n',
  `cx_medios_verificacion` VARCHAR(200) NOT NULL COMMENT 'Campo Medios de Verificación, en estos campos el usuario ingresará las fuentes de información para el cálculo y monitoreo de los indicadores. ',
  `cx_supuestos` VARCHAR(350) NOT NULL COMMENT 'Campo Supuestos, son los factores externos o situaciones ajenas al programa que deben cumplirse para el logro del objetivo del programa y para cada componente se deberá poder capturar el campo “supuesto',
  `cx_opcion_FI` VARCHAR(45) NULL,
  `id_ficha_indicadores` INT NOT NULL,
  PRIMARY KEY (`id_MIR_ficha`),
  CONSTRAINT `fk_met_MIR_met_ficha_indicadores1`
    FOREIGN KEY (`id_ficha_indicadores`)
    REFERENCES `mejoreduDB`.`met_ficha_indicadores` (`idmet_ficha_indicadores`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE INDEX `fk_met_MIR_met_ficha_indicadores1_idx` ON `mejoreduDB`.`met_MIR` (`id_ficha_indicadores` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_presupuestal`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_presupuestal` (
  `id_presupuestal` INT NOT NULL,
  `df_registro` VARCHAR(45) NULL,
  `dh_registro` VARCHAR(45) NULL,
  `cs_estatus` VARCHAR(45) NULL,
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave asociada al usuario que registra en el año indicado, referencia con la tabla seg_usuario',
  `id_anhio` INT NOT NULL COMMENT 'Identificador del año de planeación de entrada se cargan los 5 ultimos años y el vigente, se relaciona con la tabla met_anho_planeacion',
  `id_datosgenerales` INT NOT NULL COMMENT 'Identificador del resgistro de datos generales de la tabla met_presupuestal_datosgenerales',
  `id_archivo_diagnostico` INT NOT NULL COMMENT 'Identificador del archivo con referencia a la tabla met_archivos, en esta opción se podrá adjuntar el documento en formato PDF, Word por el usuario administrador y el de planeación. ',
  `id_archivo_acta_aprobacion` INT NOT NULL COMMENT 'Identificador del archivo con referencia a la tabla met_archivos, en esta opción se podrá adjuntar el acta en formato PDF, Word por el usuario administrador y el de planeación. ',
  `id_diagnostico` INT NOT NULL COMMENT 'Identificador del registro de diagnostico de la tabla met_diagnostico',
  `id_arbolproblema` INT NOT NULL COMMENT 'Identificador del arbol de problemas de la tabla met_arbolproblema',
  `id_arbolobjetivos` INT NOT NULL COMMENT 'Identificador de registro del arbol de objetivos de la tabla met_arbolobjetivo',
  `id_MIR_ficha` INT NOT NULL COMMENT 'identificador del registro MIR_ficha de la tabla metl_MIR_ficha',
  `id_M001` INT NOT NULL COMMENT 'Identificador de acceco al la planeacion presupuestal M001',
  PRIMARY KEY (`id_presupuestal`),
  CONSTRAINT `fk_met_presupuestal_seg_usuario2`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_presupuestal_met_anho_planeacion2`
    FOREIGN KEY (`id_anhio`)
    REFERENCES `mejoreduDB`.`met_anho_planeacion` (`id_anhio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_presupuestal_met_presupuestal_datosgeneral1`
    FOREIGN KEY (`id_datosgenerales`)
    REFERENCES `mejoreduDB`.`met_datosgeneral` (`id_datosgenerales`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_presupuestal_met_archivo1`
    FOREIGN KEY (`id_archivo_diagnostico`)
    REFERENCES `mejoreduDB`.`met_archivo` (`id_archivo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_presupuestal_met_archivo2`
    FOREIGN KEY (`id_archivo_acta_aprobacion`)
    REFERENCES `mejoreduDB`.`met_archivo` (`id_archivo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_presupuestal_met_presupuestal_diagnostico1`
    FOREIGN KEY (`id_diagnostico`)
    REFERENCES `mejoreduDB`.`met_diagnostico` (`id_diagnostico`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_presupuestal_met_presupuestal_arbolproblema1`
    FOREIGN KEY (`id_arbolproblema`)
    REFERENCES `mejoreduDB`.`met_arbolproblema` (`id_arbolproblema`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_presupuestal_met_presupuestal_arbolobjetivo1`
    FOREIGN KEY (`id_arbolobjetivos`)
    REFERENCES `mejoreduDB`.`met_arbolobjetivo` (`id_arbolobjetivos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_presupuestal_met_presupuestal_MIR_ficha1`
    FOREIGN KEY (`id_MIR_ficha`)
    REFERENCES `mejoreduDB`.`met_MIR` (`id_MIR_ficha`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_presupuestal_met_presupuestal_M0011`
    FOREIGN KEY (`id_M001`)
    REFERENCES `mejoreduDB`.`met_M001` (`id_M001`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_presupuestal_seg_usuario2_idx` ON `mejoreduDB`.`met_presupuestal` (`cve_usuario` ASC) VISIBLE;

CREATE INDEX `fk_met_presupuestal_met_anho_planeacion2_idx` ON `mejoreduDB`.`met_presupuestal` (`id_anhio` ASC) VISIBLE;

CREATE INDEX `fk_met_presupuestal_met_presupuestal_datosgeneral1_idx` ON `mejoreduDB`.`met_presupuestal` (`id_datosgenerales` ASC) VISIBLE;

CREATE INDEX `fk_met_presupuestal_met_archivo1_idx` ON `mejoreduDB`.`met_presupuestal` (`id_archivo_diagnostico` ASC) VISIBLE;

CREATE INDEX `fk_met_presupuestal_met_archivo2_idx` ON `mejoreduDB`.`met_presupuestal` (`id_archivo_acta_aprobacion` ASC) VISIBLE;

CREATE INDEX `fk_met_presupuestal_met_presupuestal_diagnostico1_idx` ON `mejoreduDB`.`met_presupuestal` (`id_diagnostico` ASC) VISIBLE;

CREATE INDEX `fk_met_presupuestal_met_presupuestal_arbolproblema1_idx` ON `mejoreduDB`.`met_presupuestal` (`id_arbolproblema` ASC) VISIBLE;

CREATE INDEX `fk_met_presupuestal_met_presupuestal_arbolobjetivo1_idx` ON `mejoreduDB`.`met_presupuestal` (`id_arbolobjetivos` ASC) VISIBLE;

CREATE INDEX `fk_met_presupuestal_met_presupuestal_MIR_ficha1_idx` ON `mejoreduDB`.`met_presupuestal` (`id_MIR_ficha` ASC) VISIBLE;

CREATE INDEX `fk_met_presupuestal_met_presupuestal_M0011_idx` ON `mejoreduDB`.`met_presupuestal` (`id_M001` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_formulario_archivo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_formulario_archivo` (
  `idformulario_archivo` INT NOT NULL,
  `id_formulario` INT NOT NULL,
  `id_archivo` INT NOT NULL,
  PRIMARY KEY (`idformulario_archivo`),
  CONSTRAINT `fk_met_formulario_archivo_met_formulario_analitico1`
    FOREIGN KEY (`id_formulario`)
    REFERENCES `mejoreduDB`.`met_formulario_analitico` (`id_formulario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_formulario_archivo_met_archivo1`
    FOREIGN KEY (`id_archivo`)
    REFERENCES `mejoreduDB`.`met_archivo` (`id_archivo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_formulario_archivo_met_formulario_analitico1_idx` ON `mejoreduDB`.`met_formulario_archivo` (`id_formulario` ASC) VISIBLE;

CREATE INDEX `fk_met_formulario_archivo_met_archivo1_idx` ON `mejoreduDB`.`met_formulario_archivo` (`id_archivo` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_metas_MIRFID`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_metas_MIRFID` (
  `id_MIRDIF` INT NOT NULL,
  `cx_tipo` VARCHAR(45) NULL COMMENT 'dentro de esta columna se muestra si es componente o actividad que se ha registrado del submódulo de programas presupuestarios',
  `cx_nivel` VARCHAR(45) NULL COMMENT 'dentro de esta columna se muestra el nivel del componente o actividad que se ha registrado dentro del submódulo de programas presupuestarios',
  `cx_indicador` VARCHAR(45) NULL COMMENT 'Se muestra la leyenda correspondiente sobre el fin, propósito, nivel o componente que se ha registrado dentro del submódulo programas presupuestarios',
  `cx_meta_programada` VARCHAR(45) NULL COMMENT 'se subdivide en 2 columnas dónde la primera señala el número de productos que están relacionados con la actividad o componente y la segunda muestra el porcentaje de que representan dichos productos dentro de la meta programada en el año indicado',
  `cx_primer_trimestre` VARCHAR(45) NULL COMMENT 'se subdivide en 2 columnas dónde la primera señala el número de productos que están relacionados con la actividad o componente y la segunda muestra el porcentaje de que representan dichos productos dentro del trimestre que se haya registrado',
  `cx_segundo_trimestre` VARCHAR(45) NULL COMMENT 'se subdivide en 2 columnas dónde la primera señala el número de productos que están relacionados con la actividad o componente y la segunda muestra el porcentaje de que representan dichos productos dentro del trimestre que se haya registrado',
  `cx_tercer_trimestre` VARCHAR(45) NULL COMMENT 'se subdivide en 2 columnas dónde la primera señala el número de productos que están relacionados con la actividad o componente y la segunda muestra el porcentaje de que representan dichos productos dentro del trimestre que se haya registrado',
  `cx_cuarto_trimestre` VARCHAR(45) NULL COMMENT 'se subdivide en 2 columnas dónde la primera señala el número de productos que están relacionados con la actividad o componente y la segunda muestra el porcentaje de que representan dichos productos dentro del trimestre que se haya registrado',
  `cve_usuario` VARCHAR(45) NOT NULL,
  `id_anhio` INT NOT NULL,
  PRIMARY KEY (`id_MIRDIF`),
  CONSTRAINT `fk_met_metas_MIRFID_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_metas_MIRFID_met_anho_planeacion1`
    FOREIGN KEY (`id_anhio`)
    REFERENCES `mejoreduDB`.`met_anho_planeacion` (`id_anhio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_metas_MIRFID_seg_usuario1_idx` ON `mejoreduDB`.`met_metas_MIRFID` (`cve_usuario` ASC) VISIBLE;

CREATE INDEX `fk_met_metas_MIRFID_met_anho_planeacion1_idx` ON `mejoreduDB`.`met_metas_MIRFID` (`id_anhio` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_metas_bienestar`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_metas_bienestar` (
  `id_metas_bienestar` INT NOT NULL,
  `cve_objetivo_prioritario` VARCHAR(45) NULL COMMENT 'se obtiene de la clave que fue registrada dentro del submódulo planeación a mediano plazo',
  `cve_meta_parametro` VARCHAR(45) NULL COMMENT 'se obtiene de la clave de la meta o parámetro que fue registrada dentro del submódulo planeación a mediano plazo',
  `cx_nombre` VARCHAR(45) NULL COMMENT 'Se obtiene del nombre de la meta o parámetro que fue registrado en el submódulo de planeación a mediano plazo',
  `cx_periodicidad` VARCHAR(45) NULL COMMENT 'Se obtiene de la periodicidad que fue registrada dentro del submódulo de mediano plazo',
  `cx_unidad_medida` VARCHAR(45) NULL COMMENT 'Se obtiene de la unidad de medida que fue registrada dentro del submódulo de mediano plazo',
  `cx_tendencia_esperada` VARCHAR(45) NULL COMMENT 'Se obtiene de la tendencia esperada que fue registrada dentro del submódulo de mediano plazo',
  `cx_fuente_variable_uno` VARCHAR(45) NULL COMMENT 'Se obtiene de la fuente variable 1 que fue registrada dentro del submódulo de mediano plazo',
  `cx_meta` INT(4) NULL COMMENT 'Campo editable numérico de 4 dígitos de longitud para indicar el año, (se subdivide en dos columnas, en la primera muestra el número que representa esa meta o parámetro y en la segunda el porcentaje que representa dicha meta o parámetro)',
  `cve_usuario` VARCHAR(45) NOT NULL,
  `id_anhio` INT NOT NULL,
  PRIMARY KEY (`id_metas_bienestar`),
  CONSTRAINT `fk_met_metas_bienestar_seg_usuario1`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_metas_bienestar_met_anho_planeacion1`
    FOREIGN KEY (`id_anhio`)
    REFERENCES `mejoreduDB`.`met_anho_planeacion` (`id_anhio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_met_metas_bienestar_seg_usuario1_idx` ON `mejoreduDB`.`met_metas_bienestar` (`cve_usuario` ASC) VISIBLE;

CREATE INDEX `fk_met_metas_bienestar_met_anho_planeacion1_idx` ON `mejoreduDB`.`met_metas_bienestar` (`id_anhio` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mejoreduDB`.`met_metas_MIRFID2`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_metas_MIRFID2` (
  `id_MIRFID2` INT NOT NULL,
  `cx_nivel` VARCHAR(45) NULL,
  `cx_clave_nombre_producto` VARCHAR(45) NULL,
  `cx_clave_nombre_actividad` VARCHAR(45) NULL,
  PRIMARY KEY (`id_MIRFID2`))
ENGINE = InnoDB;

USE `mejoreduDB` ;

-- -----------------------------------------------------
-- Placeholder table for view `mejoreduDB`.`vt_autenticador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`vt_autenticador` (`id_contra` INT, `cve_usuario` INT, `id_tipo_usuario` INT, `cx_palabra_secreta` INT, `cs_estatus` INT, `cx_nombre` INT, `cx_primer_apellido` INT, `cx_segundo_apellido` INT, `cx_correo` INT);

-- -----------------------------------------------------
-- Placeholder table for view `mejoreduDB`.`vt_anhio_vigente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`vt_anhio_vigente` (`id_anhio` INT, `fecha` INT, `hora` INT);

-- -----------------------------------------------------
-- Placeholder table for view `mejoreduDB`.`vt_roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`vt_roles` (`id_tipo_usuario` INT, `cd_tipo_usuario` INT, `ce_facultad` INT);

-- -----------------------------------------------------
-- Placeholder table for view `mejoreduDB`.`vt_estructura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`vt_estructura` (`id_apartadoconcepto` INT, `ic_nivel` INT, `id_apartado` INT, `cd_apartado` INT, `id_concepto` INT, `cd_concepto` INT, `ic_tipo_dato` INT, `ix_requerido` INT, `cs_estatus` INT);

-- -----------------------------------------------------
-- View `mejoreduDB`.`vt_autenticador`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mejoreduDB`.`vt_autenticador`;
USE `mejoreduDB`;
CREATE  OR REPLACE VIEW vt_autenticador AS
select sc.id_contra, su.cve_usuario, su.id_tipo_usuario, sc.cx_palabra_secreta, su.cs_estatus, sp.cx_nombre, sp.cx_primer_apellido, sp.cx_segundo_apellido, sp.cx_correo
from seg_usuario su, seg_contrasenhia sc, seg_usuario_persona sup, seg_persona sp
where su.cve_usuario = sc.cve_usuario 
and su.cve_usuario = sup.cve_usuario and sup.id_persona =sp.id_persona;

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

-- -----------------------------------------------------
-- View `mejoreduDB`.`vt_estructura`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mejoreduDB`.`vt_estructura`;
USE `mejoreduDB`;
CREATE  OR REPLACE VIEW `vt_estructura` AS
select mac.id_apartadoconcepto, mac.ic_nivel, mac.id_apartado, ma.cd_apartado, mac.id_concepto, mc.cd_concepto, mc.ic_tipo_dato, mc.ix_requerido, mac.cs_estatus
from met_pmp_apartado_concepto mac, met_apartado ma, met_concepto mc
where mac.id_apartado = ma.id_apartado and mac.id_concepto = mc.id_concepto;

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
INSERT INTO `mejoreduDB`.`seg_usuario` (`cve_usuario`, `cs_estatus`, `df_baja`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES ('miguelangel.lopez', 'A', NULL, 2, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario` (`cve_usuario`, `cs_estatus`, `df_baja`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES ('alberto.serrano', 'A', NULL, 4, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario` (`cve_usuario`, `cs_estatus`, `df_baja`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES ('superusuario', 'A', NULL, 1, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario` (`cve_usuario`, `cs_estatus`, `df_baja`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES ('silvia.valle', 'A', NULL, 3, NULL);

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
-- Data for table `mejoreduDB`.`seg_persona`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`seg_persona` (`id_persona`, `cx_nombre`, `cx_primer_apellido`, `cx_segundo_apellido`, `df_fecha_nacimiento`, `cx_correo`, `LOCK_FLAG`) VALUES (1, 'MIGUEL ANGEL DE JESÚS', 'LÓPEZ', ' REYES', '1976-01-24', 'miguelangel.lopez@mejorredu.gob.mx', NULL);
INSERT INTO `mejoreduDB`.`seg_persona` (`id_persona`, `cx_nombre`, `cx_primer_apellido`, `cx_segundo_apellido`, `df_fecha_nacimiento`, `cx_correo`, `LOCK_FLAG`) VALUES (2, 'ALBERTO', 'SERRANO', 'RADILLA', '1976-01-24', 'alberto.serrano@mejorredu.gob.mx', NULL);
INSERT INTO `mejoreduDB`.`seg_persona` (`id_persona`, `cx_nombre`, `cx_primer_apellido`, `cx_segundo_apellido`, `df_fecha_nacimiento`, `cx_correo`, `LOCK_FLAG`) VALUES (3, 'superusuario', 'superusuario', 'superusuario', '1976-01-24', 'superuser@mejorredu.org.mx', NULL);
INSERT INTO `mejoreduDB`.`seg_persona` (`id_persona`, `cx_nombre`, `cx_primer_apellido`, `cx_segundo_apellido`, `df_fecha_nacimiento`, `cx_correo`, `LOCK_FLAG`) VALUES (4, 'SILVIA', 'VALLE', 'TEPATL', '1976-01-24', 'silvia.valle@mejoredu.gob.mx', NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`seg_usuario_persona`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`seg_usuario_persona` (`cs_estatus`, `id_persona`, `cve_usuario`, `id_usuario_persona`, `LOCK_FLAG`) VALUES ('A', 1, 'miguelangel.lopez', 1, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_persona` (`cs_estatus`, `id_persona`, `cve_usuario`, `id_usuario_persona`, `LOCK_FLAG`) VALUES ('A', 2, 'alberto.serrano', 2, NULL);
INSERT INTO `mejoreduDB`.`seg_usuario_persona` (`cs_estatus`, `id_persona`, `cve_usuario`, `id_usuario_persona`, `LOCK_FLAG`) VALUES ('A', 3, 'superusuario', 3, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`seg_contrasenhia`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`seg_contrasenhia` (`cve_usuario`, `cx_palabra_secreta`, `df_fecha`, `cs_estatus`, `ix_numero_intentos`, `id_contra`, `LOCK_FLAG`) VALUES ('miguelangel.lopez', 'miguelangel.lopez', NULL, '1', 0, 1, NULL);
INSERT INTO `mejoreduDB`.`seg_contrasenhia` (`cve_usuario`, `cx_palabra_secreta`, `df_fecha`, `cs_estatus`, `ix_numero_intentos`, `id_contra`, `LOCK_FLAG`) VALUES ('alberto.serrano', 'alberto.serrano', NULL, '1', 0, 2, NULL);
INSERT INTO `mejoreduDB`.`seg_contrasenhia` (`cve_usuario`, `cx_palabra_secreta`, `df_fecha`, `cs_estatus`, `ix_numero_intentos`, `id_contra`, `LOCK_FLAG`) VALUES ('superusuario', 'superusuario', NULL, '1', 0, 3, NULL);
INSERT INTO `mejoreduDB`.`seg_contrasenhia` (`cve_usuario`, `cx_palabra_secreta`, `df_fecha`, `cs_estatus`, `ix_numero_intentos`, `id_contra`, `LOCK_FLAG`) VALUES ('silvia.valle', 'silvia.valle', NULL, '1', 0, 4, NULL);

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


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`met_apartado`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`met_apartado` (`id_apartado`, `cd_apartado`, `cs_estatus`, `cve_usuario`) VALUES (1, 'Principal', 'A', 'superusuario');
INSERT INTO `mejoreduDB`.`met_apartado` (`id_apartado`, `cd_apartado`, `cs_estatus`, `cve_usuario`) VALUES (2, 'Problemas Públicos', 'A', 'superusuario');
INSERT INTO `mejoreduDB`.`met_apartado` (`id_apartado`, `cd_apartado`, `cs_estatus`, `cve_usuario`) VALUES (3, 'Objetivos Prioritarios', 'A', 'superusuario');
INSERT INTO `mejoreduDB`.`met_apartado` (`id_apartado`, `cd_apartado`, `cs_estatus`, `cve_usuario`) VALUES (4, 'Relevancia de los Objetivos Prioritarios', 'A', 'superusuario');
INSERT INTO `mejoreduDB`.`met_apartado` (`id_apartado`, `cd_apartado`, `cs_estatus`, `cve_usuario`) VALUES (5, 'Estrategias Prioritarias', 'A', 'superusuario');
INSERT INTO `mejoreduDB`.`met_apartado` (`id_apartado`, `cd_apartado`, `cs_estatus`, `cve_usuario`) VALUES (6, 'Acciones Puntuales', 'A', 'superusuario');
INSERT INTO `mejoreduDB`.`met_apartado` (`id_apartado`, `cd_apartado`, `cs_estatus`, `cve_usuario`) VALUES (7, 'Metas para el Bienestar de los Objetivos Prioritarios', 'A', 'superusuario');
INSERT INTO `mejoreduDB`.`met_apartado` (`id_apartado`, `cd_apartado`, `cs_estatus`, `cve_usuario`) VALUES (8, 'Metas para el Bienestar de los Objetivos Prioritarios', 'A', 'superusuario');
INSERT INTO `mejoreduDB`.`met_apartado` (`id_apartado`, `cd_apartado`, `cs_estatus`, `cve_usuario`) VALUES (9, 'Parámetros de los Objetivos Prioritarios', 'A', 'superusuario');
INSERT INTO `mejoreduDB`.`met_apartado` (`id_apartado`, `cd_apartado`, `cs_estatus`, `cve_usuario`) VALUES (10, 'Epílogo: Visión a Largo Pl', 'A', 'superusuario');
INSERT INTO `mejoreduDB`.`met_apartado` (`id_apartado`, `cd_apartado`, `cs_estatus`, `cve_usuario`) VALUES (11, 'Finalizado', 'A', 'superusuario');

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`met_concepto`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (1, 'Nombre del programa', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (2, 'Alineación al PND', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (3, 'Análisis del Estado Actual', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (4, 'Problemas Públicos', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (5, 'Problema', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (6, 'Objetivos Prioritarios', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (7, 'Objetivo', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (8, 'Relevancia de los Objetivos Prioritarios', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (9, 'Relevancia', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (10, 'Estrategias Prioritarias', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (11, 'Estrategias', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (12, 'Acciones Puntuales', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (13, 'Acciones', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (14, 'Metas para el Bienestar de los Objetivos Prioritarios', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (15, 'Meta', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (16, 'Parámetros de los Objetivos Prioritarios', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (17, 'Parámetro', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (18, 'Epílogo: Visión a Largo Pl', 1, 'A', 1);
INSERT INTO `mejoreduDB`.`met_concepto` (`id_concepto`, `cd_concepto`, `ic_tipo_dato`, `cs_estatus`, `ix_requerido`) VALUES (19, 'Epílogo', 1, 'A', 1);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`met_pmp_apartado_concepto`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`met_pmp_apartado_concepto` (`id_apartadoconcepto`, `ic_nivel`, `id_apartado`, `id_concepto`, `cs_estatus`) VALUES (1, 1, 1, 1, 'A');
INSERT INTO `mejoreduDB`.`met_pmp_apartado_concepto` (`id_apartadoconcepto`, `ic_nivel`, `id_apartado`, `id_concepto`, `cs_estatus`) VALUES (2, 1, 1, 2, 'A');
INSERT INTO `mejoreduDB`.`met_pmp_apartado_concepto` (`id_apartadoconcepto`, `ic_nivel`, `id_apartado`, `id_concepto`, `cs_estatus`) VALUES (3, 1, 1, 3, 'A');
INSERT INTO `mejoreduDB`.`met_pmp_apartado_concepto` (`id_apartadoconcepto`, `ic_nivel`, `id_apartado`, `id_concepto`, `cs_estatus`) VALUES (4, 1, 2, 4, 'A');
INSERT INTO `mejoreduDB`.`met_pmp_apartado_concepto` (`id_apartadoconcepto`, `ic_nivel`, `id_apartado`, `id_concepto`, `cs_estatus`) VALUES (5, 2, 2, 5, 'A');
INSERT INTO `mejoreduDB`.`met_pmp_apartado_concepto` (`id_apartadoconcepto`, `ic_nivel`, `id_apartado`, `id_concepto`, `cs_estatus`) VALUES (6, 1, 3, 6, 'A');
INSERT INTO `mejoreduDB`.`met_pmp_apartado_concepto` (`id_apartadoconcepto`, `ic_nivel`, `id_apartado`, `id_concepto`, `cs_estatus`) VALUES (7, 2, 3, 7, 'A');
INSERT INTO `mejoreduDB`.`met_pmp_apartado_concepto` (`id_apartadoconcepto`, `ic_nivel`, `id_apartado`, `id_concepto`, `cs_estatus`) VALUES (8, 1, 4, 8, 'A');
INSERT INTO `mejoreduDB`.`met_pmp_apartado_concepto` (`id_apartadoconcepto`, `ic_nivel`, `id_apartado`, `id_concepto`, `cs_estatus`) VALUES (9, 2, 4, 9, 'A');
INSERT INTO `mejoreduDB`.`met_pmp_apartado_concepto` (`id_apartadoconcepto`, `ic_nivel`, `id_apartado`, `id_concepto`, `cs_estatus`) VALUES (10, 1, 5, 10, 'A');
INSERT INTO `mejoreduDB`.`met_pmp_apartado_concepto` (`id_apartadoconcepto`, `ic_nivel`, `id_apartado`, `id_concepto`, `cs_estatus`) VALUES (11, 2, 5, 11, 'A');

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`met_tipo_causaefecto`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`met_tipo_causaefecto` (`id_tipo_causaefecto`, `cd_tipo`) VALUES (1, 'causa');
INSERT INTO `mejoreduDB`.`met_tipo_causaefecto` (`id_tipo_causaefecto`, `cd_tipo`) VALUES (2, 'efecto');

COMMIT;

