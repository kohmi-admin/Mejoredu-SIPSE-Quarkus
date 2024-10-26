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
  `df_baja` DATETIME NULL DEFAULT NULL COMMENT 'Fecha de baja del usuario, nulo si es activo',
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
  `df_registro` DATETIME(6) NOT NULL COMMENT 'Fecha y hora del evento de registro',
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
  `cs_status` INT NULL COMMENT 'Estatus que guarda la facultad, podrá ser 1 activa, 0 Baja, 2 Bloqueda',
  `LOCK_FLAG` INT NULL,
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
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que afecta el registro',
  `id_catalogo_padre` INT NULL COMMENT 'Identificador del catalogo que permite conocer el catálogo padre',
  `cd_descripcionDos` VARCHAR(500) NULL COMMENT 'Descripción Dos de la opción del catalogo',
  `cc_externaDos` VARCHAR(45) NULL COMMENT 'Clave de la descripción dos del catalogo',
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

USE `mejoreduDB` ;

-- -----------------------------------------------------
-- Placeholder table for view `mejoreduDB`.`vt_autenticador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mejoreduDB`.`vt_autenticador` (`id_contra` INT, `cve_usuario` INT, `cx_palabra_secreta` INT, `cs_estatus` INT, `cx_nombre` INT, `cx_primer_apellido` INT, `cx_segundo_apellido` INT, `cx_correo` INT);

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
INSERT INTO `mejoreduDB`.`seg_tipo_usuario` (`id_tipo_usuario`, `cd_tipo_usuario`, `cs_estatus`, `id_bitacora`, `LOCK_FLAG`) VALUES (3, 'Enlace', 'A', -1, NULL);
INSERT INTO `mejoreduDB`.`seg_tipo_usuario` (`id_tipo_usuario`, `cd_tipo_usuario`, `cs_estatus`, `id_bitacora`, `LOCK_FLAG`) VALUES (4, 'Supervisor', 'A', -1, NULL);
INSERT INTO `mejoreduDB`.`seg_tipo_usuario` (`id_tipo_usuario`, `cd_tipo_usuario`, `cs_estatus`, `id_bitacora`, `LOCK_FLAG`) VALUES (5, 'Planeación', 'A', -1, NULL);
INSERT INTO `mejoreduDB`.`seg_tipo_usuario` (`id_tipo_usuario`, `cd_tipo_usuario`, `cs_estatus`, `id_bitacora`, `LOCK_FLAG`) VALUES (6, 'Presupuesto', 'A', -1, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mejoreduDB`.`seg_usuario`
-- -----------------------------------------------------
START TRANSACTION;
USE `mejoreduDB`;
INSERT INTO `mejoreduDB`.`seg_usuario` (`cve_usuario`, `cs_estatus`, `df_baja`, `id_tipo_usuario`, `LOCK_FLAG`) VALUES ('superusuario', 'A', NULL, 1, NULL);

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
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Catalogo Articulacion Actividad', '1', NULL, 'superusuario', Null, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Elaborar sugerencias de elementos que contribuyan a la mejora de la educación inicial, para fortalecer el enfoque de educación inclusiva', '110', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Elaborar sugerencias de elementos que contribuyan a la mejora de los planes y programas de estudio de EMS, para fortalecer el enfoque de educación inclusiva', '120', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Elaborar sugerencias de elementos que contribuyan a la mejora de los planes y programas de estudio de educación básica para favorecer la atención de las personas, pueblos y comunidades indígenas desde un enfoque de educación inclusiva', '130', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Elaborar lineamientos para la mejora de las escuelas de educación básica', '140', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Elaborar lineamientos para la mejora de los planteles escolares de educación media superior', '150', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Elaborar sugerencias de elementos que contribuyan a la mejora de los planes y programas de estudio de EB, para fortalecer el enfoque de educación inclusiva', '160', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Gestionar la difusión en medios institucionales', '170', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Diseñar materiales para la difusión de productos institucionales', '180', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Coordinar el funcionamiento del Comité Editorial de la Comisión', '190', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Gestionar el programa editorial anual ', '200', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Gestionar el Centro de Documentación', '210', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Elaborar un repositorio digital de materiales educativos en educación básica y media superior', '220', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Elaborar estrategias de apoyo pedagógico para Educación Media Superior', '230', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Implementar la estrategia para la definición de indicadores educativos clave', '240', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Determinar indicadores para el seguimiento de los avances del Sistema Educativo Nacional', '250', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Realizar análisis estadísticos por temas prioritarios ', '260', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Desarrollar el proyecto gobierno y administración de datos en apoyo a los procesos de segumiento a la mejora continua de la educación', '270', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Coordinar la gestión interna', '280', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Desarrollar herramientas de apoyo para el seguimiento de la mejora continua de la educación', '290', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'No aplica', '300', NULL, 'superusuario', 1, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Catálogo de Tipo de Producto', '2', NULL, 'superusuario', Null, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Intermedio', '110', NULL, 'superusuario', 22, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Final', '120', NULL, 'superusuario', 22, NULL, NULL);
INSERT INTO `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`, `cd_opcion`, `cc_externa`, `df_baja`, `cve_usuario`, `id_catalogo_padre`, `cd_descripcionDos`, `cc_externaDos`) VALUES (DEFAULT, 'Periódico', '130', NULL, 'superusuario', 22, NULL, NULL);

COMMIT;

DROP PROCEDURE IF EXISTS `mejoreduDB`.`registrar_usuario`;
DELIMITER //
CREATE PROCEDURE `mejoreduDB`.`registrar_usuario`(
	IN cveUsuario varchar(45),
    IN cxNombre varchar(120),
    IN cxApellido varchar(120),
    IN cxCorreo varchar(120),
    IN cxPalabraSecreta varchar(120)
)
BEGIN
	DECLARE idPersona INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION, NOT FOUND, SQLWARNING
    BEGIN
        GET DIAGNOSTICS CONDITION 1 @errno = MYSQL_ERRNO, @sqlstate = RETURNED_SQLSTATE, @text = MESSAGE_TEXT;
        SET @full_error = CONCAT('ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        ROLLBACK;
        SELECT @full_error;
    END;
	IF EXISTS(select * from `mejoreduDB`.`seg_usuario` WHERE cve_usuario = cveUsuario) THEN
        SELECT id_persona INTO idPersona FROM `mejoreduDB`.`seg_usuario_persona` WHERE cve_usuario = cveUsuario;
        START TRANSACTION;
        UPDATE `mejoreduDB`.`seg_persona` SET
			cx_nombre = cxNombre,
            cx_primer_apellido = cxApellido,
            cx_correo = cxCorreo
		WHERE id_persona = idPersona;
        COMMIT;
    ELSE
        START TRANSACTION;
        INSERT INTO `mejoreduDB`.`seg_usuario`(cve_usuario, cs_estatus, id_tipo_usuario) VALUES(cveUsuario, 'A', 1);
        INSERT INTO `mejoreduDB`.`seg_persona`(cx_nombre, cx_primer_apellido, cx_correo) VALUES(cxNombre, cxApellido, cxCorreo);
        SET idPersona = last_insert_id();
        INSERT INTO `mejoreduDB`.`seg_usuario_persona`(id_persona, cve_usuario, cs_estatus) VALUES(idPersona, cveUsuario, 'A');
        INSERT INTO `mejoreduDB`.`seg_contrasenhia`(cve_usuario, cx_palabra_secreta, cs_estatus, ix_numero_intentos) VALUES(cveUsuario, cxPalabraSecreta, 'A', 0);
		COMMIT;
	END IF;
    SELECT * FROM `mejoreduDB`.`vt_autenticador` WHERE cve_usuario = cveUsuario LIMIT 1;
END //
DELIMITER ;
