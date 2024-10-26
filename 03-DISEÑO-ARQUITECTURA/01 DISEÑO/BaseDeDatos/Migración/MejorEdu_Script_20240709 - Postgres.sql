-- SQLINES DEMO *** rated by MySQL Workbench
-- SQLINES DEMO *** 44 2024
-- SQLINES DEMO ***    Version: 1.0
-- SQLINES DEMO *** orward Engineering

/* SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0; */
/* SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0; */
/* SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'; */

-- SQLINES DEMO *** ------------------------------------
-- Sc... SQLINES DEMO ***
-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** ------------------------------------
-- Sc... SQLINES DEMO ***
-- SQLINES DEMO *** ------------------------------------

-- SQLINES DEMO *** ------------------------------------
-- Sc... SQLINES DEMO ***
-- SQLINES DEMO *** ------------------------------------
CREATE SCHEMA IF NOT EXISTS mejoreduDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
SET SCHEMA 'mejoreduDB' ;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`seg_tipo_usuario`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.seg_tipo_usuario (
  id_tipo_usuario INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador de tipo de usuario',
  cd_tipo_usuario VARCHAR(45) NOT NULL COMMENT 'Descripción del tipo de usuario\n',
  cs_estatus VARCHAR(1) NOT NULL DEFAULT 'A' COMMENT 'Clave del estatus que guarda el registro de tipo de usuario\nI Inactivo\nA Activo\nB Bloqueado',
  id_bitacora INT NOT NULL COMMENT 'Identificador del registro con el fin de manejar la auditoria del dato y su historico de cambios, relacionada con la tabla bit_registro',
  LOCK_FLAG INT NULL DEFAULT NULL,
  PRIMARY KEY (id_tipo_usuario))
;

ALTER SEQUENCE mejoreduDB.seg_tipo_usuario_seq RESTART WITH 13;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`seg_usuario`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.seg_usuario (
  cve_usuario VARCHAR(45) NOT NULL COMMENT ''Clave del usuario corresponde al userName del DA'',
  cs_estatus VARCHAR(1) NOT NULL COMMENT 'Clave del estatus del usuario, relacionada con la tabla de seg_estatus',
  df_baja DATE NULL DEFAULT NULL COMMENT 'Fecha de baja del usuario, nulo si es activo',
  id_tipo_usuario INT NOT NULL COMMENT 'Tipo de usuario, relacionado con la tabla de seg_tipo_usuario',
  LOCK_FLAG INT NULL DEFAULT NULL,
  PRIMARY KEY (cve_usuario),
  CONSTRAINT fk_seg_usuario_seg_tipo_usuario1
    FOREIGN KEY (id_tipo_usuario)
    REFERENCES mejoreduDB.seg_tipo_usuario (id_tipo_usuario))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_seg_usuario_tipo_usuario_idx ON mejoreduDB.seg_usuario (id_tipo_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`bit_registro`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.bit_registro (
  id_registro INT NOT NULL COMMENT 'Identificador el registro autoincrementable con el fin de manejar el historico de cambios de la información del sistema, tendremos tipo de registro, cambio, fecha y hora, y usuario',
  df_registro TIMESTAMP(0) NOT NULL COMMENT 'Fecha y hora del evento de registro',
  cd_tabla_alterada VARCHAR(45) NOT NULL,
  cd_campos_alterados VARCHAR(2000) NOT NULL,
  cx_valoranteriorB64 VARCHAR(4000) NOT NULL,
  cx_valornuevoB64 VARCHAR(4000) NOT NULL,
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que realiza el cambio',
  LOCK_FLAG INT NULL DEFAULT NULL,
  PRIMARY KEY (id_registro),
  CONSTRAINT fk_bit_registro_seg_usuario
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_bit_registro_seg_usuario_idx ON mejoreduDB.bit_registro (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`cat_master_catalogo`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.cat_master_catalogo (
  id_catalogo INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador de la opción del catalogo',
  cd_opcion VARCHAR(500) NOT NULL COMMENT 'Descripción de la opción del catálogo por ejemplo un catalago de pais la descripción será México\\n',
  cc_externa VARCHAR(45) NULL DEFAULT NULL COMMENT 'Clave del catalogo como lo conoce negocio, por ejemplo pais opción mexico, la clave externa es MX',
  df_baja DATE NULL DEFAULT NULL COMMENT 'Fecha de baja del registro, si existe info significa que no está activo el registro, si es nulo el registro está activo',
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que afecta el registro se relaciona con la tabla seg_usuario',
  id_catalogo_padre INT NULL DEFAULT NULL COMMENT 'Identificador del catalogo que permite conocer el catálogo padre',
  cd_descripcionDos VARCHAR(500) NULL DEFAULT NULL COMMENT 'Descripción Dos de la opción del catalogo',
  cc_externaDos VARCHAR(45) NULL DEFAULT NULL COMMENT 'Clave de la descripción dos del catalogo',
  LOCK_FLAG INT NULL DEFAULT NULL COMMENT 'Identificador de control en transacciones concurrentes en contenedores',
  ix_dependencia INT NULL DEFAULT NULL COMMENT 'Identificador del catalogo al que guarda dependencia,',
  id_validar INT NULL DEFAULT NULL COMMENT 'Identificador de la validación o revisión realizada en Objetivos, Estrategias y Acciones, ralacionada con la tabla met_validacion',
  id_validacion_planeacion INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada al apartado, realizado por el rol de usuario Planificación, relacionada con la tabla met_validación.',
  id_validacion_supervisor INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada, realizado por el rol de usuario Supervisor, relacionada con la tabla met_validación.',
  PRIMARY KEY (id_catalogo),
  CONSTRAINT fk_cat_catalogo
    FOREIGN KEY (id_catalogo_padre)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_cat_seg_usuario
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.cat_master_catalogo_seq RESTART WITH 92916;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_cat_seg_usuario_idx ON mejoreduDB.cat_master_catalogo (cve_usuario ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_cat_catalogo_idx ON mejoreduDB.cat_master_catalogo (id_catalogo_padre ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_solicitud`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_solicitud (
  id_solicitud INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador de la solicitud automatico secuencial',
  cve_folio_solicitud VARCHAR(45) NULL DEFAULT NULL COMMENT 'Clave que representa el folio de la solicitud',
  cve_folio_SIF VARCHAR(15) NULL DEFAULT NULL COMMENT 'Clave que representa el folio SIF',
  df_solicitud DATE NULL DEFAULT NULL COMMENT 'Fecha en la que se genera la solicitud',
  dh_solicitud TIME(0) NULL DEFAULT NULL COMMENT 'Hora en la que se genera la solicitud',
  df_autorizacion DATE NULL DEFAULT NULL COMMENT 'Fecha en la que se autoriza la solicitud',
  id_catalogo_direccion INT NULL DEFAULT NULL COMMENT 'Identificador que representa la dirección asociada a la solicitud, relacionada con la tabla cat_master_catalogo por id_catalogo_padre igual a',
  id_catalogo_unidad INT NULL DEFAULT NULL COMMENT 'Identificador que representa la unidad administrativa, relacionada con la tabla cat_master_catalogo por id_catalogo_padre igual a',
  id_catalogo_anhio INT NULL DEFAULT NULL COMMENT 'Identificador que representa el año del ejercicio, relacionada con la tabla cat_master_catalogo por id_catalogo_padre igual a',
  id_catalogo_adecuacion INT NULL DEFAULT NULL COMMENT 'Identificador que representa el tipo de adecuación relacionada con la tabla cat_master_catalogo por id_catalogo_padre igual a',
  id_catalogo_modificacion INT NULL DEFAULT NULL COMMENT 'Identificador que representa el tipo de adecuación, relacionada con la tabla cat_master_catalogo por id_catalogo_padre igual a',
  id_catalogo_estatus INT NOT NULL COMMENT 'Identificador que representa el último estatus de la solicitud, relacionada con la tabla cat_master_catalogo por id_catalogo_padre igual a\\n\\nEstatus de la solicitud donde 1=Preregistro, 2=Registrada, 3=En revisión,4=Rechazada, 5=Revisada, 6=Formalizada,7=Rublica, 8=Aprobada, 9=Aprobación cambio de MIR, (11,12,13= 1,2,3 Ciclo de revisión), HACER UN CATALOGO Llamado Catálogo de Estatus de la solicitud',
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que realiza el registro de la solicitud',
  ix_monto_aplicacion DOUBLE PRECISION NULL DEFAULT NULL,
  cx_justificacion VARCHAR(1000) NULL DEFAULT NULL COMMENT 'Descripción abierta alfanumerica con la justificación de la adecuación',
  cx_objetivo VARCHAR(2000) NULL DEFAULT NULL COMMENT 'Descripción abierta alfanumerica con el objetivo de la adecuación',
  ix_folio_secuencia INT NULL DEFAULT NULL COMMENT 'Secuencia del folio por unidad administrativa, se calcula este valor más 1 considerando la UA',
  cx_uuid VARCHAR(45) NULL DEFAULT NULL COMMENT 'UUID del formato lleno de la solicitud, mismo que es creado desde un jasper con salida de información que se tiene hasta el momento de consulta en revisión de la adecuación',
  id_estatus_planeacion INT NULL DEFAULT NULL,
  PRIMARY KEY (id_solicitud),
  CONSTRAINT fk_met_solicitud_cat_master_catalogo1
    FOREIGN KEY (id_catalogo_unidad)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_solicitud_cat_master_catalogo2
    FOREIGN KEY (id_catalogo_anhio)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_solicitud_cat_master_catalogo3
    FOREIGN KEY (id_catalogo_adecuacion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_solicitud_cat_master_catalogo4
    FOREIGN KEY (id_catalogo_modificacion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_solicitud_cat_master_catalogo5
    FOREIGN KEY (id_catalogo_estatus)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_solicitud_cat_master_catalogo6
    FOREIGN KEY (id_catalogo_direccion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_solicitud_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_solicitud_seq RESTART WITH 594;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_cat_master_catalogo1_idx ON mejoreduDB.met_solicitud (id_catalogo_unidad ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_cat_master_catalogo2_idx ON mejoreduDB.met_solicitud (id_catalogo_anhio ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_cat_master_catalogo3_idx ON mejoreduDB.met_solicitud (id_catalogo_adecuacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_cat_master_catalogo4_idx ON mejoreduDB.met_solicitud (id_catalogo_modificacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_cat_master_catalogo5_idx ON mejoreduDB.met_solicitud (id_catalogo_estatus ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_seg_usuario1_idx ON mejoreduDB.met_solicitud (cve_usuario ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_cat_master_catalogo6_idx ON mejoreduDB.met_solicitud (id_catalogo_direccion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_cat_master_catal_pla_idx ON mejoreduDB.met_solicitud (id_estatus_planeacion ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`meh_solicitud`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.meh_solicitud (
  id_historico_solicitud INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_solicitud INT NULL DEFAULT NULL COMMENT 'Identificador de la socitud que se registrará el historico, y controlar los diferenes cambios de estatus, relación con la tabla met_solicitud',
  id_catalogo_estatus INT NOT NULL COMMENT 'Identificador del estatus que guarda el historico, relacionado con la tabla cat_master_catalogo',
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que realiza el cambio de estatus, relacionada con la tabla seg_usuario',
  df_solicitud DATE NULL DEFAULT NULL,
  dh_solicitud TIME(0) NULL DEFAULT NULL,
  PRIMARY KEY (id_historico_solicitud),
  CONSTRAINT fk_meh_solicitud_cat_master_catalogo1
    FOREIGN KEY (id_catalogo_estatus)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_meh_solicitud_met_solicitud1
    FOREIGN KEY (id_solicitud)
    REFERENCES mejoreduDB.met_solicitud (id_solicitud),
  CONSTRAINT fk_meh_solicitud_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.meh_solicitud_seq RESTART WITH 759;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_meh_solicitud_met_solicitud1_idx ON mejoreduDB.meh_solicitud (id_solicitud ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_meh_solicitud_cat_master_catalogo1_idx ON mejoreduDB.meh_solicitud (id_catalogo_estatus ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_meh_solicitud_seg_usuario1_idx ON mejoreduDB.meh_solicitud (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_M001`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_M001 (
  id_M001 INT NOT NULL COMMENT 'identificador de acceco al la planeacion presupuestal M001',
  cx_nombre_documento VARCHAR(45) NOT NULL COMMENT 'Campo que almacena el nombre del documento que se presentara en la tabla del plan presupuestal M001',
  df_fecha_carga DATE NOT NULL COMMENT 'Campo que almacena la fecha de carga del Documento',
  cs_carga_documento VARCHAR(45) NOT NULL COMMENT 'Campo que almacena el estatus del documento',
  cx_diagnostico VARCHAR(45) NOT NULL COMMENT 'Campo que almacena el diagnostico',
  cx_Ficha_Desempenhio_fid VARCHAR(45) NOT NULL COMMENT 'Campo que almacena la ficha de desempeño FID generada',
  PRIMARY KEY (id_M001))
;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_anho_planeacion`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_anho_planeacion (
  id_anhio INT NOT NULL COMMENT 'Identificador del año de planeación de entrada se cargan los 5 ultimos años y el vigente',
  cs_estatus VARCHAR(1) NOT NULL COMMENT 'Estatus que guarda el año, Activo y vigente = A, Inactivo = I',
  df_baja DATE NULL DEFAULT NULL COMMENT 'Fecha de baja del año, no está activo para consultar',
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que realiza el ajuste(ABCM) en años posibles de planeación',
  PRIMARY KEY (id_anhio),
  CONSTRAINT fk_met_anho_planeacion_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE UNIQUE INDEX id_anhio_UNIQUE ON mejoreduDB.met_anho_planeacion (id_anhio ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_anho_planeacion_seg_usuario1_idx ON mejoreduDB.met_anho_planeacion (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_ficha_indicadores`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_ficha_indicadores (
  id_ficha_indicadores INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  cx_nombre_indicador VARCHAR(120) NULL DEFAULT NULL,
  id_dimension INT NULL DEFAULT NULL,
  id_tipo_indicador INT NULL DEFAULT NULL,
  cx_definicion_indicador VARCHAR(120) NULL DEFAULT NULL,
  cx_metodo_calculo_indicador VARCHAR(120) NULL DEFAULT NULL,
  id_unidad_medida INT NULL DEFAULT NULL,
  cx_describir_unidad_medida VARCHAR(120) NULL DEFAULT NULL,
  cx_unidad_absoluta VARCHAR(120) NULL DEFAULT NULL,
  id_tipo_medicion INT NULL DEFAULT NULL,
  cx_describir_tipo_medicion VARCHAR(120) NULL DEFAULT NULL,
  id_frecuencia_medicion INT NULL DEFAULT NULL,
  cx_describir_frecuencia_medicion VARCHAR(120) NULL DEFAULT NULL,
  cx_numerador VARCHAR(120) NULL DEFAULT NULL,
  cx_denominador VARCHAR(120) NULL DEFAULT NULL,
  cx_meta VARCHAR(120) NULL DEFAULT NULL,
  cx_valor_base VARCHAR(120) NULL DEFAULT NULL,
  id_anhio_base INT NULL DEFAULT NULL,
  cx_periodo_base VARCHAR(120) NULL DEFAULT NULL,
  cx_valor_meta VARCHAR(120) NULL DEFAULT NULL,
  id_anhio_meta INT NULL DEFAULT NULL,
  cx_periodo_meta VARCHAR(120) NULL DEFAULT NULL,
  cx_medio_verificacion VARCHAR(120) NULL DEFAULT NULL,
  cx_nombre_variable VARCHAR(120) NULL DEFAULT NULL,
  cx_descripcion_variable VARCHAR(120) NULL DEFAULT NULL,
  cx_fuente_informacion VARCHAR(500) NULL DEFAULT NULL,
  cx_unidad_medida VARCHAR(500) NULL DEFAULT NULL,
  cx_frecuencia_medicion VARCHAR(500) NULL DEFAULT NULL,
  cx_metodo_recoleccion VARCHAR(500) NULL DEFAULT NULL,
  id_comportamiento_indicador INT NULL DEFAULT NULL,
  id_comportamiento_medicion INT NULL DEFAULT NULL,
  id_tipo_valor INT NULL DEFAULT NULL,
  id_desagregacion_geografica INT NULL DEFAULT NULL,
  cx_descripcion_vinculacion VARCHAR(500) NULL DEFAULT NULL,
  id_validacion INT NULL DEFAULT NULL,
  id_validacion_planeacion INT NULL DEFAULT NULL,
  id_validacion_supervisor INT NULL DEFAULT NULL,
  PRIMARY KEY (id_ficha_indicadores),
  CONSTRAINT fk_met_ficha_indicadores_cat_master_catalogo1
    FOREIGN KEY (id_dimension)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_ficha_indicadores_cat_master_catalogo2
    FOREIGN KEY (id_tipo_indicador)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_ficha_indicadores_cat_master_catalogo3
    FOREIGN KEY (id_unidad_medida)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_ficha_indicadores_cat_master_catalogo4
    FOREIGN KEY (id_tipo_medicion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_ficha_indicadores_cat_master_catalogo5
    FOREIGN KEY (id_frecuencia_medicion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_ficha_indicadores_cat_master_catalogo6
    FOREIGN KEY (id_comportamiento_indicador)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_ficha_indicadores_cat_master_catalogo7
    FOREIGN KEY (id_comportamiento_medicion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_ficha_indicadores_cat_master_catalogo8
    FOREIGN KEY (id_tipo_valor)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_ficha_indicadores_cat_master_catalogo9
    FOREIGN KEY (id_desagregacion_geografica)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_ficha_indicadores_met_anho_planeacion1
    FOREIGN KEY (id_anhio_base)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio),
  CONSTRAINT fk_met_ficha_indicadores_met_anho_planeacion2
    FOREIGN KEY (id_anhio_meta)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio))
;

ALTER SEQUENCE mejoreduDB.met_ficha_indicadores_seq RESTART WITH 89;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_ficha_indicadores_cat_master_catalogo1_idx ON mejoreduDB.met_ficha_indicadores (id_dimension ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_ficha_indicadores_cat_master_catalogo2_idx ON mejoreduDB.met_ficha_indicadores (id_tipo_indicador ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_ficha_indicadores_cat_master_catalogo3_idx ON mejoreduDB.met_ficha_indicadores (id_unidad_medida ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_ficha_indicadores_cat_master_catalogo4_idx ON mejoreduDB.met_ficha_indicadores (id_tipo_medicion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_ficha_indicadores_cat_master_catalogo5_idx ON mejoreduDB.met_ficha_indicadores (id_frecuencia_medicion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_ficha_indicadores_met_anho_planeacion1_idx ON mejoreduDB.met_ficha_indicadores (id_anhio_base ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_ficha_indicadores_met_anho_planeacion2_idx ON mejoreduDB.met_ficha_indicadores (id_anhio_meta ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_ficha_indicadores_cat_master_catalogo6_idx ON mejoreduDB.met_ficha_indicadores (id_comportamiento_indicador ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_ficha_indicadores_cat_master_catalogo7_idx ON mejoreduDB.met_ficha_indicadores (id_comportamiento_medicion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_ficha_indicadores_cat_master_catalogo8_idx ON mejoreduDB.met_ficha_indicadores (id_tipo_valor ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_ficha_indicadores_cat_master_catalogo9_idx ON mejoreduDB.met_ficha_indicadores (id_desagregacion_geografica ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_MIR`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_MIR (
  id_MIR_ficha INT NOT NULL COMMENT 'identificador del registro MIR_ficha de la tabla met_presupuestal_MIR_ficha',
  cx_nivel VARCHAR(45) NOT NULL COMMENT 'Campo nivel, en esta columna se mostrará un tipo de nivel y se ajustará según la cantidad de niveles identificados en el árbol de objetivos (fin, propósito, componente y actividades).\n',
  cx_resumen_narrativo VARCHAR(100) NOT NULL COMMENT 'Campo Resumen Narrativo, en estos campos se describen los cuatro niveles de objetivos (fin, propósito, componente y actividades).\n\nSe deberán visualizar los textos obtenidos en el árbol de objetivos, donde se recuperará el texto señalado y mostrado en el árbol en color azul como fin, para el propósito el texto en verde, para componentes el texto en morado y para actividades el texto en color rosa. ',
  cx_nombre_indicador VARCHAR(100) NOT NULL COMMENT 'Campo Indicador, en estos campos el usuario expresará los conceptos relevantes a medir de cada uno de los cuatro niveles de objetivos en forma de indicadores.\n',
  cx_medios_verificacion VARCHAR(200) NOT NULL COMMENT 'Campo Medios de Verificación, en estos campos el usuario ingresará las fuentes de información para el cálculo y monitoreo de los indicadores. ',
  cx_supuestos VARCHAR(350) NOT NULL COMMENT 'Campo Supuestos, son los factores externos o situaciones ajenas al programa que deben cumplirse para el logro del objetivo del programa y para cada componente se deberá poder capturar el campo “supuesto',
  cx_opcion_FI VARCHAR(45) NULL DEFAULT NULL,
  id_ficha_indicadores INT NOT NULL,
  PRIMARY KEY (id_MIR_ficha),
  CONSTRAINT fk_met_MIR_met_ficha_indicadores1
    FOREIGN KEY (id_ficha_indicadores)
    REFERENCES mejoreduDB.met_ficha_indicadores (id_ficha_indicadores))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_MIR_met_ficha_indicadores1_idx ON mejoreduDB.met_MIR (id_ficha_indicadores ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_validacion`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_validacion (
  id_validacion INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'identificador de registro para la tabla met_validacion\n',
  df_validacion DATE NULL DEFAULT NULL COMMENT 'Fecha de Validacion ',
  dh_validacion TIME(0) NULL DEFAULT NULL COMMENT 'hora de la validacion',
  cve_usuario_registra VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que registra la validación (CP rol presupuesto), relacion con tabla seg_usuario',
  ix_ciclo INT NULL DEFAULT NULL COMMENT 'Maximo 3 ciclos',
  cs_estatus VARCHAR(1) NULL DEFAULT NULL COMMENT '1 = 1er Revisión, 2 2da Revisión, T=Terminado, P=Por revisar, E = En validación',
  cve_usuario_actualiza VARCHAR(45) NULL DEFAULT NULL COMMENT 'Usuario que registra la validación con rol de planeación, (relación con tabla seg_usuario)',
  PRIMARY KEY (id_validacion),
  CONSTRAINT fk_met_validacion_seg_usuario1
    FOREIGN KEY (cve_usuario_registra)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario),
  CONSTRAINT fk_met_validacion_seg_usuario2
    FOREIGN KEY (cve_usuario_actualiza)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_validacion_seq RESTART WITH 1011;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_validacion_seg_usuario1_idx ON mejoreduDB.met_validacion (cve_usuario_registra ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_validacion_seg_usuario2_idx ON mejoreduDB.met_validacion (cve_usuario_actualiza ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_tipo_documento`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_tipo_documento (
  id_tipo_documento INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador del documento, secuencial numérico y único',
  cd_tipo_documento VARCHAR(45) NOT NULL COMMENT 'Descripción del tipo de documento',
  cx_extension VARCHAR(45) NOT NULL COMMENT 'Extensión del archivo que puede ser PDF, Imagen (jpg, gif, png) , Video(mp4, mov)',
  cx_tipo_contenido VARCHAR(45) NULL DEFAULT NULL COMMENT 'Descripción técnica del contenido del archivo por ejemplo',
  PRIMARY KEY (id_tipo_documento))
;

ALTER SEQUENCE mejoreduDB.met_tipo_documento_seq RESTART WITH 9;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_archivo`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_archivo (
  id_archivo INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'identificador archivo para BD',
  cx_nombre VARCHAR(45) NULL DEFAULT NULL COMMENT 'Nombre del archivo sin extensión, debido que la extensión tiene su propio atributo',
  cx_uuid VARCHAR(45) NOT NULL COMMENT 'UUID del archivo registrado en el Gestor documental Alfresco',
  id_tipo_documento INT NOT NULL COMMENT 'Identificador del tipo de documento, atributo relacionado con la tabla met_tipo_documento',
  df_fecha_carga DATE NOT NULL COMMENT 'Fecha del momento en que se carga el archivo',
  dh_hora_carga TIME(0) NOT NULL COMMENT 'Hora de momento en que se carga el archivo',
  cs_estatus VARCHAR(1) NOT NULL COMMENT 'Clave de estatus que guarda el archivo A=Activo. B=Dado de baja',
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que registra el archivo, referencia con la tabla seg_usuario',
  cx_uuid_toPDF VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (id_archivo),
  CONSTRAINT fk_met_archivo_met_tipo_documento1
    FOREIGN KEY (id_tipo_documento)
    REFERENCES mejoreduDB.met_tipo_documento (id_tipo_documento),
  CONSTRAINT fk_met_archivo_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_archivo_seq RESTART WITH 1748;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_archivo_met_tipo_documento1_idx ON mejoreduDB.met_archivo (id_tipo_documento ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_archivo_seg_usuario1_idx ON mejoreduDB.met_archivo (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_cortoplazo_proyecto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_cortoplazo_proyecto (
  id_proyecto INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'identificador de un proyecto de la tabla met_cortoplazo_proyecto',
  cve_proyecto INT NOT NULL COMMENT 'campo que almacena la clave asociada a un proyecto',
  cx_nombre_proyecto VARCHAR(2000) NOT NULL COMMENT 'campo que almacena el nombre del proyecto',
  cx_objetivo VARCHAR(2000) NOT NULL COMMENT 'campo que almacena el objetivo de un proyecto',
  cx_objetivo_prioritario VARCHAR(2000) NULL DEFAULT NULL COMMENT 'campo que almacena el objetivo prioritario del proyecto',
  cve_usuario VARCHAR(45) NULL DEFAULT NULL COMMENT 'Clave del usuario que registra el proyecto en el año indicado, referencia con la tabla seg_usuario',
  id_anhio INT NULL DEFAULT NULL COMMENT 'Identificador del año en que será registrado el proyecto, refencia con la tabla met_anho_planeacion',
  df_proyecto DATE NULL DEFAULT NULL COMMENT 'Fecha en que se registra el proyecto',
  dh_proyecto TIME(0) NULL DEFAULT NULL COMMENT 'Hora en que se registra el proyecto',
  cs_estatus VARCHAR(1) NULL DEFAULT NULL COMMENT 'Estatus del proyecto A = Activo, B = Dado de baja ',
  id_archivo INT NULL DEFAULT NULL COMMENT 'identificador del archivo cargado donde se guarda el documento analitico, referencia con la tabla de met_archivo',
  cx_nombre_unidad VARCHAR(90) NULL DEFAULT NULL,
  cx_alcance VARCHAR(2000) NULL DEFAULT NULL,
  cx_fundamentacion VARCHAR(2000) NULL DEFAULT NULL,
  LOCK_FLAG INT NULL DEFAULT NULL COMMENT 'Bandera de protección transaccional de microservicios dockerizados',
  cve_unidad VARCHAR(45) NULL DEFAULT NULL COMMENT 'Clave de la unidad administrativa',
  ix_fuente_registro INT NULL DEFAULT '0' COMMENT 'Tipificador para conocer la fuente de información 1=Desde Carga de proyecto, 0=Registro de info desde el formulario.',
  df_actualizacion DATE NULL DEFAULT NULL COMMENT 'Fecha de actualización del información del proyecto',
  dh_actualizacion TIME(0) NULL DEFAULT NULL COMMENT 'Hora de actualización del información del proyecto',
  cve_usuario_actualiza VARCHAR(45) NULL DEFAULT NULL COMMENT 'Clave del usuario que actualiza la información',
  id_validacion INT NULL DEFAULT NULL COMMENT 'Identificador de la  revisión realizada en corto plazo proyectos, relacionada con la tabla met_validacion',
  id_validacion_planeacion INT NULL DEFAULT NULL,
  id_validacion_supervisor INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada, realizado por el rol de usuario Supervisor, relacionada con la tabla met_validación',
  id_catalogo_unidad INT NULL DEFAULT NULL COMMENT 'Identificador de la unidad administrativa asociada al proyecto, referencia con la tabla cat_master_catalogo.',
  it_semantica INT NULL DEFAULT '1' COMMENT 'Tipificador o semantica del proyecto, el sentido que daremos a la información 1 = Registro de proyecto 2 = Solicitud del proyecto. Por defecto es valor igual a 1 será interpretado como un registro por el modulo de planeación',
  ix_accion INT NULL DEFAULT '1' COMMENT 'REalación al catalogo de Tipo de Modificación que define la acción, tipo de modificación o motivo asociada al registro del proyecto, donde el valor del tipo de modificación será tomado del catalogo de mismo nombre. Donde 1 es igual a Alta',
  ix_cicloValidacion INT NULL DEFAULT '0' COMMENT 'Incremental por ciclo de revisión con algún comentario en cualquier rol del sisteme, en caso de ser mayor de 3, será cancelado el proyecto',
  id_espejo INT NULL DEFAULT NULL COMMENT 'Identificador del proyecto, que será asociado al proyecto clonado por una solicitud, es una relación recursiva a met_cortoplazo_proyecto',
  PRIMARY KEY (id_proyecto),
  CONSTRAINT fk_met_cortoplazo_proyecto_met_anho_planeacion1
    FOREIGN KEY (id_anhio)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio),
  CONSTRAINT fk_met_cortoplazo_proyecto_met_archivo1
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT fk_met_cortoplazo_proyecto_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario),
  CONSTRAINT FKlhgrx3lmxbnnr3y1x64iwh44
    FOREIGN KEY (id_catalogo_unidad)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo))
;

ALTER SEQUENCE mejoreduDB.met_cortoplazo_proyecto_seq RESTART WITH 986;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_proyecto_seg_usuario1_idx ON mejoreduDB.met_cortoplazo_proyecto (cve_usuario ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_proyecto_met_anho_planeacion1_idx ON mejoreduDB.met_cortoplazo_proyecto (id_anhio ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_proyecto_met_archivo1_idx ON mejoreduDB.met_cortoplazo_proyecto (id_archivo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_proyecto_seg_usuario2_idx ON mejoreduDB.met_cortoplazo_proyecto (cve_usuario_actualiza ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_proyecto_met_validacion2_idx ON mejoreduDB.met_cortoplazo_proyecto (id_validacion_planeacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_proyecto_met_validacion3_idx ON mejoreduDB.met_cortoplazo_proyecto (id_validacion_supervisor ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_master_catalogo_idx ON mejoreduDB.met_cortoplazo_proyecto (id_catalogo_unidad ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_proyecto_met_cortoplazo_proyecto1_idx ON mejoreduDB.met_cortoplazo_proyecto (id_espejo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_cortoplazo_actividad`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_cortoplazo_actividad (
  id_actividad INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'indentificador de una actividad en la tabla met_cortoplazo_actividades',
  cve_actividad INT NOT NULL COMMENT 'campo que almacena la clave asociada a una actividad',
  cx_nombre_actividad VARCHAR(200) NULL DEFAULT NULL,
  cx_descripcion VARCHAR(600) NULL DEFAULT NULL COMMENT 'campo que almacena la descripcion de la actividad ',
  cx_articulacion_actividad VARCHAR(2000) NULL DEFAULT NULL,
  cb_actividad_interunidades VARCHAR(70) NULL DEFAULT NULL COMMENT 'campo que almacena la accion transversal que se asocie a la actividad',
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'clave que identifica a un usuario, se relaciona con la tabla seg_usuario',
  df_actividad DATE NULL DEFAULT NULL COMMENT 'campo que almacena la fecha de registro de la actividad',
  dh_actividad TIME(0) NULL DEFAULT NULL COMMENT 'campo que almacena la hora de registro de la actividad',
  id_proyecto INT NOT NULL COMMENT 'Identidad del proyecto asociada a la actividad, relacionada con la tabla met_cortoplazo_proyecto',
  ic_actividad_transversal INT NULL DEFAULT NULL COMMENT 'Bandera para saber si requiere actividad transversal, 0 = no requiere 1 = Si requiere / palomeado',
  ix_requiere_reunion INT NULL DEFAULT NULL COMMENT 'Bandera para saber si requiere reuniones, 0 = no requiere 1 = Si requiere / palomeado',
  cx_tema VARCHAR(100) NULL DEFAULT NULL COMMENT 'Descripción del tema para la reunión',
  id_catalogo_alcance INT NULL DEFAULT NULL COMMENT 'Identificador del catalogo asociado al alcance',
  cx_lugar VARCHAR(100) NULL DEFAULT NULL COMMENT 'Descripción del lugar captura libre',
  cx_actores VARCHAR(300) NULL DEFAULT NULL COMMENT 'Descripcion de actores convocados a la reunión',
  cs_estatus VARCHAR(1) NULL DEFAULT NULL COMMENT 'Bandera para conocer el estado del registro A = Activo, B = Dado de baja borrado logico',
  id_validacion INT NULL DEFAULT NULL COMMENT 'Identificador de la  revisión realizada en corto plazo actividades, relacionada con la tabla met_validacion',
  id_validacion_planeacion INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada al apartado, realizado por el rol de usuario Planificación, relacionada con la tabla met_validación',
  id_validacion_supervisor INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada, realizado por el rol de usuario Supervisor, relacionada con la tabla met_validación',
  it_semantica INT NULL DEFAULT '1' COMMENT 'Tipificador o semantica de la actividad es el sentido que daremos a la información 1 = Registro de actividades 2 = Solicitud en apartado actividadSeguimiento . Por defecto es valor igual a 1 será interpretado como un registro por el modulo de planeación',
  ix_accion INT NULL DEFAULT '1',
  id_espejo INT NULL DEFAULT NULL COMMENT 'Identificador de la actividad que será asociado a la actividad clonada por una solicitud, es una relación recursiva a met_cortoplazo_actividad',
  PRIMARY KEY (id_actividad),
  CONSTRAINT fk_met_cortoplazo_actividad_cat_master_catalogo3
    FOREIGN KEY (id_catalogo_alcance)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cortoplazo_actividad_met_cortoplazo_actividad1
    FOREIGN KEY (id_espejo)
    REFERENCES mejoreduDB.met_cortoplazo_actividad (id_actividad),
  CONSTRAINT fk_met_cortoplazo_actividad_met_validacion1
    FOREIGN KEY (id_validacion)
    REFERENCES mejoreduDB.met_validacion (id_validacion),
  CONSTRAINT fk_met_cortoplazo_actividad_met_validacion2
    FOREIGN KEY (id_validacion_planeacion)
    REFERENCES mejoreduDB.met_validacion (id_validacion),
  CONSTRAINT fk_met_cortoplazo_actividad_met_validacion3
    FOREIGN KEY (id_validacion_supervisor)
    REFERENCES mejoreduDB.met_validacion (id_validacion),
  CONSTRAINT fk_met_cortoplazo_actividades_met_cortoplazo_proyecto1
    FOREIGN KEY (id_proyecto)
    REFERENCES mejoreduDB.met_cortoplazo_proyecto (id_proyecto),
  CONSTRAINT fk_met_cortoplazo_actividades_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_cortoplazo_actividad_seq RESTART WITH 1125;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_actividades_seg_usuario1_idx ON mejoreduDB.met_cortoplazo_actividad (cve_usuario ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_actividades_met_cortoplazo_proyecto1_idx ON mejoreduDB.met_cortoplazo_actividad (id_proyecto ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_actividad_cat_master_catalogo3_idx ON mejoreduDB.met_cortoplazo_actividad (id_catalogo_alcance ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_actividad_met_validacion1_idx ON mejoreduDB.met_cortoplazo_actividad (id_validacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_actividad_met_validacion2_idx ON mejoreduDB.met_cortoplazo_actividad (id_validacion_planeacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_actividad_met_validacion3_idx ON mejoreduDB.met_cortoplazo_actividad (id_validacion_supervisor ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_actividad_met_cortoplazo_actividad1_idx ON mejoreduDB.met_cortoplazo_actividad (id_espejo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_actividad_fechatentativa`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_actividad_fechatentativa (
  id_fecha_tentativa INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador secuencial automatico para diferenciar los meses de fecha tentativa',
  cid_catalogo_mes INT NOT NULL COMMENT 'Identificador del mes asociado a la fecha tentativa (Enero,Feb. Mzo, etc) relacionada con la tabla de master catalogos',
  id_actividad INT NOT NULL COMMENT 'Identificador de la actividad que se asocia el mes de fecha tentativa',
  PRIMARY KEY (id_fecha_tentativa),
  CONSTRAINT fk_met_actividad_fechatentativa_cat_master_catalogo1
    FOREIGN KEY (cid_catalogo_mes)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_actividad_fechatentativa_met_cortoplazo_actividad1
    FOREIGN KEY (id_actividad)
    REFERENCES mejoreduDB.met_cortoplazo_actividad (id_actividad))
;

ALTER SEQUENCE mejoreduDB.met_actividad_fechatentativa_seq RESTART WITH 376;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_actividad_fechatentativa_cat_master_catalogo1_idx ON mejoreduDB.met_actividad_fechatentativa (cid_catalogo_mes ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_actividad_fechatentativa_met_cortoplazo_actividad1_idx ON mejoreduDB.met_actividad_fechatentativa (id_actividad ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_adecuacion_solicitud`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_adecuacion_solicitud (
  id_adecuacion_solicitud INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador de la adecuación de la solicitud, auto secuencial',
  id_catalogo_modificacion INT NOT NULL COMMENT 'Identificador de tipo de modificación asociada a la adecuación',
  id_catalogo_apartado INT NOT NULL COMMENT 'Identificador del apartado a considerar en la adecuación, relacionado con la tabla cat_master_catalogo',
  id_solicitud INT NOT NULL COMMENT 'Identificador de la adeciónSolicitud, que permite identificar que acción ser realizará a cada solicitud, relacionada con la tabla met_solicitud',
  PRIMARY KEY (id_adecuacion_solicitud),
  CONSTRAINT fk_met_adecuacion_solicitud_cat_master_catalogo1
    FOREIGN KEY (id_catalogo_modificacion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_adecuacion_solicitud_cat_master_catalogo2
    FOREIGN KEY (id_catalogo_apartado)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo))
;

ALTER SEQUENCE mejoreduDB.met_adecuacion_solicitud_seq RESTART WITH 2598;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_solicitud_cat_master_catalogo1_idx ON mejoreduDB.met_adecuacion_solicitud (id_catalogo_modificacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_solicitud_cat_master_catalogo2_idx ON mejoreduDB.met_adecuacion_solicitud (id_catalogo_apartado ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_solicitud_met_solicitud1_idx ON mejoreduDB.met_adecuacion_solicitud (id_solicitud ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_justificacion_indicador`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_justificacion_indicador (
  id_justificacion_indicador INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  cx_causas VARCHAR(500) NULL DEFAULT NULL,
  cx_efectos VARCHAR(500) NULL DEFAULT NULL,
  cx_otros_motivos VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (id_justificacion_indicador))
;

ALTER SEQUENCE mejoreduDB.met_justificacion_indicador_seq RESTART WITH 5;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_cortoplazo_producto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_cortoplazo_producto (
  id_producto INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'identificador del producto en la tabla',
  cx_producto VARCHAR(50) NULL DEFAULT NULL COMMENT 'campo que almacena el tipo de producto',
  cx_nombre VARCHAR(1000) NULL DEFAULT NULL COMMENT 'Nombre de producto',
  cve_producto VARCHAR(12) NULL DEFAULT NULL COMMENT 'Clave almacenada del producto',
  cx_descripcion VARCHAR(600) NULL DEFAULT NULL COMMENT 'campo que almacena la descripcion del producto',
  cb_indicador_pl VARCHAR(45) NULL DEFAULT NULL COMMENT 'campo status que enlista el indicador Pl',
  cx_vinculacion_producto VARCHAR(600) NULL DEFAULT NULL COMMENT 'Vinculacion con diferentes productos asociados',
  cb_por_publicar VARCHAR(2) NULL DEFAULT NULL,
  cx_productos_vinculados_potic VARCHAR(1) NULL DEFAULT NULL COMMENT 'producto que esten directamente vinculados con POTIC',
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave de identificacion de un usuario, se relaciona con la tabla seg_usuario',
  df_producto DATE NULL DEFAULT NULL COMMENT 'Campo que almacena la fecha de registro del producto',
  dh_producto TIME(0) NULL DEFAULT NULL COMMENT 'Campo que almacena la hora de registro del producto',
  id_actividad INT NOT NULL,
  cs_estatus VARCHAR(1) NULL DEFAULT NULL COMMENT 'BAndera para manejar el estatus del registro A = Activo, B=Baja, I= Inactivo',
  id_catalogo_tipo_producto INT NULL DEFAULT NULL COMMENT 'identificador del tipo de producto asociado, referencia con tabla cat_master_catalogo',
  id_catalogo_indicador INT NULL DEFAULT NULL COMMENT 'identificador del indicadorMIR de producto asociado, referencia con tabla cat_master_catalogo',
  id_catalogo_nivel_educativo INT NULL DEFAULT NULL COMMENT 'identificador del nivel educativo asociado, referencia con tabla cat_master_catalogo',
  cx_cvenombre_potic VARCHAR(500) NULL DEFAULT NULL,
  LOCK_FLAG INT NULL DEFAULT NULL COMMENT 'Identificador transaccional del registro en contenedores',
  id_catalogo_categorizacion INT NULL DEFAULT NULL COMMENT 'Identificador de la catagorización del producto referencia con tabla de master_catalogo',
  id_catalogo_continuidad INT NULL DEFAULT NULL COMMENT 'Identificador de la continuidad con otros productos anteriores, relacion con la tabla de master_catalogo',
  id_catalogo_indicador_pl INT NULL DEFAULT NULL COMMENT 'Identificador del indicador PL asociado a la tabla de master catalgos',
  id_catalogo_anhio_pub INT NULL DEFAULT NULL COMMENT 'identificador del tipo de producto asociado,valor natural del año.',
  id_validacion INT NULL DEFAULT NULL COMMENT 'Identificador de la  revisión realizada en corto plazo productos, relacionada con la tabla met_validacion',
  id_validacion_planeacion INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada al apartado, realizado por el rol de usuario Planificación, relacionada con la tabla met_validación',
  id_validacion_supervisor INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada, realizado por el rol de usuario Supervisor, relacionada con la tabla met_validación',
  id_justificacion_mir INT NULL DEFAULT NULL,
  id_justificacion_pi INT NULL DEFAULT NULL,
  id_indicador_pi INT NULL DEFAULT NULL,
  PRIMARY KEY (id_producto),
  CONSTRAINT FK5cpyo6jlp8mf0iiwhcfpv8kwp
    FOREIGN KEY (id_justificacion_mir)
    REFERENCES mejoreduDB.met_justificacion_indicador (id_justificacion_indicador),
  CONSTRAINT fk_met_cortoplazo_producto_cat_master_catalogo1
    FOREIGN KEY (id_catalogo_tipo_producto)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cortoplazo_producto_cat_master_catalogo2
    FOREIGN KEY (id_catalogo_indicador)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cortoplazo_producto_cat_master_catalogo3
    FOREIGN KEY (id_catalogo_nivel_educativo)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cortoplazo_producto_cat_master_catalogo5
    FOREIGN KEY (id_catalogo_categorizacion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cortoplazo_producto_cat_master_catalogo6
    FOREIGN KEY (id_catalogo_continuidad)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cortoplazo_producto_cat_master_catalogo7
    FOREIGN KEY (id_catalogo_indicador_pl)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cortoplazo_producto_met_cortoplazo_actividad1
    FOREIGN KEY (id_actividad)
    REFERENCES mejoreduDB.met_cortoplazo_actividad (id_actividad),
  CONSTRAINT fk_met_cortoplazo_producto_met_validacion1
    FOREIGN KEY (id_validacion)
    REFERENCES mejoreduDB.met_validacion (id_validacion),
  CONSTRAINT fk_met_cortoplazo_producto_met_validacion2
    FOREIGN KEY (id_validacion_planeacion)
    REFERENCES mejoreduDB.met_validacion (id_validacion),
  CONSTRAINT fk_met_cortoplazo_producto_met_validacion3
    FOREIGN KEY (id_validacion_supervisor)
    REFERENCES mejoreduDB.met_validacion (id_validacion),
  CONSTRAINT fk_met_cortoplazo_productos_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario),
  CONSTRAINT FKcagim2boi76j0cxyo65px5qjj
    FOREIGN KEY (id_justificacion_pi)
    REFERENCES mejoreduDB.met_justificacion_indicador (id_justificacion_indicador))
;

ALTER SEQUENCE mejoreduDB.met_cortoplazo_producto_seq RESTART WITH 1162;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_productos_seg_usuario1_idx ON mejoreduDB.met_cortoplazo_producto (cve_usuario ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_producto_met_cortoplazo_actividad1_idx ON mejoreduDB.met_cortoplazo_producto (id_actividad ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_producto_cat_master_catalogo1_idx ON mejoreduDB.met_cortoplazo_producto (id_catalogo_tipo_producto ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_producto_cat_master_catalogo2_idx ON mejoreduDB.met_cortoplazo_producto (id_catalogo_indicador ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_producto_cat_master_catalogo3_idx ON mejoreduDB.met_cortoplazo_producto (id_catalogo_nivel_educativo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_producto_cat_master_catalogo5_idx ON mejoreduDB.met_cortoplazo_producto (id_catalogo_categorizacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_producto_cat_master_catalogo6_idx ON mejoreduDB.met_cortoplazo_producto (id_catalogo_continuidad ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_producto_cat_master_catalogo7_idx ON mejoreduDB.met_cortoplazo_producto (id_catalogo_indicador_pl ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_producto_met_validacion1_idx ON mejoreduDB.met_cortoplazo_producto (id_validacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_producto_met_validacion2_idx ON mejoreduDB.met_cortoplazo_producto (id_validacion_planeacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_producto_met_validacion3_idx ON mejoreduDB.met_cortoplazo_producto (id_validacion_supervisor ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX FK5cpyo6jlp8mf0iiwhcfpv8kwp ON mejoreduDB.met_cortoplazo_producto (id_justificacion_mir ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX FKcagim2boi76j0cxyo65px5qjj ON mejoreduDB.met_cortoplazo_producto (id_justificacion_pi ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_cortoplazo_presupuesto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_cortoplazo_presupuesto (
  id_presupuesto INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador de presupuesto de la tabla met_cortoplazo_presupuesto',
  cve_accion INT NULL DEFAULT NULL COMMENT 'campo que almacena la clave asociada al presupuesto',
  cx_nombre_accion TEXT NULL DEFAULT NULL COMMENT 'campo que almacena nombre de la accion que se asocia con el presupuesto',
  cve_nivel_educativo VARCHAR(50) NULL DEFAULT NULL COMMENT 'campo que almacena el nivel educativo asociado al presupuesto',
  cx_presupuesto_anual DOUBLE PRECISION NULL DEFAULT NULL,
  cb_productos_asociados VARCHAR(45) NULL DEFAULT NULL COMMENT 'lista desplegable concatenando la clave y nombre del producto que fueron registrados en el formulario anterior “Productos”.',
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'clave que esta asociada a un usuario, se relaciona con la tabla seg_usuario',
  df_presupuesto DATE NOT NULL COMMENT 'campo que almacena la fecha de registro del presupuesto',
  dh_presupuesto TIME(0) NOT NULL COMMENT 'campo que almacena la hora de registro del presupuesto',
  id_producto INT NOT NULL COMMENT 'Identificador del producto asociado al presupuesto, referencia con tabla met_Cortoplazo_producto',
  id_catalogo_centro_costo INT NULL DEFAULT NULL COMMENT 'Centro de costos, asociado al producto, referencia con el master catalogo',
  id_catalogo_fuente INT NULL DEFAULT NULL COMMENT 'Identificador de la fuente de financiamiento asociado al producto, referencia con la tabla master catalogo',
  cs_estatus VARCHAR(1) NULL DEFAULT NULL COMMENT 'Bandera para conocer el estatus A = Activo, B=Baja',
  id_validacion INT NULL DEFAULT NULL COMMENT 'Identificador de la validación o revisión realizada en corto plazo, ralacionada con la tabla met_validacion',
  id_validacion_planeacion INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada al apartado, realizado por el rol de usuario Planificación, relacionada con la tabla met_validación',
  id_validacion_supervisor INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada, realizado por el rol de usuario Supervisor, relacionada con la tabla met_validación.',
  cve_unidad VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (id_presupuesto),
  CONSTRAINT fk_met_cortoplazo_presupuesto_cat_master_catalogo1
    FOREIGN KEY (id_catalogo_centro_costo)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cortoplazo_presupuesto_cat_master_catalogo2
    FOREIGN KEY (id_catalogo_fuente)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cortoplazo_presupuesto_met_cortoplazo_producto1
    FOREIGN KEY (id_producto)
    REFERENCES mejoreduDB.met_cortoplazo_producto (id_producto),
  CONSTRAINT fk_met_cortoplazo_presupuesto_met_validacion1
    FOREIGN KEY (id_validacion)
    REFERENCES mejoreduDB.met_validacion (id_validacion),
  CONSTRAINT fk_met_cortoplazo_presupuesto_met_validacion2
    FOREIGN KEY (id_validacion_planeacion)
    REFERENCES mejoreduDB.met_validacion (id_validacion),
  CONSTRAINT fk_met_cortoplazo_presupuesto_met_validacion3
    FOREIGN KEY (id_validacion_supervisor)
    REFERENCES mejoreduDB.met_validacion (id_validacion),
  CONSTRAINT fk_met_cortoplazo_presupuesto_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_cortoplazo_presupuesto_seq RESTART WITH 1003;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_presupuesto_seg_usuario1_idx ON mejoreduDB.met_cortoplazo_presupuesto (cve_usuario ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_presupuesto_met_cortoplazo_producto1_idx ON mejoreduDB.met_cortoplazo_presupuesto (id_producto ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_presupuesto_cat_master_catalogo1_idx ON mejoreduDB.met_cortoplazo_presupuesto (id_catalogo_centro_costo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_presupuesto_cat_master_catalogo2_idx ON mejoreduDB.met_cortoplazo_presupuesto (id_catalogo_fuente ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_presupuesto_met_validacion1_idx ON mejoreduDB.met_cortoplazo_presupuesto (id_validacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_presupuesto_met_validacion2_idx ON mejoreduDB.met_cortoplazo_presupuesto (id_validacion_planeacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cortoplazo_presupuesto_met_validacion3_idx ON mejoreduDB.met_cortoplazo_presupuesto (id_validacion_supervisor ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_adecuacion_accion`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_adecuacion_accion (
  id_adecuacion_accion INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_adecuacion_solicitud INT NOT NULL,
  id_presupuesto_modificacion INT NULL DEFAULT NULL,
  id_presupuesto_referencia INT NULL DEFAULT NULL,
  PRIMARY KEY (id_adecuacion_accion),
  CONSTRAINT fk_met_adecuacion_accion_met_adecuacion_solicitud1
    FOREIGN KEY (id_adecuacion_solicitud)
    REFERENCES mejoreduDB.met_adecuacion_solicitud (id_adecuacion_solicitud),
  CONSTRAINT fk_met_adecuacion_accion_met_cortoplazo_presupuesto1
    FOREIGN KEY (id_presupuesto_modificacion)
    REFERENCES mejoreduDB.met_cortoplazo_presupuesto (id_presupuesto),
  CONSTRAINT fk_met_adecuacion_accion_met_cortoplazo_presupuesto2
    FOREIGN KEY (id_presupuesto_referencia)
    REFERENCES mejoreduDB.met_cortoplazo_presupuesto (id_presupuesto))
;

ALTER SEQUENCE mejoreduDB.met_adecuacion_accion_seq RESTART WITH 166;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_accion_met_adecuacion_solicitud1_idx ON mejoreduDB.met_adecuacion_accion (id_adecuacion_solicitud ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_accion_met_cortoplazo_presupuesto1_idx ON mejoreduDB.met_adecuacion_accion (id_presupuesto_modificacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_accion_met_cortoplazo_presupuesto2_idx ON mejoreduDB.met_adecuacion_accion (id_presupuesto_referencia ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_adecuacion_actividad`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_adecuacion_actividad (
  id_adecuacion_actividad INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_adecuacion_solicitud INT NOT NULL,
  id_actividad_modificacion INT NULL DEFAULT NULL,
  id_actividad_referencia INT NULL DEFAULT NULL,
  PRIMARY KEY (id_adecuacion_actividad),
  CONSTRAINT fk_met_adecuacion_actividad_met_adecuacion_solicitud1
    FOREIGN KEY (id_adecuacion_solicitud)
    REFERENCES mejoreduDB.met_adecuacion_solicitud (id_adecuacion_solicitud),
  CONSTRAINT fk_met_adecuacion_actividad_met_cortoplazo_actividad1
    FOREIGN KEY (id_actividad_modificacion)
    REFERENCES mejoreduDB.met_cortoplazo_actividad (id_actividad),
  CONSTRAINT fk_met_adecuacion_actividad_met_cortoplazo_actividad2
    FOREIGN KEY (id_actividad_referencia)
    REFERENCES mejoreduDB.met_cortoplazo_actividad (id_actividad))
;

ALTER SEQUENCE mejoreduDB.met_adecuacion_actividad_seq RESTART WITH 193;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_actividad_met_adecuacion_solicitud1_idx ON mejoreduDB.met_adecuacion_actividad (id_adecuacion_solicitud ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_actividad_met_cortoplazo_actividad1_idx ON mejoreduDB.met_adecuacion_actividad (id_actividad_modificacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_actividad_met_cortoplazo_actividad2_idx ON mejoreduDB.met_adecuacion_actividad (id_actividad_referencia ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_adecuacion_presupuesto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_adecuacion_presupuesto (
  id_adecuacion_presupuesto INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_adecuacion_solicitud INT NOT NULL,
  id_presupuesto_modificacion INT NULL DEFAULT NULL,
  id_presupuesto_referencia INT NULL DEFAULT NULL,
  id_presupuesto_referencia_b INT NULL DEFAULT NULL,
  PRIMARY KEY (id_adecuacion_presupuesto),
  CONSTRAINT fk_met_adecuacion_presupuesto_met_adecuacion_solicitud1
    FOREIGN KEY (id_adecuacion_solicitud)
    REFERENCES mejoreduDB.met_adecuacion_solicitud (id_adecuacion_solicitud),
  CONSTRAINT fk_met_adecuacion_presupuesto_met_cortoplazo_presupuesto1
    FOREIGN KEY (id_presupuesto_referencia)
    REFERENCES mejoreduDB.met_cortoplazo_presupuesto (id_presupuesto),
  CONSTRAINT fk_met_adecuacion_presupuesto_met_cortoplazo_presupuesto2
    FOREIGN KEY (id_presupuesto_modificacion)
    REFERENCES mejoreduDB.met_cortoplazo_presupuesto (id_presupuesto),
  CONSTRAINT fk_met_adecuacion_presupuesto_met_cortoplazo_presupuesto3
    FOREIGN KEY (id_presupuesto_referencia_b)
    REFERENCES mejoreduDB.met_cortoplazo_presupuesto (id_presupuesto))
;

ALTER SEQUENCE mejoreduDB.met_adecuacion_presupuesto_seq RESTART WITH 65;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_presupuesto_met_adecuacion_solicitud1_idx ON mejoreduDB.met_adecuacion_presupuesto (id_adecuacion_solicitud ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_presupuesto_met_cortoplazo_presupuesto1_idx ON mejoreduDB.met_adecuacion_presupuesto (id_presupuesto_referencia ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_presupuesto_met_cortoplazo_presupuesto2_idx ON mejoreduDB.met_adecuacion_presupuesto (id_presupuesto_modificacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_presupuesto_met_cortoplazo_presupuesto3_idx ON mejoreduDB.met_adecuacion_presupuesto (id_presupuesto_referencia_b ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_adecuacion_producto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_adecuacion_producto (
  id_adecuacion_producto INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_adecuacion_solicitud INT NOT NULL,
  id_producto_modificacion INT NULL DEFAULT NULL,
  id_producto_referencia INT NULL DEFAULT NULL,
  PRIMARY KEY (id_adecuacion_producto),
  CONSTRAINT fk_met_adecuacion_producto_met_adecuacion_solicitud1
    FOREIGN KEY (id_adecuacion_solicitud)
    REFERENCES mejoreduDB.met_adecuacion_solicitud (id_adecuacion_solicitud),
  CONSTRAINT fk_met_adecuacion_producto_met_cortoplazo_producto1
    FOREIGN KEY (id_producto_modificacion)
    REFERENCES mejoreduDB.met_cortoplazo_producto (id_producto),
  CONSTRAINT fk_met_adecuacion_producto_met_cortoplazo_producto2
    FOREIGN KEY (id_producto_referencia)
    REFERENCES mejoreduDB.met_cortoplazo_producto (id_producto))
;

ALTER SEQUENCE mejoreduDB.met_adecuacion_producto_seq RESTART WITH 205;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_producto_met_adecuacion_solicitud1_idx ON mejoreduDB.met_adecuacion_producto (id_adecuacion_solicitud ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_producto_met_cortoplazo_producto1_idx ON mejoreduDB.met_adecuacion_producto (id_producto_modificacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_producto_met_cortoplazo_producto2_idx ON mejoreduDB.met_adecuacion_producto (id_producto_referencia ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_adecuacion_proyecto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_adecuacion_proyecto (
  id_adecuacion_proyecto INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador de la relación unica entre la adecuación y los proyectos que serán incluidos en la solicitud',
  id_adecuacion_solicitud INT NOT NULL COMMENT 'Identificador de la adecuación de la solicitud, relacionada con la tabla met_adecuacion_proyecto',
  id_proyecto_modificacion INT NULL DEFAULT NULL,
  id_proyecto_referencia INT NULL DEFAULT NULL,
  PRIMARY KEY (id_adecuacion_proyecto),
  CONSTRAINT fk_met_adecuacion_proyecto_met_adecuacion_solicitud1
    FOREIGN KEY (id_adecuacion_solicitud)
    REFERENCES mejoreduDB.met_adecuacion_solicitud (id_adecuacion_solicitud),
  CONSTRAINT FKfn6bqsqmxmahahk3qidx06gyu
    FOREIGN KEY (id_proyecto_referencia)
    REFERENCES mejoreduDB.met_cortoplazo_proyecto (id_proyecto),
  CONSTRAINT FKl6xhi35uqentqu8yfv7qmkyux
    FOREIGN KEY (id_proyecto_modificacion)
    REFERENCES mejoreduDB.met_cortoplazo_proyecto (id_proyecto))
;

ALTER SEQUENCE mejoreduDB.met_adecuacion_proyecto_seq RESTART WITH 218;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_adecuacion_proyecto_met_adecuacion_solicitud1_idx ON mejoreduDB.met_adecuacion_proyecto (id_adecuacion_solicitud ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX FKl6xhi35uqentqu8yfv7qmkyux ON mejoreduDB.met_adecuacion_proyecto (id_proyecto_modificacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX FKfn6bqsqmxmahahk3qidx06gyu ON mejoreduDB.met_adecuacion_proyecto (id_proyecto_referencia ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_apartado`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_apartado (
  id_apartado INT NOT NULL,
  cx_nombre VARCHAR(100) NULL DEFAULT NULL COMMENT 'Nombre del campo del menu para validar que se almacenara',
  PRIMARY KEY (id_apartado))
;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_indicador_resultado`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_indicador_resultado (
  id_indicador_resultado INT CHECK (id_indicador_resultado > 0) NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_catalogo INT NOT NULL,
  cx_nivel VARCHAR(45) NULL DEFAULT NULL,
  cx_clave VARCHAR(45) NULL DEFAULT NULL,
  cx_nombre VARCHAR(500) NULL DEFAULT NULL,
  cx_resumen VARCHAR(500) NULL DEFAULT NULL,
  cx_medios VARCHAR(500) NULL DEFAULT NULL,
  cx_supuestos VARCHAR(500) NULL DEFAULT NULL,
  id_presupuestal INT NOT NULL,
  id_ficha_indicadores INT NULL DEFAULT NULL,
  id_validacion INT NULL DEFAULT NULL,
  id_validacion_planeacion INT NULL DEFAULT NULL,
  id_validacion_supervisor INT NULL DEFAULT NULL,
  PRIMARY KEY (id_indicador_resultado),
  CONSTRAINT fk_met_indicador_resultado_cat_master_catalogo1
    FOREIGN KEY (id_catalogo)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_indicador_resultado_met_ficha_indicadores1
    FOREIGN KEY (id_ficha_indicadores)
    REFERENCES mejoreduDB.met_ficha_indicadores (id_ficha_indicadores))
;

ALTER SEQUENCE mejoreduDB.met_indicador_resultado_seq RESTART WITH 371;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_indicador_resultado_cat_master_catalogo1_idx ON mejoreduDB.met_indicador_resultado (id_catalogo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_indicador_resultado_met_ficha_indicadores1_idx ON mejoreduDB.met_indicador_resultado (id_ficha_indicadores ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_arbol`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_arbol (
  id_arbol INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador del arbol de problemas de la tabla met_arbolproblema',
  cx_descripcion VARCHAR(2000) NULL DEFAULT NULL COMMENT 'Campo que almacenara la descripcion del elemento ',
  df_fecha_registro TIMESTAMP(0) NULL DEFAULT NULL,
  ix_tipo INT NULL DEFAULT NULL COMMENT '1 = Árbol del problema, 2 = Árbol de objetivos',
  id_presupuestal INT NOT NULL,
  id_archivo INT NULL DEFAULT NULL,
  id_validacion INT NULL DEFAULT NULL,
  id_validacion_planeacion INT NULL DEFAULT NULL,
  id_validacion_supervisor INT NULL DEFAULT NULL,
  id_indicador_resultado INT CHECK (id_indicador_resultado > 0) NULL DEFAULT NULL,
  PRIMARY KEY (id_arbol),
  CONSTRAINT FK98vjh9xdqi35pyukhw43y0do2
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT met_arbol_met_indicador_resultado_id_indicador_resultado_fk
    FOREIGN KEY (id_indicador_resultado)
    REFERENCES mejoreduDB.met_indicador_resultado (id_indicador_resultado)
    ON DELETE SET NULL
    ON UPDATE SET NULL)
;

ALTER SEQUENCE mejoreduDB.met_arbol_seq RESTART WITH 20;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX FK98vjh9xdqi35pyukhw43y0do2 ON mejoreduDB.met_arbol (id_archivo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX met_arbol_met_indicador_resultado_id_indicador_resultado_fk ON mejoreduDB.met_arbol (id_indicador_resultado ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_arbol_nodo`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_arbol_nodo (
  id_arbol_nodo INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_arbol INT NOT NULL,
  id_nodo_padre INT NULL DEFAULT NULL,
  cx_descripcion VARCHAR(500) NULL DEFAULT NULL,
  cx_clave VARCHAR(45) NULL DEFAULT NULL,
  ix_tipo INT NULL DEFAULT NULL COMMENT '1 = Componente, 2 = Actividad, 3 = Fin',
  id_indicador_resultado INT CHECK (id_indicador_resultado > 0) NULL DEFAULT NULL,
  id_espejo INT NULL DEFAULT NULL,
  PRIMARY KEY (id_arbol_nodo),
  CONSTRAINT fk_met_arbol_nodo_met_arbol_nodo1
    FOREIGN KEY (id_nodo_padre)
    REFERENCES mejoreduDB.met_arbol_nodo (id_arbol_nodo)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_met_arbol_nodo_met_arbol_nodo2
    FOREIGN KEY (id_espejo)
    REFERENCES mejoreduDB.met_arbol_nodo (id_arbol_nodo)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_met_arbol_nodo_met_arbolproblema1
    FOREIGN KEY (id_arbol)
    REFERENCES mejoreduDB.met_arbol (id_arbol),
  CONSTRAINT fk_met_arbol_nodo_met_indicador_resultado1
    FOREIGN KEY (id_indicador_resultado)
    REFERENCES mejoreduDB.met_indicador_resultado (id_indicador_resultado)
    ON DELETE SET NULL
    ON UPDATE SET NULL)
;

ALTER SEQUENCE mejoreduDB.met_arbol_nodo_seq RESTART WITH 490;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_arbol_nodo_met_arbolproblema1_idx ON mejoreduDB.met_arbol_nodo (id_arbol ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_arbol_nodo_met_arbol_nodo1_idx ON mejoreduDB.met_arbol_nodo (id_nodo_padre ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_arbol_nodo_met_indicador_resultado1_idx ON mejoreduDB.met_arbol_nodo (id_indicador_resultado ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_arbol_nodo_met_arbol_nodo2_idx ON mejoreduDB.met_arbol_nodo (id_espejo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_arbolobjetivo`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_arbolobjetivo (
  id_arbolobjetivos INT NOT NULL COMMENT 'Identificador de registro del arbol de objetivos de la tabla met_presupuestal_arbolobjetivo',
  cx_fin VARCHAR(45) NOT NULL COMMENT 'se muestra el texto registrado en el campo efecto del problema público ',
  cx_proposito VARCHAR(45) NOT NULL COMMENT 'en este campo se muestra el texto registrado en el campo problemática central del problema público',
  cx_medio VARCHAR(45) NOT NULL COMMENT 'en este campo se muestra el texto registrado en el campo causas del problema público',
  cd_opcion_actividad VARCHAR(45) NOT NULL COMMENT 'por cada causa o sub causa el sistema presenta esta opción la cual permite al usuario señalar una causa como actividad, (al ser mostrado en el esquema deberá de tener un color xx).',
  cd_opcion_componente VARCHAR(45) NOT NULL COMMENT 'por cada causa o sub causa el sistema presenta esta opción la cual permite al usuario señalar una causa como componente, (al ser mostrado en el esquema deberá de tener un color xx).',
  PRIMARY KEY (id_arbolobjetivos))
;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_archivo_seccion`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_archivo_seccion (
  id_archivo_seccion INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_archivo INT NULL DEFAULT NULL,
  id_anhio INT NOT NULL,
  ix_seccion INT NOT NULL COMMENT 'Esta bandera indica la seccion a la que pertence el archivo.\n1: Corto Plazo;\n2: Seguimiento Mediano Plazo;\n3: Reportes;',
  ix_subseccion INT NULL DEFAULT NULL,
  PRIMARY KEY (id_archivo_seccion),
  CONSTRAINT met_archivo_seccion_met_anho_planeacion_id_anhio_fk
    FOREIGN KEY (id_anhio)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio),
  CONSTRAINT met_archivo_seccion_met_archivo_id_archivo_fk
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo))
;

ALTER SEQUENCE mejoreduDB.met_archivo_seccion_seq RESTART WITH 747;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX met_archivo_seccion_cat_master_catalogo_id_catalogo_fk ON mejoreduDB.met_archivo_seccion (ix_seccion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX met_archivo_seccion_met_anho_planeacion_id_anhio_fk ON mejoreduDB.met_archivo_seccion (id_anhio ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX met_archivo_seccion_met_archivo_id_archivo_fk ON mejoreduDB.met_archivo_seccion (id_archivo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_archivo_validacion`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_archivo_validacion (
  id_archivo_validacion INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_validacion INT NOT NULL COMMENT 'met_validacion\n',
  id_archivo INT NOT NULL,
  PRIMARY KEY (id_archivo_validacion),
  CONSTRAINT fk_met_archivo_validacion_met_archivo1
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT fk_met_archivo_validacion_met_validacion1
    FOREIGN KEY (id_validacion)
    REFERENCES mejoreduDB.met_validacion (id_validacion))
;

ALTER SEQUENCE mejoreduDB.met_archivo_validacion_seq RESTART WITH 142;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_archivo_validacion_met_validacion1_idx ON mejoreduDB.met_archivo_validacion (id_validacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_archivo_validacion_met_archivo1_idx ON mejoreduDB.met_archivo_validacion (id_archivo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_archivos_programa`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_archivos_programa (
  id_archivo INT NOT NULL,
  id_presupuestal INT NOT NULL,
  PRIMARY KEY (id_archivo, id_presupuestal))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_archivo_has_met_presupuestal_met_archivo1_idx ON mejoreduDB.met_archivos_programa (id_archivo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_aspectos_susceptibles`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_aspectos_susceptibles (
  id_aspectos_susceptibles BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_anhio INT NOT NULL,
  cve_programa INT NOT NULL,
  cx_aspectos_susceptibles_mejora VARCHAR(90) NULL DEFAULT NULL,
  cx_actividades VARCHAR(90) NULL DEFAULT NULL,
  id_area_responsable INT NOT NULL,
  df_fecha_termino DATE NULL DEFAULT NULL,
  cx_resultados_esperados VARCHAR(90) NULL DEFAULT NULL,
  cx_productos_evidencias VARCHAR(90) NULL DEFAULT NULL,
  cx_porcentaje_avance VARCHAR(90) NULL DEFAULT NULL,
  cx_observaciones VARCHAR(90) NULL DEFAULT NULL,
  id_archivo INT NULL DEFAULT NULL,
  cve_usuario VARCHAR(45) NOT NULL,
  cs_estatus CHAR(1) NULL DEFAULT NULL,
  cx_no INT NULL DEFAULT NULL,
  PRIMARY KEY (id_aspectos_susceptibles),
  CONSTRAINT fk_met_aspectos_susceptibles_cat_master_catalogo1
    FOREIGN KEY (cve_programa)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_aspectos_susceptibles_cat_master_catalogo2
    FOREIGN KEY (id_area_responsable)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_aspectos_susceptibles_met_anho_planeacion1
    FOREIGN KEY (id_anhio)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio),
  CONSTRAINT fk_met_aspectos_susceptibles_met_archivo1
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT fk_met_aspectos_susceptibles_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_aspectos_susceptibles_seq RESTART WITH 18;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_aspectos_susceptibles_met_anho_planeacion1_idx ON mejoreduDB.met_aspectos_susceptibles (id_anhio ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_aspectos_susceptibles_cat_master_catalogo1_idx ON mejoreduDB.met_aspectos_susceptibles (cve_programa ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_aspectos_susceptibles_cat_master_catalogo2_idx ON mejoreduDB.met_aspectos_susceptibles (id_area_responsable ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_aspectos_susceptibles_met_archivo1_idx ON mejoreduDB.met_aspectos_susceptibles (id_archivo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_aspectos_susceptibles_seg_usuario1_idx ON mejoreduDB.met_aspectos_susceptibles (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_evidencia_mensual`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_evidencia_mensual (
  id_evidencia_mensual INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  cs_estatus VARCHAR(1) NULL DEFAULT NULL,
  cx_justificacion VARCHAR(2000) NULL DEFAULT NULL,
  cx_descripcion_tareas VARCHAR(2000) NULL DEFAULT NULL,
  cx_descripcion_producto VARCHAR(2000) NULL DEFAULT NULL,
  PRIMARY KEY (id_evidencia_mensual))
;

ALTER SEQUENCE mejoreduDB.met_evidencia_mensual_seq RESTART WITH 185;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_evidencia_trimestral`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_evidencia_trimestral (
  id_evidencia_trimestral INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_articulacion_actividades INT NULL DEFAULT NULL,
  cx_meta_superada VARCHAR(2000) NULL DEFAULT NULL,
  cx_dificultades_superacion VARCHAR(2000) NULL DEFAULT NULL,
  df_fecha_sesion DATE NULL DEFAULT NULL,
  cx_aprobacion_junta_directiva VARCHAR(45) NULL DEFAULT NULL,
  df_fecha_aprobacion DATE NULL DEFAULT NULL,
  id_tipo_publicacion INT NULL DEFAULT NULL,
  cx_especificar VARCHAR(45) NULL DEFAULT NULL,
  id_tipo_difusion INT NULL DEFAULT NULL,
  cx_especificar_difusion VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (id_evidencia_trimestral),
  CONSTRAINT fk_met_evidencia_trimestral_cat_master_catalogo1
    FOREIGN KEY (id_tipo_publicacion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_evidencia_trimestral_cat_master_catalogo2
    FOREIGN KEY (id_tipo_difusion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_evidencia_trimestral_cat_master_catalogo3
    FOREIGN KEY (id_articulacion_actividades)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo))
;

ALTER SEQUENCE mejoreduDB.met_evidencia_trimestral_seq RESTART WITH 209;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_evidencia_trimestral_cat_master_catalogo1_idx ON mejoreduDB.met_evidencia_trimestral (id_tipo_publicacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_evidencia_trimestral_cat_master_catalogo2_idx ON mejoreduDB.met_evidencia_trimestral (id_tipo_difusion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_evidencia_trimestral_cat_master_catalogo3_idx ON mejoreduDB.met_evidencia_trimestral (id_articulacion_actividades ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_producto_calendario`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_producto_calendario (
  id_prodcal INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Indentificador secuencial automatico para numerar la relación entre producto con un mes',
  ci_mes INT NULL DEFAULT NULL,
  ci_monto INT NULL DEFAULT '0',
  ci_entregados INT NULL DEFAULT '0',
  id_producto INT NOT NULL COMMENT 'Identificador del producto que será asociado a un mes y monto de presupuesto, relación con la tabla de met_cortoplazo_producto',
  LOCK_FLAG INT NULL DEFAULT NULL COMMENT 'Identificador transaccional del registro en contenedores',
  PRIMARY KEY (id_prodcal),
  CONSTRAINT fk_met_producto_calendario_met_cortoplazo_producto1
    FOREIGN KEY (id_producto)
    REFERENCES mejoreduDB.met_cortoplazo_producto (id_producto))
;

ALTER SEQUENCE mejoreduDB.met_producto_calendario_seq RESTART WITH 14682;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_producto_calendario_met_cortoplazo_producto1_idx ON mejoreduDB.met_producto_calendario (id_producto ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_avance`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_avance (
  id_avance INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_evidencia_mensual INT NULL DEFAULT NULL,
  id_evidencia_trimestral INT NULL DEFAULT NULL,
  id_prodcal INT NULL DEFAULT NULL,
  id_prodcal_entregado INT NULL DEFAULT NULL,
  id_actividad INT NULL DEFAULT NULL,
  ix_tipo_registro INT NOT NULL DEFAULT '0' COMMENT '0 = Regular, 1 = Meta Vencida, 2 = Meta Adelantada',
  ix_cicloValidacion INT NULL DEFAULT NULL,
  id_validacion INT NULL DEFAULT NULL,
  id_validacion_planeacion INT NULL DEFAULT NULL,
  id_validacion_supervisor INT NULL DEFAULT NULL,
  cx_mes INT NULL DEFAULT NULL,
  cve_usuario VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (id_avance),
  CONSTRAINT fk_met_avance_met_cortoplazo_actividad1
    FOREIGN KEY (id_actividad)
    REFERENCES mejoreduDB.met_cortoplazo_actividad (id_actividad),
  CONSTRAINT fk_met_avance_met_evidencia_mensual1
    FOREIGN KEY (id_evidencia_mensual)
    REFERENCES mejoreduDB.met_evidencia_mensual (id_evidencia_mensual),
  CONSTRAINT fk_met_avance_met_evidencia_trimestral1
    FOREIGN KEY (id_evidencia_trimestral)
    REFERENCES mejoreduDB.met_evidencia_trimestral (id_evidencia_trimestral),
  CONSTRAINT fk_met_avance_met_producto_calendario1
    FOREIGN KEY (id_prodcal)
    REFERENCES mejoreduDB.met_producto_calendario (id_prodcal),
  CONSTRAINT fk_met_avance_met_producto_calendario2
    FOREIGN KEY (id_prodcal_entregado)
    REFERENCES mejoreduDB.met_producto_calendario (id_prodcal)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT met_avance_seg_usuario_cve_usuario_fk
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
;

ALTER SEQUENCE mejoreduDB.met_avance_seq RESTART WITH 230;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_avance_met_evidencia_mensual1_idx ON mejoreduDB.met_avance (id_evidencia_mensual ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_avance_met_evidencia_trimestral1_idx ON mejoreduDB.met_avance (id_evidencia_trimestral ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_avance_met_producto_calendario1_idx ON mejoreduDB.met_avance (id_prodcal ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_avance_met_cortoplazo_actividad1_idx ON mejoreduDB.met_avance (id_actividad ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_avance_met_producto_calendario2_idx ON mejoreduDB.met_avance (id_prodcal_entregado ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX met_avance_seg_usuario_cve_usuario_fk ON mejoreduDB.met_avance (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_carga_solicitud`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_carga_solicitud (
  id_carga_solicitud INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'identificador archivo SIF cargado o enviado',
  cs_estatus_recepcion VARCHAR(1) NULL DEFAULT NULL COMMENT 'Estatus que guarda el archivo R=Recibido N=no procesado, P=Procesado, E=Errores ',
  cs_estatus_transmision VARCHAR(1) NULL DEFAULT NULL COMMENT 'Estatus que guarda el archivo R=Recibido N=no procesado, P=Procesado, E=Errores',
  id_archivo INT NOT NULL,
  PRIMARY KEY (id_carga_solicitud),
  CONSTRAINT fk_met_carga_solicitud_met_archivo1
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_carga_solicitud_met_archivo1_idx ON mejoreduDB.met_carga_solicitud (id_archivo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_concepto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_concepto (
  id_concepto INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador del concepto utilizado en la estructura de registro Planeación mediano plazo',
  cd_concepto VARCHAR(120) NOT NULL COMMENT 'Concepto utilizado en la estructura de registro Planeación mediano plazo por ejemplo Nombre del programa, Alineación, Análisis de estado actual, etc',
  ic_tipo_dato INT NOT NULL COMMENT 'Tipo de dato a capturar 1=Texto 1 liena, 2= Texto 3=Multilinea, 4=Numérico, 5=Fecha',
  cs_estatus VARCHAR(1) NOT NULL,
  ix_requerido INT NULL DEFAULT NULL COMMENT 'Indicador numerico del concepto para conocer si es requerido 1=Requerido 0=No requerido',
  PRIMARY KEY (id_concepto))
;

ALTER SEQUENCE mejoreduDB.met_concepto_seq RESTART WITH 20;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_datosgeneral`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_datosgeneral (
  id_datosgenerales INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador del resgistro de datos generales de la tabla met_presupuestal_datosgenerales',
  cx_nombre_programa VARCHAR(120) NULL DEFAULT NULL COMMENT 'Campo que almacena nombre del programa presupuestal',
  id_ramo_sector INT NULL DEFAULT NULL COMMENT 'Campo que enlista el nombre del ramo o el sector del plan presupuestal',
  id_unidad_responsable INT NULL DEFAULT NULL COMMENT 'Campo que enlista la unidad responsable del programa presupuestal',
  cx_finalidad VARCHAR(200) NULL DEFAULT NULL COMMENT 'Campo que almacena la fina lidad del plan ',
  cx_funcion VARCHAR(200) NULL DEFAULT NULL COMMENT 'Campo que almacena la funcion del plan',
  cx_subfuncion VARCHAR(200) NULL DEFAULT NULL COMMENT 'Campo que almacena la subfuncion del plan presupuestal',
  cx_actividad_institucional VARCHAR(50) NULL DEFAULT NULL COMMENT 'Campo que almacena la actividad institucional',
  df_fecha_registro DATE NULL DEFAULT NULL,
  id_vinculacion_ODS INT NULL DEFAULT NULL COMMENT 'Campo que enlista la vinculación de la programación presupuestal con los ODS',
  id_presupuestal INT NOT NULL,
  id_validacion INT NULL DEFAULT NULL,
  id_validacion_planeacion INT NULL DEFAULT NULL,
  id_validacion_supervisor INT NULL DEFAULT NULL,
  PRIMARY KEY (id_datosgenerales))
;

ALTER SEQUENCE mejoreduDB.met_datosgeneral_seq RESTART WITH 12;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_datosgeneral_met_presupuestal1_idx ON mejoreduDB.met_datosgeneral (id_presupuestal ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_datosgeneral_cat_master_catalogo1_idx ON mejoreduDB.met_datosgeneral (id_ramo_sector ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_datosgeneral_cat_master_catalogo2_idx ON mejoreduDB.met_datosgeneral (id_unidad_responsable ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_datosgeneral_cat_master_catalogo3_idx ON mejoreduDB.met_datosgeneral (id_vinculacion_ODS ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_desempenhio_interno`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_desempenhio_interno (
  id_desempenhio_interno BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_anhio INT NOT NULL,
  cx_actor VARCHAR(90) NULL DEFAULT NULL,
  cx_nombre_evaluacion VARCHAR(90) NULL DEFAULT NULL,
  cx_tipo_informe VARCHAR(90) NULL DEFAULT NULL,
  cx_observaciones VARCHAR(90) NULL DEFAULT NULL,
  cx_atencion_observaciones VARCHAR(90) NULL DEFAULT NULL,
  id_archivo INT NULL DEFAULT NULL,
  cve_usuario VARCHAR(45) NOT NULL,
  cs_estatus CHAR(1) NULL DEFAULT NULL,
  PRIMARY KEY (id_desempenhio_interno),
  CONSTRAINT fk_met_desempenhio_interno_met_anho_planeacion1
    FOREIGN KEY (id_anhio)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio),
  CONSTRAINT fk_met_desempenhio_interno_met_archivo1
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT fk_met_desempenhio_interno_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_desempenhio_interno_seq RESTART WITH 16;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_desempenhio_interno_met_anho_planeacion1_idx ON mejoreduDB.met_desempenhio_interno (id_anhio ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_desempenhio_interno_met_archivo1_idx ON mejoreduDB.met_desempenhio_interno (id_archivo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_desempenhio_interno_seg_usuario1_idx ON mejoreduDB.met_desempenhio_interno (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_diagnostico`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_diagnostico (
  id_diagnostico INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador del registro de diagnostico de la tabla met_diagnostico',
  cx_antecedentes TEXT NULL DEFAULT NULL COMMENT 'Campo que almacena los antecedentes',
  cx_definicion_problema VARCHAR(300) NULL DEFAULT NULL COMMENT 'Campo que almacena la definicion del problema',
  cx_estado_problema TEXT NULL DEFAULT NULL COMMENT 'Campo que almacena el estado del problema',
  cx_evolucion_problema TEXT NULL DEFAULT NULL COMMENT 'Campo que almacena la evolucion del problema',
  cx_cobertura TEXT NULL DEFAULT NULL COMMENT 'Campo que almacena la cobertura que tiene el problema',
  cx_identificacion_poblacion_potencial TEXT NULL DEFAULT NULL COMMENT 'Campo que almacena la identificacion de poblacion potencial del problema',
  cx_identificacion_poblacion_objetivo TEXT NULL DEFAULT NULL COMMENT 'Campo que almacena la identificacion de poblacion objetivo',
  cx_cuantificacion_poblacion_objetivo TEXT NULL DEFAULT NULL COMMENT 'Campo que almacena la cuantificacion de problema de poblacion objetivo',
  cx_frecuencia_actualizacion_potencialobjetivo VARCHAR(80) NULL DEFAULT NULL COMMENT 'Campo que almacena la frecuencia de actualizacion potencial u objetivo',
  cx_analisis_alternativas TEXT NULL DEFAULT NULL COMMENT 'Campo que almacena un analisis de alternativas del diagnostico del problema',
  df_fecha_registro TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP,
  id_presupuestal INT NOT NULL,
  id_validacion INT NULL DEFAULT NULL,
  id_validacion_planeacion INT NULL DEFAULT NULL,
  id_validacion_supervisor INT NULL DEFAULT NULL,
  PRIMARY KEY (id_diagnostico))
;

ALTER SEQUENCE mejoreduDB.met_diagnostico_seq RESTART WITH 10;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_elemento_validar`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_elemento_validar (
  id_elemento INT NOT NULL COMMENT 'identificador de cada check en la tabla met_elemento_validar\n',
  cx_nombre VARCHAR(200) NULL DEFAULT NULL COMMENT 'Nombre de los diferentes check para validacion',
  id_apartado INT NOT NULL COMMENT 'Identificador que permite conocer a que apartado se asocia el elemnto referencia con tabla met_apartado',
  PRIMARY KEY (id_elemento),
  CONSTRAINT fk_met_mp_elemento_met_apartado1
    FOREIGN KEY (id_apartado)
    REFERENCES mejoreduDB.met_apartado (id_apartado))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_elemento_met_apartado1_idx ON mejoreduDB.met_elemento_validar (id_apartado ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_estrategia_accion`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_estrategia_accion (
  id_estaci INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Indentificador de la estrategia o acción puntual, relacionada con la tabla actividad y master catalogo, numerico secuencial',
  ix_tipo INT NULL DEFAULT NULL COMMENT 'tipificador de la 1=estrategia o 2=acción  o 3=Objetivo ',
  id_actividad INT NOT NULL COMMENT 'Identificador de la actividad asociada a la acción puntual o estrategia, relacionada con la tabla de master catalogo',
  id_catalogo INT NOT NULL COMMENT 'Indentificador del catalogo asociado a la estrategia o acción puntual',
  LOCK_FLAG INT NULL DEFAULT NULL COMMENT 'Bandera transacional en contenedores',
  PRIMARY KEY (id_estaci),
  CONSTRAINT fk_met_estrategia_accion_cat_master_catalogo1
    FOREIGN KEY (id_catalogo)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_estrategia_accion_met_cortoplazo_actividad1
    FOREIGN KEY (id_actividad)
    REFERENCES mejoreduDB.met_cortoplazo_actividad (id_actividad))
;

ALTER SEQUENCE mejoreduDB.met_estrategia_accion_seq RESTART WITH 2756;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_estrategia_accion_met_cortoplazo_actividad1_idx ON mejoreduDB.met_estrategia_accion (id_actividad ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_estrategia_accion_cat_master_catalogo1_idx ON mejoreduDB.met_estrategia_accion (id_catalogo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_evaluacion_consulta`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_evaluacion_consulta (
  id_evaluacion_consulta BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_anhio INT NOT NULL,
  cx_area_responsable VARCHAR(90) NULL DEFAULT NULL,
  cx_tipo_instrumento VARCHAR(90) NULL DEFAULT NULL,
  cx_nombre_instrumento VARCHAR(90) NULL DEFAULT NULL,
  cx_objetivo VARCHAR(90) NULL DEFAULT NULL,
  id_archivo INT NULL DEFAULT NULL,
  cve_usuario VARCHAR(45) NOT NULL,
  cs_estatus CHAR(1) NULL DEFAULT NULL,
  PRIMARY KEY (id_evaluacion_consulta),
  CONSTRAINT fk_met_evaluacion_consulta_met_anho_planeacion1
    FOREIGN KEY (id_anhio)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio),
  CONSTRAINT fk_met_evaluacion_consulta_met_archivo1
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT fk_met_evaluacion_consulta_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_evaluacion_consulta_seq RESTART WITH 11;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_evaluacion_consulta_met_anho_planeacion1_idx ON mejoreduDB.met_evaluacion_consulta (id_anhio ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_evaluacion_consulta_met_archivo1_idx ON mejoreduDB.met_evaluacion_consulta (id_archivo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_evaluacion_consulta_seg_usuario1_idx ON mejoreduDB.met_evaluacion_consulta (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_evidencia_interna`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_evidencia_interna (
  id_evidencia_interna BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_apartado INT NOT NULL,
  id_anhio INT NOT NULL,
  cx_periodo INT NULL DEFAULT NULL,
  cve_usuario VARCHAR(45) NOT NULL,
  cs_estatus CHAR(1) NULL DEFAULT NULL,
  df_registro TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_evidencia_interna),
  CONSTRAINT fk_met_evidencia_interna_cat_master_catalogo1
    FOREIGN KEY (id_apartado)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_evidencia_interna_met_anho_planeacion1
    FOREIGN KEY (id_anhio)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio),
  CONSTRAINT fk_met_evidencia_interna_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_evidencia_interna_seq RESTART WITH 45;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_evidencia_interna_cat_master_catalogo1_idx ON mejoreduDB.met_evidencia_interna (id_apartado ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_evidencia_interna_met_anho_planeacion1_idx ON mejoreduDB.met_evidencia_interna (id_anhio ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_evidencia_interna_seg_usuario1_idx ON mejoreduDB.met_evidencia_interna (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_evidencia_archivo`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_evidencia_archivo (
  id_archivo INT NOT NULL,
  id_evidencia_interna BIGINT NOT NULL,
  CONSTRAINT fk_met_archivo_has_met_evidencia_interna_met_archivo1
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT fk_met_archivo_has_met_evidencia_interna_met_evidencia_interna1
    FOREIGN KEY (id_evidencia_interna)
    REFERENCES mejoreduDB.met_evidencia_interna (id_evidencia_interna))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_archivo_has_met_evidencia_interna_met_evidencia_inte_idx ON mejoreduDB.met_evidencia_archivo (id_evidencia_interna ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_archivo_has_met_evidencia_interna_met_archivo1_idx ON mejoreduDB.met_evidencia_archivo (id_archivo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_evidencia_documento`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_evidencia_documento (
  id_evidencia_mensual INT NOT NULL,
  id_archivo INT NOT NULL,
  PRIMARY KEY (id_evidencia_mensual, id_archivo),
  CONSTRAINT fk_met_evidencia_mensual_has_met_archivo_met_archivo1
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT fk_met_evidencia_mensual_has_met_archivo_met_evidencia_mensual1
    FOREIGN KEY (id_evidencia_mensual)
    REFERENCES mejoreduDB.met_evidencia_mensual (id_evidencia_mensual))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_evidencia_mensual_has_met_archivo_met_archivo1_idx ON mejoreduDB.met_evidencia_documento (id_archivo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_evidencia_mensual_has_met_archivo_met_evidencia_mens_idx ON mejoreduDB.met_evidencia_documento (id_evidencia_mensual ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_formulario_analitico`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_formulario_analitico (
  id_formulario INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  cc_clave VARCHAR(255) NULL DEFAULT NULL,
  cx_alcance VARCHAR(255) NULL DEFAULT NULL,
  cx_contribucion_pi VARCHAR(255) NULL DEFAULT NULL,
  cx_contribucion_pnd VARCHAR(255) NULL DEFAULT NULL,
  cx_fundamentacion VARCHAR(255) NULL DEFAULT NULL,
  cx_nombre_proyecto VARCHAR(255) NULL DEFAULT NULL,
  cx_nombre_unidad VARCHAR(255) NULL DEFAULT NULL,
  cx_objetivo VARCHAR(255) NULL DEFAULT NULL,
  df_registro VARCHAR(255) NULL DEFAULT NULL,
  dh_registro VARCHAR(255) NULL DEFAULT NULL,
  id_anhio INT NOT NULL,
  cve_usuario VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_formulario),
  CONSTRAINT FK6d0gs0eqqo7h5w4lidk7edsfa
    FOREIGN KEY (id_anhio)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio),
  CONSTRAINT FKa82j11i1jdm1v3gis8q4ajdja
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX FK6d0gs0eqqo7h5w4lidk7edsfa ON mejoreduDB.met_formulario_analitico (id_anhio ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX FKa82j11i1jdm1v3gis8q4ajdja ON mejoreduDB.met_formulario_analitico (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_formulario_archivo`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_formulario_archivo (
  id_formulario INT NOT NULL,
  id_archivo INT NOT NULL,
  PRIMARY KEY (id_formulario, id_archivo),
  CONSTRAINT FK16vw9id9m0bxebvbj0epnclom
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT FKoml4kq34sbyqcdjddjvu5rd05
    FOREIGN KEY (id_formulario)
    REFERENCES mejoreduDB.met_formulario_analitico (id_formulario))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX FK16vw9id9m0bxebvbj0epnclom ON mejoreduDB.met_formulario_archivo (id_archivo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_indicador_programa`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_indicador_programa (
  id_indicador_programa INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_ficha_indicadores INT NOT NULL,
  id_presupuestal INT NOT NULL,
  cx_nombre_programa VARCHAR(120) NULL DEFAULT NULL,
  id_vinculacion_ods INT NULL DEFAULT NULL,
  id_ramo_sector INT NULL DEFAULT NULL,
  id_unidad_responsable INT NULL DEFAULT NULL,
  PRIMARY KEY (id_indicador_programa),
  CONSTRAINT fk_met_indicador_programa_cat_master_catalogo1
    FOREIGN KEY (id_ramo_sector)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_indicador_programa_cat_master_catalogo2
    FOREIGN KEY (id_unidad_responsable)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_programa_m001_cat_master_catalogo1
    FOREIGN KEY (id_vinculacion_ods)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_programa_m001_met_ficha_indicadores1
    FOREIGN KEY (id_ficha_indicadores)
    REFERENCES mejoreduDB.met_ficha_indicadores (id_ficha_indicadores))
;

ALTER SEQUENCE mejoreduDB.met_indicador_programa_seq RESTART WITH 14;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_programa_m001_met_ficha_indicadores1_idx ON mejoreduDB.met_indicador_programa (id_ficha_indicadores ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_programa_m001_cat_master_catalogo1_idx ON mejoreduDB.met_indicador_programa (id_vinculacion_ods ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_indicador_programa_cat_master_catalogo1_idx ON mejoreduDB.met_indicador_programa (id_ramo_sector ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_indicador_programa_cat_master_catalogo2_idx ON mejoreduDB.met_indicador_programa (id_unidad_responsable ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_informe_externo`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_informe_externo (
  id_informe_externo BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_anhio INT NOT NULL,
  cx_tipo_evaluacion VARCHAR(90) NULL DEFAULT NULL,
  cx_nombre_evaluacion VARCHAR(90) NULL DEFAULT NULL,
  cx_tipo_informe VARCHAR(90) NULL DEFAULT NULL,
  cx_posicion_institucional VARCHAR(90) NULL DEFAULT NULL,
  cx_aspectos_susceptibles_mejora VARCHAR(90) NULL DEFAULT NULL,
  id_archivo INT NULL DEFAULT NULL,
  cve_usuario VARCHAR(45) NOT NULL,
  cs_estatus CHAR(1) NULL DEFAULT NULL,
  PRIMARY KEY (id_informe_externo),
  CONSTRAINT fk_met_informe_externo_met_anho_planeacion1
    FOREIGN KEY (id_anhio)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio),
  CONSTRAINT fk_met_informe_externo_met_archivo1
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT fk_met_informe_externo_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_informe_externo_seq RESTART WITH 16;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_informe_externo_met_anho_planeacion1_idx ON mejoreduDB.met_informe_externo (id_anhio ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_informe_externo_met_archivo1_idx ON mejoreduDB.met_informe_externo (id_archivo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_informe_externo_seg_usuario1_idx ON mejoreduDB.met_informe_externo (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_informe_interno`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_informe_interno (
  id_informe_interno BIGINT CHECK (id_informe_interno > 0) NOT NULL GENERATED ALWAYS AS IDENTITY,
  cx_nombre_informe VARCHAR(90) NULL DEFAULT NULL,
  cx_periodo INT NULL DEFAULT NULL,
  id_anhio INT NOT NULL,
  id_archivo INT NULL DEFAULT NULL,
  cve_usuario VARCHAR(45) NOT NULL,
  cs_estatus CHAR(1) NULL DEFAULT NULL,
  PRIMARY KEY (id_informe_interno),
  CONSTRAINT fk_met_informe_interno_met_anho_planeacion1
    FOREIGN KEY (id_anhio)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio),
  CONSTRAINT fk_met_informe_interno_met_archivo1
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT fk_met_informe_interno_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_informe_interno_seq RESTART WITH 31;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_informe_interno_met_anho_planeacion1_idx ON mejoreduDB.met_informe_interno (id_anhio ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_informe_interno_met_archivo1_idx ON mejoreduDB.met_informe_interno (id_archivo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_informe_interno_seg_usuario1_idx ON mejoreduDB.met_informe_interno (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_justificacion`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_justificacion (
  id_justificacion INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_indicador_mir INT NOT NULL,
  cx_indicador VARCHAR(500) NULL DEFAULT NULL,
  cx_registro_avance VARCHAR(45) NULL DEFAULT NULL,
  cx_causa VARCHAR(500) NULL DEFAULT NULL,
  cx_efectos VARCHAR(500) NULL DEFAULT NULL,
  cx_otros_motivos VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (id_justificacion),
  CONSTRAINT fk_met_justificacion_cat_master_catalogo1
    FOREIGN KEY (id_indicador_mir)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo))
;

ALTER SEQUENCE mejoreduDB.met_justificacion_seq RESTART WITH 5;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_justificacion_cat_master_catalogo1_idx ON mejoreduDB.met_justificacion (id_indicador_mir ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_justificacion_documentos`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_justificacion_documentos (
  id_justificacion INT NOT NULL,
  id_archivo INT NOT NULL,
  PRIMARY KEY (id_justificacion, id_archivo),
  CONSTRAINT fk_met_justificacion_has_met_archivo_met_archivo1
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT fk_met_justificacion_has_met_archivo_met_justificacion1
    FOREIGN KEY (id_justificacion)
    REFERENCES mejoreduDB.met_justificacion (id_justificacion))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_justificacion_has_met_archivo_met_archivo1_idx ON mejoreduDB.met_justificacion_documentos (id_archivo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_justificacion_has_met_archivo_met_justificacion1_idx ON mejoreduDB.met_justificacion_documentos (id_justificacion ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_justificacion_producto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_justificacion_producto (
  id_justificacion INT NOT NULL,
  id_producto INT NOT NULL,
  cx_justificacion VARCHAR(500) NULL DEFAULT NULL,
  cx_causa VARCHAR(500) NULL DEFAULT NULL,
  cx_efectos VARCHAR(500) NULL DEFAULT NULL,
  cx_otros_motivos VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (id_justificacion, id_producto),
  CONSTRAINT fk_met_justificacion_has_met_cortoplazo_producto_met_cortopla1
    FOREIGN KEY (id_producto)
    REFERENCES mejoreduDB.met_cortoplazo_producto (id_producto),
  CONSTRAINT fk_met_justificacion_has_met_cortoplazo_producto_met_justific1
    FOREIGN KEY (id_justificacion)
    REFERENCES mejoreduDB.met_justificacion (id_justificacion))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_justificacion_has_met_cortoplazo_producto_met_cortop_idx ON mejoreduDB.met_justificacion_producto (id_producto ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_justificacion_has_met_cortoplazo_producto_met_justif_idx ON mejoreduDB.met_justificacion_producto (id_justificacion ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_mes`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_mes (
  ix_mes INT NOT NULL,
  ix_trimestre INT NULL DEFAULT NULL,
  PRIMARY KEY (ix_mes))
;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_metas_MIRFID2`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_metas_MIRFID2 (
  id_MIRFID2 INT NOT NULL,
  cx_nivel VARCHAR(45) NULL DEFAULT NULL,
  cx_clave_nombre_producto VARCHAR(45) NULL DEFAULT NULL,
  cx_clave_nombre_actividad VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (id_MIRFID2))
;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_mp_estructura`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_mp_estructura (
  id_estructura INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Indentificador de registro de la estructura por año',
  df_registro DATE NULL DEFAULT NULL COMMENT 'Fecha de registro de la estructura por año',
  dh_registro TIME(0) NULL DEFAULT NULL COMMENT 'Hora de registro del año apartado registro',
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que registra la estructura en el año, referencia con la tabla seg_usuario',
  cd_nombre_programa VARCHAR(120) NULL DEFAULT NULL COMMENT 'Descripción del nombre del programa',
  cd_analisis_estado VARCHAR(4000) NULL DEFAULT NULL COMMENT 'Descripción del análisis del estado actual',
  cd_problemas_publicos VARCHAR(4000) NULL DEFAULT NULL COMMENT 'Descripción de los Problemas publicos',
  id_catalogo_alineacion INT NULL DEFAULT NULL COMMENT 'Identificador de la alineación PND, relacionada con la tabla cat_master_catalogo',
  cs_esatus VARCHAR(1) NULL DEFAULT NULL COMMENT 'Bandera de estatus que guarda el registro C=Completo, I=Incompleto y B= Baja lógica',
  df_actualizacion DATE NULL DEFAULT NULL COMMENT 'Fecha de actualización de la estructura por año',
  dh_actualizacion TIME(0) NULL DEFAULT NULL COMMENT 'Hora de actualización de la estructura por año',
  LOCK_FLAG INT NULL DEFAULT NULL COMMENT 'Bandera de identidad requerida en la transaccionalidad de contenedores',
  cve_usuario_actualiza VARCHAR(45) NULL DEFAULT NULL COMMENT 'Clave del usuario que actualiza la estructura en el año, referencia con la tabla seg_usuario',
  id_anhio INT NOT NULL COMMENT 'Identificador del año asociado a la estructura, referencia con tabla met_anho_planeacion',
  id_validacion INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada al apartado de inicio',
  id_validacion_planeacion INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada al apartado de inicio realizado por el rol de usuario Planificación, relacionada con la tabla met_validación.',
  id_validacion_supervisor INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada, realizado por el rol de usuario Supervisor, relacionada con la tabla met_validación.',
  PRIMARY KEY (id_estructura),
  CONSTRAINT fk_met_apartado_estructura_cat_master_catalogo1
    FOREIGN KEY (id_catalogo_alineacion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_apartado_estructura_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario),
  CONSTRAINT fk_met_mp_estructura_met_anho_planeacion1
    FOREIGN KEY (id_anhio)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio),
  CONSTRAINT fk_met_mp_estructura_seg_usuario1
    FOREIGN KEY (cve_usuario_actualiza)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_mp_estructura_seq RESTART WITH 39;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_apartado_estructura_seg_usuario1_idx ON mejoreduDB.met_mp_estructura (cve_usuario ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_apartado_estructura_cat_master_catalogo1_idx ON mejoreduDB.met_mp_estructura (id_catalogo_alineacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_estructura_seg_usuario1_idx ON mejoreduDB.met_mp_estructura (cve_usuario_actualiza ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_estructura_met_anho_planeacion1_idx ON mejoreduDB.met_mp_estructura (id_anhio ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_estructura_met_validacion1_idx ON mejoreduDB.met_mp_estructura (id_validacion ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_mp_meta_parametro`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_mp_meta_parametro (
  id_metas_bienestar INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  cx_nombre VARCHAR(500) NULL DEFAULT NULL COMMENT 'Se obtiene del nombre de la meta o parámetro que fue registrado en el submódulo de planeación a mediano plazo',
  cx_meta VARCHAR(1300) NULL DEFAULT NULL COMMENT 'Campo editable numérico de 4 dígitos de longitud para indicar el año, (se subdivide en dos columnas, en la primera muestra el número que representa esa meta o parámetro y en la segunda el porcentaje que representa dicha meta o parámetro)',
  cx_periodicidad VARCHAR(45) NULL DEFAULT NULL COMMENT 'Se obtiene de la periodicidad que fue registrada dentro del submódulo de mediano plazo',
  cx_unidad_medida VARCHAR(45) NULL DEFAULT NULL COMMENT 'Se obtiene de la unidad de medida que fue registrada dentro del submódulo de mediano plazo',
  cx_tendencia_esperada VARCHAR(45) NULL DEFAULT NULL COMMENT 'Se obtiene de la tendencia esperada que fue registrada dentro del submódulo de mediano plazo',
  cx_fuente_variable_uno VARCHAR(45) NULL DEFAULT NULL COMMENT 'Se obtiene de la fuente variable 1 que fue registrada dentro del submódulo de mediano plazo',
  cve_usuario VARCHAR(45) NOT NULL,
  id_estructura INT NOT NULL COMMENT 'Identificador del objetivo prioritario a relacionar con las metas para el bienestar, se relaciona con la tabla met_mp_estructura\\n',
  cs_estatus VARCHAR(1) NULL DEFAULT NULL,
  ix_tipo INT NULL DEFAULT NULL COMMENT 'Tipificador para conocer si el elemento será 1=Meta o 2= Parametro',
  LOCK_FLAG INT NULL DEFAULT '0' COMMENT 'Bandera de persistencia transaccional.',
  id_validacion INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada al apartado de inicio',
  id_validacion_planeacion INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada al apartado de inicio realizado por el rol de usuario Planificación, relacionada con la tabla met_validación.',
  id_validacion_supervisor INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada al apartado de inicio realizado por el rol de usuario Supervisor, relacionada con la tabla met_validación.',
  PRIMARY KEY (id_metas_bienestar),
  CONSTRAINT fk_met_metas_bienestar_met_mp_estructura1
    FOREIGN KEY (id_estructura)
    REFERENCES mejoreduDB.met_mp_estructura (id_estructura),
  CONSTRAINT fk_met_metas_bienestar_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_mp_meta_parametro_seq RESTART WITH 253;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_metas_bienestar_seg_usuario1_idx ON mejoreduDB.met_mp_meta_parametro (cve_usuario ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_metas_bienestar_met_mp_estructura1_idx ON mejoreduDB.met_mp_meta_parametro (id_estructura ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_meta_parametro_met_validacion1_idx ON mejoreduDB.met_mp_meta_parametro (id_validacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_meta_parametro_met_validacion2_idx ON mejoreduDB.met_mp_meta_parametro (id_validacion_planeacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_meta_parametro_met_validacion3_idx ON mejoreduDB.met_mp_meta_parametro (id_validacion_supervisor ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_mp_aplicacion_metodo`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_mp_aplicacion_metodo (
  id_aplicacion INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identidad de la aplicación del metodo',
  id_meta INT NOT NULL COMMENT 'Identificador de la meta que será asociada a la aplicación del método, relacionada con la tabla met_mp_meta',
  cx_nombre_variable VARCHAR(120) NULL DEFAULT NULL COMMENT 'Nombre de la variable principal del metodo aplicado',
  cx_valor_variable VARCHAR(120) NULL DEFAULT NULL COMMENT 'Valor de la variable principal del metodo aplicado',
  cx_fuente VARCHAR(120) NULL DEFAULT NULL COMMENT 'Fuente de la variable principal del metodo aplicado',
  cx_variable_dos VARCHAR(120) NULL DEFAULT NULL COMMENT 'Nombre de la variable secundaria del metodo aplicado',
  cx_valor_varable_dos VARCHAR(120) NULL DEFAULT NULL COMMENT 'Valor de la variable secundaria del metodo aplicado',
  cx_fuente_dos VARCHAR(120) NULL DEFAULT NULL COMMENT 'Fuente de la variable secundaria del metodo aplicado',
  cx_sustitucion VARCHAR(120) NULL DEFAULT NULL COMMENT 'Sustitución de la variable secundaria del metodo aplicado',
  LOCK_FLAG INT NULL DEFAULT NULL COMMENT 'Bandera de identidad requerida en la transaccionalidad de contenedores',
  PRIMARY KEY (id_aplicacion),
  CONSTRAINT fk_met_mp_aplicacion_metodo_met_mp_meta_parametro1
    FOREIGN KEY (id_meta)
    REFERENCES mejoreduDB.met_mp_meta_parametro (id_metas_bienestar))
;

ALTER SEQUENCE mejoreduDB.met_mp_aplicacion_metodo_seq RESTART WITH 220;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_aplicacion_metodo_met_mp_meta_parametro1_idx ON mejoreduDB.met_mp_aplicacion_metodo (id_meta ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_mp_epilogo`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_mp_epilogo (
  id_epilogo INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identidad del epilogo autoincremental',
  cx_descripcion TEXT NULL DEFAULT NULL COMMENT 'descrición del epilogo cadena alfanumerica',
  cs_estatus VARCHAR(45) NULL DEFAULT NULL COMMENT 'Bandera del estatus que guarda el registro C=Completo, I=Incompleto, B=Baja',
  id_estructura INT NOT NULL COMMENT 'Identificador de la estructura asociada al epílogo, referencia con la tabla met_mp_estructura',
  id_validacion INT NULL DEFAULT NULL COMMENT 'Identificador de la validación o revisión realizada en epilogo, ralacionada con la tabla met_validacion',
  id_validacion_planeacion INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada al apartado, realizado por el rol de usuario Planificación, relacionada con la tabla met_validación.',
  id_validacion_supervisor INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada, realizado por el rol de usuario Supervisor, relacionada con la tabla met_validación.',
  PRIMARY KEY (id_epilogo),
  CONSTRAINT fk_met_mp_epilogo_met_mp_estructura1
    FOREIGN KEY (id_estructura)
    REFERENCES mejoreduDB.met_mp_estructura (id_estructura))
;

ALTER SEQUENCE mejoreduDB.met_mp_epilogo_seq RESTART WITH 37;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_epilogo_met_mp_estructura1_idx ON mejoreduDB.met_mp_epilogo (id_estructura ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_epilogo_met_validacion1_idx ON mejoreduDB.met_mp_epilogo (id_validacion ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_mp_carga_pi`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_mp_carga_pi (
  id_carga_pi INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identidad de los archivos de carga PI, relacionado con la tabla Archivos',
  cs_estaus VARCHAR(45) NULL DEFAULT NULL COMMENT 'Bandera del estatus que guarda el registro A=Activo, B=Baja',
  id_epilogo INT NOT NULL COMMENT 'Identificador del epilogo autoincremental, tabla relacionada met_mp_carga_pi',
  id_archivo INT NOT NULL COMMENT 'Identificador del archivo, tabla relacionada met_archivo',
  ix_tipo_archivo INT NULL DEFAULT NULL COMMENT 'Tipificador de archivo para conocer si es 1=Archivo Carga PI, 2=Acta de sesión, relación con la tabla de met_Archivo',
  PRIMARY KEY (id_carga_pi),
  CONSTRAINT fk_met_mp_carga_pi_met_archivo1
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT fk_met_mp_carga_pi_met_mp_epilogo1
    FOREIGN KEY (id_epilogo)
    REFERENCES mejoreduDB.met_mp_epilogo (id_epilogo))
;

ALTER SEQUENCE mejoreduDB.met_mp_carga_pi_seq RESTART WITH 233;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_carga_pi_met_mp_epilogo1_idx ON mejoreduDB.met_mp_carga_pi (id_epilogo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_carga_pi_met_archivo1_idx ON mejoreduDB.met_mp_carga_pi (id_archivo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_mp_elemento`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_mp_elemento (
  id_elemento INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador artificial',
  cx_nombre VARCHAR(500) NULL DEFAULT NULL COMMENT 'Nombre del elemento ',
  id_catalogo_objetivo INT NOT NULL COMMENT 'Identificador del objetivo prioritario asociado al elemento(meta), relacionado con la tabla de cat_master_catalogo',
  cx_definicion VARCHAR(1300) NULL DEFAULT NULL,
  id_catalogo_nivel_desagregacion INT NULL DEFAULT NULL COMMENT 'Identificador numerico del nivel de desagragación, relacionado con la tabla de master catalogo',
  id_catalogo_periodicidad INT NULL DEFAULT NULL COMMENT 'Identificador numerico del periodicidad o Frecuencia, relacionado con la tabla de master catalogo',
  cx_periodo VARCHAR(120) NULL DEFAULT NULL COMMENT 'Descripción abierta para especificar la periodicidad o frecuencia',
  id_catalogo_tipo INT NULL DEFAULT NULL COMMENT 'Identificador numerico del tipo relacionado con la tabla de master catalogo',
  id_catalogo_unidad_medida INT NULL DEFAULT NULL COMMENT 'Identificador numerico de la unidad de medida, relacionado con la tabla de master catalogo',
  cx_unidad_medida VARCHAR(120) NULL DEFAULT NULL COMMENT 'Descripción abierta para especificar la unidad de medida',
  id_catalogo_acumulado INT NULL DEFAULT NULL COMMENT 'Identificador numerico del acumulado o periodo, relacionado con la tabla de master catalogo',
  id_catalogo_periodo_recoleccion INT NULL DEFAULT NULL COMMENT 'Identificador numerico del periodo de recolección de datos, relacionado con la tabla de master catalogo',
  cx_periodo_recoleccion VARCHAR(120) NULL DEFAULT NULL COMMENT 'Descripción abierta para especificar el periodo de recolección',
  id_catalogo_dimension INT NULL DEFAULT NULL COMMENT 'Identificador numerico del dimensionamiento, relacionado con la tabla de master catalogo',
  id_catalogo_disponibilidad INT NULL DEFAULT NULL COMMENT 'Identificador numerico del disponibilidad, relacionado con la tabla de master catalogo',
  id_catalogo_tendencia INT NULL DEFAULT NULL COMMENT 'Identificador numerico de la tendencia, relacionado con la tabla de master catalogo',
  id_catalogo_unidad_responsable INT NULL DEFAULT NULL COMMENT 'Identificador numerico de la unidad responsable asociada, relacionado con la tabla de master catalogo',
  cx_metodo_calculo VARCHAR(500) NULL DEFAULT NULL COMMENT 'Especificar el metodo de cálculo',
  cx_observacion VARCHAR(500) NULL DEFAULT NULL,
  LOCK_FLAG INT NULL DEFAULT NULL COMMENT 'Bandera de identidad requerida en la transaccionalidad de contenedores',
  id_meta INT NULL DEFAULT NULL COMMENT 'Identificador de la meta asociada al elemento, relacionada con la tabla de met_mp_meta',
  id_catalogo_elemento INT NULL DEFAULT NULL,
  PRIMARY KEY (id_elemento),
  CONSTRAINT fk_met_cp_elemento_cat_master_catalogo1
    FOREIGN KEY (id_catalogo_nivel_desagregacion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cp_elemento_cat_master_catalogo10
    FOREIGN KEY (id_catalogo_unidad_responsable)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cp_elemento_cat_master_catalogo2
    FOREIGN KEY (id_catalogo_periodicidad)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cp_elemento_cat_master_catalogo3
    FOREIGN KEY (id_catalogo_tipo)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cp_elemento_cat_master_catalogo4
    FOREIGN KEY (id_catalogo_unidad_medida)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cp_elemento_cat_master_catalogo5
    FOREIGN KEY (id_catalogo_acumulado)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cp_elemento_cat_master_catalogo6
    FOREIGN KEY (id_catalogo_periodo_recoleccion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cp_elemento_cat_master_catalogo7
    FOREIGN KEY (id_catalogo_dimension)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cp_elemento_cat_master_catalogo8
    FOREIGN KEY (id_catalogo_disponibilidad)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_cp_elemento_cat_master_catalogo9
    FOREIGN KEY (id_catalogo_tendencia)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_mp_elemento_cat_master_catalogo1
    FOREIGN KEY (id_catalogo_objetivo)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_mp_elemento_met_mp_meta1
    FOREIGN KEY (id_meta)
    REFERENCES mejoreduDB.met_mp_meta_parametro (id_metas_bienestar))
;

ALTER SEQUENCE mejoreduDB.met_mp_elemento_seq RESTART WITH 227;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cp_elemento_cat_master_catalogo1_idx ON mejoreduDB.met_mp_elemento (id_catalogo_nivel_desagregacion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cp_elemento_cat_master_catalogo2_idx ON mejoreduDB.met_mp_elemento (id_catalogo_periodicidad ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cp_elemento_cat_master_catalogo3_idx ON mejoreduDB.met_mp_elemento (id_catalogo_tipo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cp_elemento_cat_master_catalogo4_idx ON mejoreduDB.met_mp_elemento (id_catalogo_unidad_medida ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cp_elemento_cat_master_catalogo5_idx ON mejoreduDB.met_mp_elemento (id_catalogo_acumulado ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cp_elemento_cat_master_catalogo6_idx ON mejoreduDB.met_mp_elemento (id_catalogo_periodo_recoleccion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cp_elemento_cat_master_catalogo7_idx ON mejoreduDB.met_mp_elemento (id_catalogo_dimension ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cp_elemento_cat_master_catalogo8_idx ON mejoreduDB.met_mp_elemento (id_catalogo_disponibilidad ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cp_elemento_cat_master_catalogo9_idx ON mejoreduDB.met_mp_elemento (id_catalogo_tendencia ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_cp_elemento_cat_master_catalogo10_idx ON mejoreduDB.met_mp_elemento (id_catalogo_unidad_responsable ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_elemento_cat_master_catalogo1_idx ON mejoreduDB.met_mp_elemento (id_catalogo_objetivo ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_elemento_met_mp_meta1_idx ON mejoreduDB.met_mp_elemento (id_meta ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_elemento_cat_master_catalogo2_idx ON mejoreduDB.met_mp_elemento (id_catalogo_elemento ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_mp_linea_base`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_mp_linea_base (
  id_linea INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identidad del valor de la línea base',
  id_meta INT NOT NULL COMMENT 'Identificador de la meta que será asociada a la aplicación del método, relacionada con la tabla met_mp_meta',
  cx_valor VARCHAR(45) NULL DEFAULT NULL,
  ix_anhio INT NULL DEFAULT NULL,
  cx_notas VARCHAR(120) NULL DEFAULT NULL,
  cx_meta VARCHAR(500) NULL DEFAULT NULL,
  LOCK_FLAG INT NULL DEFAULT NULL COMMENT 'Bandera de identidad requerida en la transaccionalidad de contenedores',
  cx_notas_meta VARCHAR(500) NULL DEFAULT NULL COMMENT 'Descripción Notas sobre las metas',
  PRIMARY KEY (id_linea),
  CONSTRAINT fk_met_mp_linea_base_met_mp_meta_parametro1
    FOREIGN KEY (id_meta)
    REFERENCES mejoreduDB.met_mp_meta_parametro (id_metas_bienestar))
;

ALTER SEQUENCE mejoreduDB.met_mp_linea_base_seq RESTART WITH 264;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_linea_base_met_mp_meta_parametro1_idx ON mejoreduDB.met_mp_linea_base (id_meta ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_mp_serie_meta`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_mp_serie_meta (
  id_serie INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador secuencial de la serie a registrar',
  id_meta INT NOT NULL COMMENT 'Identificador de la meta que será asociada a la aplicación del método, relacionada con la tabla met_mp_meta',
  ix_tipo VARCHAR(45) NULL DEFAULT NULL COMMENT 'Tipificador del tipo de serie a registrar 1=Historica 2= Intermedias',
  ix_anhio INT NULL DEFAULT NULL COMMENT 'Año asociado a la serie',
  cx_descripcion VARCHAR(120) NULL DEFAULT NULL COMMENT 'Descripción de la serie a registrar',
  LOCK_FLAG INT NULL DEFAULT NULL COMMENT 'Bandera de identidad requerida en la transaccionalidad de contenedores',
  PRIMARY KEY (id_serie),
  CONSTRAINT fk_met_mp_serie_meta_met_mp_meta1
    FOREIGN KEY (id_meta)
    REFERENCES mejoreduDB.met_mp_meta_parametro (id_metas_bienestar))
;

ALTER SEQUENCE mejoreduDB.met_mp_serie_meta_seq RESTART WITH 3181;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_mp_serie_meta_met_mp_meta1_idx ON mejoreduDB.met_mp_serie_meta (id_meta ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_partida_adecuacion`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_partida_adecuacion (
  id_ajuste_partida INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador secuencial automatico del ajuste a la partida',
  id_partida_gasto INT NULL DEFAULT '-1' COMMENT 'Identificador de la partida, en segunda fase se relacionará con la table met_gasto_partida. En caso de no contar con idPartida indicar -1',
  id_presupuesto INT NULL DEFAULT NULL COMMENT 'Identificador del presupuesto, en segunda fase se relacionará con la table met_cortoplazo_presupuesto',
  ix_mes DOUBLE PRECISION NULL DEFAULT NULL COMMENT 'Mes a considerar en el movimiento de ajuste sobre la partida',
  ix_monto DOUBLE PRECISION NULL DEFAULT NULL COMMENT 'Monto a considerar en el movimiento de ajuste sobre la partida',
  ix_tipo INT NULL DEFAULT '1' COMMENT 'Tipo de movimiento sobre la partida 1= Ampliacion, 2= reducción, 3=traspaso, 4=reingreso',
  cve_partida VARCHAR(80) NULL DEFAULT NULL COMMENT 'Clave de la partida, es registrada en duro, no se relaciona con ninguna tabla',
  cs_estatus VARCHAR(1) NULL DEFAULT NULL COMMENT 'Bandera que permite conocer A=Activo o I=Inactivo el registro',
  id_adecuacion_solicitud INT NULL DEFAULT NULL,
  PRIMARY KEY (id_ajuste_partida))
;

ALTER SEQUENCE mejoreduDB.met_partida_adecuacion_seq RESTART WITH 82;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_partida_gasto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_partida_gasto (
  id_partida INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_presupuesto INT NOT NULL COMMENT 'Identificador del presupuesto asociado a la partida, referencia con tabla met_cortoplazo_presupuesto',
  id_catalogo_partida INT NOT NULL COMMENT 'Identificador del catalogo asociado a la partida referencia con la tabla de master catalogos',
  ix_anual DOUBLE PRECISION NOT NULL DEFAULT '0' COMMENT 'Importe del presupuesto anual asignada a la partida',
  PRIMARY KEY (id_partida),
  CONSTRAINT fk_met_partida_gasto_cat_master_catalogo1
    FOREIGN KEY (id_catalogo_partida)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_partida_gasto_met_cortoplazo_presupuesto1
    FOREIGN KEY (id_presupuesto)
    REFERENCES mejoreduDB.met_cortoplazo_presupuesto (id_presupuesto))
;

ALTER SEQUENCE mejoreduDB.met_partida_gasto_seq RESTART WITH 1877;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_partida_gasto_met_cortoplazo_presupuesto1_idx ON mejoreduDB.met_partida_gasto (id_presupuesto ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_partida_gasto_cat_master_catalogo1_idx ON mejoreduDB.met_partida_gasto (id_catalogo_partida ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_pmp_apartado_valor`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_pmp_apartado_valor (
  id_apartado_valor INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador del apartado valor',
  cx_valor TEXT NULL DEFAULT NULL COMMENT 'Valor capturado por el usuario en el apartado concepto',
  df_registro DATE NULL DEFAULT NULL COMMENT 'Fecha de registro del valor por apartado y concepto',
  dh_registro TIME(0) NULL DEFAULT NULL COMMENT 'Hora de registro de la información en el apartado concepto',
  cs_estatus VARCHAR(1) NULL DEFAULT NULL COMMENT 'Clave del estatus que guarda el valor capturado A=Activo B= Baja',
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que registra la estructura en el año, referencia con la tabla seg_usuario',
  ic_apartadoconcepto INT NOT NULL COMMENT 'Identificador del apartado concepto que registra información, referencia con la tabla met_pmp_apartado_concepto',
  PRIMARY KEY (id_apartado_valor),
  CONSTRAINT fk_met_pmp_apartado_valor_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_pmp_apartado_valor_seg_usuario1_idx ON mejoreduDB.met_pmp_apartado_valor (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_presupuestal`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_presupuestal (
  id_presupuestal INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  df_registro TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP,
  df_actualizacion TIMESTAMP(0) NULL DEFAULT NULL,
  df_aprobacion TIMESTAMP(0) NULL DEFAULT NULL,
  cs_estatus VARCHAR(1) NULL DEFAULT NULL,
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave asociada al usuario que registra en el año indicado, referencia con la tabla seg_usuario',
  id_anhio INT NOT NULL COMMENT 'Identificador del año de planeación de entrada se cargan los 5 ultimos años y el vigente, se relaciona con la tabla met_anho_planeacion',
  id_tipo_programa INT NOT NULL COMMENT 'Identificador del tipo del programa presupuestal registrado, el cuál podra ser P016, M001 y O001',
  id_validacion INT NULL DEFAULT NULL,
  id_validacion_planeacion INT NULL DEFAULT NULL,
  id_validacion_supervisor INT NULL DEFAULT NULL,
  PRIMARY KEY (id_presupuestal),
  CONSTRAINT fk_met_presupuestal_cat_master_catalogo1
    FOREIGN KEY (id_tipo_programa)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_presupuestal_met_anho_planeacion2
    FOREIGN KEY (id_anhio)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio),
  CONSTRAINT fk_met_presupuestal_seg_usuario2
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_presupuestal_seq RESTART WITH 32;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_presupuestal_seg_usuario2_idx ON mejoreduDB.met_presupuestal (cve_usuario ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_presupuestal_met_anho_planeacion2_idx ON mejoreduDB.met_presupuestal (id_anhio ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_presupuestal_cat_master_catalogo1_idx ON mejoreduDB.met_presupuestal (id_tipo_programa ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_presupuestal_justificacion`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_presupuestal_justificacion (
  id_presupuestal_justificacion INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  periodo VARCHAR(120) NULL DEFAULT NULL,
  meta_esperada VARCHAR(50) NULL DEFAULT NULL,
  numerador VARCHAR(50) NULL DEFAULT NULL,
  denominador VARCHAR(50) NULL DEFAULT NULL,
  indicador VARCHAR(50) NULL DEFAULT NULL,
  tipo_ajuste VARCHAR(50) NULL DEFAULT NULL,
  causas VARCHAR(120) NULL DEFAULT NULL,
  efectos VARCHAR(120) NULL DEFAULT NULL,
  otros_motivos VARCHAR(120) NULL DEFAULT NULL,
  id_ficha_indicadores INT NOT NULL,
  PRIMARY KEY (id_presupuestal_justificacion),
  CONSTRAINT fk_Presupuestal_justificacion_ficha_indicador
    FOREIGN KEY (id_ficha_indicadores)
    REFERENCES mejoreduDB.met_ficha_indicadores (id_ficha_indicadores))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_Presupuestal_justificacion_ficha_indicador ON mejoreduDB.met_presupuestal_justificacion (id_ficha_indicadores ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_presupuesto_calendario`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_presupuesto_calendario (
  id_calendario INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  ix_mes INT NOT NULL,
  ix_monto DOUBLE PRECISION NULL DEFAULT '0',
  id_partida INT NOT NULL COMMENT 'Identificador de la partida de gastos asociada al monto por mes, referencia a tabla de partida de gastos',
  PRIMARY KEY (id_calendario),
  CONSTRAINT fk_met_presupuesto_calendario_met_partida_gasto1
    FOREIGN KEY (id_partida)
    REFERENCES mejoreduDB.met_partida_gasto (id_partida)
    ON DELETE CASCADE)
;

ALTER SEQUENCE mejoreduDB.met_presupuesto_calendario_seq RESTART WITH 22317;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_presupuesto_calendario_met_partida_gasto1_idx ON mejoreduDB.met_presupuesto_calendario (id_partida ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_problemapublico`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_problemapublico (
  id_problema INT NOT NULL COMMENT 'Identificador del problema publico en la tabla met_presupuestal_problemapublico',
  cx_poblacion_area_afectada VARCHAR(50) NOT NULL COMMENT 'Campo que almacena la poblacion o area afectada del problema',
  cx_problematica_central VARCHAR(120) NOT NULL COMMENT 'Campo que almacena la problematica central',
  cx_magnitud_problema VARCHAR(110) NOT NULL COMMENT 'Campo que almacena la magnitud del problema',
  cx_estrategia_cobertura VARCHAR(120) NOT NULL COMMENT 'Campo que almacena la estrategia de cobertura del problema',
  PRIMARY KEY (id_problema))
;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_proyecto_contribucion`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_proyecto_contribucion (
  id_proycontri INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  ix_tipo_contri INT NULL DEFAULT NULL COMMENT 'tipificador de la contribución 1=Ordinaria, 2= especial, 3= PNC, ',
  id_proyecto INT NOT NULL COMMENT 'identificador del proyecto que asociará la contribución, relación con tabla de corto plazo de proyecto',
  id_catalogo_contribucion INT NOT NULL COMMENT 'Identificador de la contribucion, referencia con tabla de master catalogo',
  LOCK_FLAG INT NULL DEFAULT NULL COMMENT 'Bandera de control transaccional en ambiente de contenedores',
  PRIMARY KEY (id_proycontri),
  CONSTRAINT fk_met_proyecto_contribucion_cat_master_catalogo1
    FOREIGN KEY (id_catalogo_contribucion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_met_pryecto_contribucion_met_cortoplazo_proyecto1
    FOREIGN KEY (id_proyecto)
    REFERENCES mejoreduDB.met_cortoplazo_proyecto (id_proyecto))
;

ALTER SEQUENCE mejoreduDB.met_proyecto_contribucion_seq RESTART WITH 2625;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_pryecto_contribucion_met_cortoplazo_proyecto1_idx ON mejoreduDB.met_proyecto_contribucion (id_proyecto ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_proyecto_contribucion_cat_master_catalogo1_idx ON mejoreduDB.met_proyecto_contribucion (id_catalogo_contribucion ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_registro_estructura`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_registro_estructura (
  met_anho_planeacion_id_anhio INT NOT NULL,
  CONSTRAINT fk_met_registro_estructura_met_anho_planeacion1
    FOREIGN KEY (met_anho_planeacion_id_anhio)
    REFERENCES mejoreduDB.met_anho_planeacion (id_anhio))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_registro_estructura_met_anho_planeacion1_idx ON mejoreduDB.met_registro_estructura (met_anho_planeacion_id_anhio ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_revision_trimestral`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_revision_trimestral (
  id_revision_trimestral INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  id_validacion_planeacion INT NULL DEFAULT NULL,
  id_validacion_administracion INT NULL DEFAULT NULL,
  ix_ciclo_validacion INT NULL DEFAULT NULL,
  cs_estatus CHAR(1) NULL DEFAULT NULL,
  trimestre INT NULL DEFAULT NULL,
  id_actividad INT NULL DEFAULT NULL,
  PRIMARY KEY (id_revision_trimestral),
  CONSTRAINT met_revision_trimestral_ibfk_1
    FOREIGN KEY (id_actividad)
    REFERENCES mejoreduDB.met_cortoplazo_actividad (id_actividad),
  CONSTRAINT met_revision_trimestral_ibfk_2
    FOREIGN KEY (id_validacion_planeacion)
    REFERENCES mejoreduDB.met_validacion (id_validacion))
;

ALTER SEQUENCE mejoreduDB.met_revision_trimestral_seq RESTART WITH 39;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX met_revision_trimestral_ibfk_1_idx ON mejoreduDB.met_revision_trimestral (id_actividad ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX met_revision_trimestral_ibfk_2_idx ON mejoreduDB.met_revision_trimestral (id_validacion_planeacion ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_revision_validacion`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_revision_validacion (
  id_revision INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identidad de revisión que se genera en automatico al guardar la revisión',
  id_elemento_validar INT NOT NULL COMMENT 'Identificador del elemento que es validado, met_elemento_validar',
  id_validacion INT NULL DEFAULT NULL COMMENT 'Identificador de validación asociada, met_elemento_validar',
  cx_comentario VARCHAR(500) NULL DEFAULT NULL COMMENT 'Comentario que almacenara de los elementos de validacion\n',
  ix_check INT NULL DEFAULT '0' COMMENT 'MAnejará el check sobre el elemento 1= Palomeado, 0=No palomeado por defecto',
  PRIMARY KEY (id_revision),
  CONSTRAINT fk_met_revision_validacion_met_elemento_validar1
    FOREIGN KEY (id_elemento_validar)
    REFERENCES mejoreduDB.met_elemento_validar (id_elemento),
  CONSTRAINT fk_met_revision_validacion_met_validacion1
    FOREIGN KEY (id_validacion)
    REFERENCES mejoreduDB.met_validacion (id_validacion))
;

ALTER SEQUENCE mejoreduDB.met_revision_validacion_seq RESTART WITH 15180;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_revision_validacion_met_elemento_validar1_idx ON mejoreduDB.met_revision_validacion (id_elemento_validar ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_revision_validacion_met_validacion1_idx ON mejoreduDB.met_revision_validacion (id_validacion ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_rubrica`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_rubrica (
  id_rubrica INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador de la rublica asociada al proyecto-actividad-producto, incremental automatico',
  cd_rubrica VARCHAR(500) NOT NULL,
  cd_estatus VARCHAR(1) NOT NULL COMMENT 'Bandera de estatus del registro A=Activo, B=Baja',
  PRIMARY KEY (id_rubrica))
;

ALTER SEQUENCE mejoreduDB.met_rubrica_seq RESTART WITH 6;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_secuencia_negocio`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_secuencia_negocio (
  id_secuencia INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador de la secuencia por unidad administrativa',
  id_unidad_admiva INT NOT NULL COMMENT 'Identificador de la unidad administrativa, relación con tabla de master catagolos',
  ix_secuencia INT NULL DEFAULT NULL,
  LOCK_FLAG INT NULL DEFAULT NULL COMMENT 'BAndera para conocer el id transaccional en ambiente de contenedores',
  PRIMARY KEY (id_secuencia),
  CONSTRAINT fk_met_proyecto_secuencia_cat_master_catalogo1
    FOREIGN KEY (id_unidad_admiva)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_proyecto_secuencia_cat_master_catalogo1_idx ON mejoreduDB.met_secuencia_negocio (id_unidad_admiva ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_secuencia_solicitud`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_secuencia_solicitud (
  id_secuencia INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador de la secuencia por unidad administrativa',
  id_unidad_admiva INT NOT NULL COMMENT 'Identificador de la unidad administrativa, relación con tabla de master catagolos',
  ix_secuencia INT NULL DEFAULT NULL,
  LOCK_FLAG INT NULL DEFAULT NULL COMMENT 'Bandera para conocer el id transaccional en ambiente de contenedores',
  PRIMARY KEY (id_secuencia),
  CONSTRAINT fk_met_solicitud_secuencia_cat_master_catalogo1
    FOREIGN KEY (id_unidad_admiva)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo))
;

ALTER SEQUENCE mejoreduDB.met_secuencia_solicitud_seq RESTART WITH 2;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_secuencia_cat_master_catalogo1_idx ON mejoreduDB.met_secuencia_solicitud (id_unidad_admiva ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_solicitud_comentario`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_solicitud_comentario (
  id_comentario INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  cd_comentario VARCHAR(500) NOT NULL,
  df_seguimiento DATE NOT NULL,
  dh_seguimiento TIME(0) NULL DEFAULT NULL,
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que registra el comentario, relación con la tabla seg_usuario',
  id_solicitud INT NOT NULL COMMENT 'Identificador de la solicitud asociada al comentario, relación con tabla met_solicitud',
  PRIMARY KEY (id_comentario),
  CONSTRAINT fk_met_solicitud_comentario_met_solicitud1
    FOREIGN KEY (id_solicitud)
    REFERENCES mejoreduDB.met_solicitud (id_solicitud),
  CONSTRAINT fk_met_solicitud_comentario_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_solicitud_comentario_seq RESTART WITH 147;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_comentario_seg_usuario1_idx ON mejoreduDB.met_solicitud_comentario (cve_usuario ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_comentario_met_solicitud1_idx ON mejoreduDB.met_solicitud_comentario (id_solicitud ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_solicitud_firma`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_solicitud_firma (
  id_firma INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  df_firma DATE NULL DEFAULT NULL,
  dh_firma TIME(0) NULL DEFAULT NULL,
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que realiza la firma, relacionada con la tabla seg_usuario',
  id_solicitud INT NOT NULL COMMENT 'Identificador de la solicitud asociada a la firma, se relaciona con la tabla met_solicitud',
  id_archivo INT NOT NULL COMMENT 'Identificador del archivo asociado a la forma de la solicitud, se relaciona con la tabla met_archivo',
  PRIMARY KEY (id_firma),
  CONSTRAINT fk_met_solicitud_firma_met_archivo1
    FOREIGN KEY (id_archivo)
    REFERENCES mejoreduDB.met_archivo (id_archivo),
  CONSTRAINT fk_met_solicitud_firma_met_solicitud1
    FOREIGN KEY (id_solicitud)
    REFERENCES mejoreduDB.met_solicitud (id_solicitud),
  CONSTRAINT fk_met_solicitud_firma_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.met_solicitud_firma_seq RESTART WITH 56;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_firma_seg_usuario1_idx ON mejoreduDB.met_solicitud_firma (cve_usuario ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_firma_met_solicitud1_idx ON mejoreduDB.met_solicitud_firma (id_solicitud ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_solicitud_firma_met_archivo1_idx ON mejoreduDB.met_solicitud_firma (id_archivo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_tipo_causaefecto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_tipo_causaefecto (
  id_tipo_causaefecto INT NOT NULL COMMENT 'Identificador que especifica el tipo de registro 1. causa, 2. efecto',
  cd_tipo VARCHAR(50) NULL DEFAULT NULL COMMENT 'descripcion del tipo de registro',
  PRIMARY KEY (id_tipo_causaefecto))
;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`met_validacion_rubrica`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.met_validacion_rubrica (
  id_validacion_rubrica INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identidad autoincrementable de la asociación de rubricas a una validación',
  df_registro DATE NULL DEFAULT NULL COMMENT 'Fecha de registro de la asociación',
  id_rubrica INT NOT NULL COMMENT 'Identificador de la rubrica asociada al proyecto-actividad-producto, incremental automatico. Relacionado con la tabla met_rubrica',
  cx_observaciones VARCHAR(500) NULL DEFAULT NULL COMMENT 'Observaciones realizadas al rubro de la rubrica calificada',
  ix_puntuacion INT NULL DEFAULT NULL COMMENT 'Puntuacion o valoración al rubro asociado a la rubrica (0-3)',
  id_validacion INT NOT NULL COMMENT 'Identificador de la validación o revisión realizada en corto plazo la cual será asociada a la rubrica, relacionada con la tabla met_validacion',
  PRIMARY KEY (id_validacion_rubrica),
  CONSTRAINT fk_met_producto_rubrica_met_rubrica1
    FOREIGN KEY (id_rubrica)
    REFERENCES mejoreduDB.met_rubrica (id_rubrica),
  CONSTRAINT fk_met_producto_rubrica_met_validacion1
    FOREIGN KEY (id_validacion)
    REFERENCES mejoreduDB.met_validacion (id_validacion))
;

ALTER SEQUENCE mejoreduDB.met_validacion_rubrica_seq RESTART WITH 931;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_producto_rubrica_met_rubrica1_idx ON mejoreduDB.met_validacion_rubrica (id_rubrica ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_met_producto_rubrica_met_validacion1_idx ON mejoreduDB.met_validacion_rubrica (id_validacion ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`seg_contrasenhia`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.seg_contrasenhia (
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave del usuario a registrar contraseña, se relaciona con la tabla de seg_usuario',
  cx_palabra_secreta VARCHAR(120) NOT NULL,
  df_fecha DATE NULL DEFAULT NULL,
  cs_estatus VARCHAR(1) NOT NULL COMMENT 'Clave del estatus que guarda la contraseña A = Activa, B = Bloqueada, I = Inactiva',
  ix_numero_intentos INT NOT NULL COMMENT 'Numero de intentos erroneos de acceso al sistema',
  id_contra INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador de la contraseña del usuario',
  LOCK_FLAG INT NULL DEFAULT NULL,
  PRIMARY KEY (id_contra),
  CONSTRAINT fk_seg_contrasenhia_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.seg_contrasenhia_seq RESTART WITH 58;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_seg_contrasenhia_seg_usuario1 ON mejoreduDB.seg_contrasenhia (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`seg_facultad`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.seg_facultad (
  id_facultad INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador de la facultad, opción del sistema a considerar como asignable a un tipo de usuario(rol)\n',
  cd_facultad VARCHAR(45) NULL DEFAULT NULL COMMENT 'Descripción de la facultad',
  cs_status VARCHAR(1) NULL DEFAULT NULL COMMENT 'Estatus que guarda la facultad, podrá ser 1 activa, 0 Baja, 2 Bloqueda',
  LOCK_FLAG INT NULL DEFAULT NULL,
  ce_facultad VARCHAR(45) NULL DEFAULT NULL COMMENT 'Clave externa de la facultad, la cual será reconocida en el sistema y será la clave que debe retornar el servicio al ser un usuario valido en el arreglo de roles asociados al usuario',
  PRIMARY KEY (id_facultad))
;

ALTER SEQUENCE mejoreduDB.seg_facultad_seq RESTART WITH 6;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`seg_perfil_laboral`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.seg_perfil_laboral (
  id_perfil_laboral INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador numerico autoincrementable del perfil del usuario, podrá manejar perfil historico.',
  ci_numero_empleado INT NULL DEFAULT NULL COMMENT 'Numero de empleado valor numerico.',
  cx_puesto VARCHAR(120) NULL DEFAULT NULL COMMENT 'Descripción del puesto al que pertenece el usuario',
  cx_telefono_oficina VARCHAR(45) NULL DEFAULT NULL COMMENT 'Cadena que permite registrar el número de teléfono del usuario',
  cx_extension VARCHAR(45) NULL DEFAULT NULL COMMENT 'Cadena que permite registrar el número de la extensión telefónica del usuario',
  cx_dg_administacion VARCHAR(45) NULL DEFAULT NULL COMMENT 'Descripción de la dirección general a la que pertenece el usuario',
  cve_usuario VARCHAR(45) NOT NULL COMMENT 'Clave del usuario que será asociado a la información del laboral del usuario',
  id_catalogo_unidad INT NOT NULL COMMENT 'Identificador del catálogo de unidad administrativa (Unidad responsable), relacionada con la tabla cat_master_catalogo',
  id_catalogo_direccion INT NOT NULL COMMENT 'Identificador del catálogo de direccion general asociada al usuario, relacionada con la tabla cat_master_catalogo',
  cs_status VARCHAR(1) NULL DEFAULT NULL COMMENT 'Estatus del registro de la información laboral, A activo B Baja',
  LOCK_FLAG INT NULL DEFAULT NULL,
  id_catalogo_area INT NOT NULL,
  ix_nivel INT NULL DEFAULT '1' COMMENT 'Nivel de supervisión del usuario',
  id_archivo INT NULL DEFAULT NULL COMMENT 'Identificador del archivo de firma asociado al usuario, permitirá cargar una archivo que servirá para asociarlo a la firma autografa.',
  it_titular INT NULL DEFAULT '0' COMMENT 'Tipificador del usuario para conocer si es  1 = titular o 0=no es titular',
  PRIMARY KEY (id_perfil_laboral),
  CONSTRAINT fk_seg_perfil_laboral_cat_master_catalogo1
    FOREIGN KEY (id_catalogo_unidad)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_seg_perfil_laboral_cat_master_catalogo2
    FOREIGN KEY (id_catalogo_direccion)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_seg_perfil_laboral_cat_master_catalogo3
    FOREIGN KEY (id_catalogo_area)
    REFERENCES mejoreduDB.cat_master_catalogo (id_catalogo),
  CONSTRAINT fk_seg_perfil_laboral_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.seg_perfil_laboral_seq RESTART WITH 59;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_seg_perfil_laboral_seg_usuario1_idx ON mejoreduDB.seg_perfil_laboral (cve_usuario ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_seg_perfil_laboral_cat_master_catalogo1_idx ON mejoreduDB.seg_perfil_laboral (id_catalogo_unidad ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_seg_perfil_laboral_cat_master_catalogo2_idx ON mejoreduDB.seg_perfil_laboral (id_catalogo_direccion ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_seg_perfil_laboral_cat_master_catalogo3_idx ON mejoreduDB.seg_perfil_laboral (id_catalogo_area ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_seg_perfil_laboral_met_archivo1_idx ON mejoreduDB.seg_perfil_laboral (id_archivo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`seg_periodo_habilitacion`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.seg_periodo_habilitacion (
  id_periodo_habilitacion INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  cx_modulo VARCHAR(45) NOT NULL,
  cx_submodulo VARCHAR(45) NOT NULL,
  cx_opcion VARCHAR(45) NULL DEFAULT NULL,
  df_inicio VARCHAR(45) NOT NULL,
  df_final VARCHAR(45) NOT NULL,
  cve_usuario VARCHAR(45) NOT NULL,
  cs_estatus VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (id_periodo_habilitacion),
  CONSTRAINT cve_usuario
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.seg_periodo_habilitacion_seq RESTART WITH 3;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX cve_usuario_idx ON mejoreduDB.seg_periodo_habilitacion (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`seg_persona`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.seg_persona (
  id_persona INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador de la persona que será registrada en el sistema',
  cx_nombre_completo VARCHAR(120) NULL DEFAULT NULL COMMENT 'Nombre completo de la persona',
  cx_nombre VARCHAR(120) NULL DEFAULT NULL COMMENT 'Nombre de la persona a registrar',
  cx_primer_apellido VARCHAR(120) NULL DEFAULT NULL COMMENT 'Primer apellido de la persona a registrar',
  cx_segundo_apellido VARCHAR(120) NULL DEFAULT NULL COMMENT 'Segundo apellido de la persona a registrar',
  df_fecha_nacimiento DATE NULL DEFAULT NULL,
  cx_correo VARCHAR(120) NULL DEFAULT NULL COMMENT 'Cuenta de correo electrónico de la persona no puede ser repetido en el sistema',
  LOCK_FLAG INT NULL DEFAULT NULL,
  PRIMARY KEY (id_persona))
;

ALTER SEQUENCE mejoreduDB.seg_persona_seq RESTART WITH 72;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE UNIQUE INDEX cx_correo_UNIQUE ON mejoreduDB.seg_persona (cx_correo ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`seg_usuario_facultad`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.seg_usuario_facultad (
  id_usu_fac INT NOT NULL GENERATED ALWAYS AS IDENTITY COMMENT 'Identificador de la relación entre tabla de usuarios vs facultades',
  id_registro INT NOT NULL COMMENT 'Identificador de registro del evento, relacionada con tabla bit_registro',
  id_facultad INT NOT NULL,
  id_tipo_usuario INT NOT NULL COMMENT 'Identificador del tipo de usuario al que será asignada la facultad',
  LOCK_FLAG INT NULL DEFAULT NULL,
  PRIMARY KEY (id_usu_fac, id_facultad, id_tipo_usuario),
  CONSTRAINT fk_seg_usuario_facultad_seg_facultad1
    FOREIGN KEY (id_facultad)
    REFERENCES mejoreduDB.seg_facultad (id_facultad),
  CONSTRAINT fk_seg_usuario_facultad_seg_tipo_usuario1
    FOREIGN KEY (id_tipo_usuario)
    REFERENCES mejoreduDB.seg_tipo_usuario (id_tipo_usuario))
;

ALTER SEQUENCE mejoreduDB.seg_usuario_facultad_seq RESTART WITH 37;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_seg_usuario_facultad_facultad_idx ON mejoreduDB.seg_usuario_facultad (id_facultad ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_seg_usuario_facultad_tipo_usuario_idx ON mejoreduDB.seg_usuario_facultad (id_tipo_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`seg_usuario_persona`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.seg_usuario_persona (
  cs_estatus VARCHAR(1) NOT NULL COMMENT 'Clave del estatus que guarda el registro A Activo I Inactivo B Bloqueado',
  id_persona INT NOT NULL COMMENT 'Identificador de la persona, se relaciona con la tabla seg_persona',
  cve_usuario VARCHAR(45) NOT NULL,
  id_usuario_persona INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  LOCK_FLAG INT NULL DEFAULT NULL,
  PRIMARY KEY (id_usuario_persona),
  CONSTRAINT fk_seg_usuario_persona_seg_persona1
    FOREIGN KEY (id_persona)
    REFERENCES mejoreduDB.seg_persona (id_persona),
  CONSTRAINT fk_seg_usuario_persona_seg_usuario1
    FOREIGN KEY (cve_usuario)
    REFERENCES mejoreduDB.seg_usuario (cve_usuario))
;

ALTER SEQUENCE mejoreduDB.seg_usuario_persona_seq RESTART WITH 91;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_seg_usuario_persona_idx ON mejoreduDB.seg_usuario_persona (id_persona ASC) VISIBLE;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX fk_seg_usuario_persona_usuario_idx ON mejoreduDB.seg_usuario_persona (cve_usuario ASC) VISIBLE;


-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** `.`submod_planeacion_mediano`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.submod_planeacion_mediano (
  id INT NOT NULL,
  cx_Titulo VARCHAR(45) NULL DEFAULT NULL,
  df_Fecha DATE NULL DEFAULT NULL,
  dh_Hora TIME(0) NULL DEFAULT NULL,
  cx_Documento VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (id))
;

SET SCHEMA 'mejoreduDB' ;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`VT_CP_PROYECTO_APARTADO_ESTATUS`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.VT_CP_PROYECTO_APARTADO_ESTATUS (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_accion_puntual`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_accion_puntual (cc_externa INT, cd_opcion INT, df_baja INT, estatus INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_actividadIndicadorPI`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_actividadIndicadorPI (id_actividad INT, idProducto INT, id_catalogo_indicador INT, nomIndicador INT, cveIndicadorPI INT, cveIndicadorPI2 INT, entregables INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_actividadObjetivo`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_actividadObjetivo (cve_usuario INT, id_anhio INT, id_proyecto INT, id_catalogo_unidad INT, id_actividad INT, id_catalogo_objetivo INT, objetivoPrioritario INT, cveObjetivo INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_anhio_vigente`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_anhio_vigente (id_anhio INT, fecha INT, hora INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_autenticador`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_autenticador (id_contra INT, cve_usuario INT, cx_palabra_secreta INT, cs_estatus INT, cx_nombre INT, cx_primer_apellido INT, cx_segundo_apellido INT, cx_correo INT, id_tipo_usuario INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_cp_proyecto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_cp_proyecto (id_proyecto INT, cve_proyecto INT, cx_nombre_proyecto INT, cx_objetivo INT, cx_objetivo_prioritario INT, cve_usuario INT, id_anhio INT, df_proyecto INT, dh_proyecto INT, cs_estatus INT, id_archivo INT, cx_nombre_unidad INT, cx_alcance INT, cx_fundamentacion INT, LOCK_FLAG INT, cve_unidad INT, ix_fuente_registro INT, df_actualizacion INT, dh_actualizacion INT, cve_usuario_actualiza INT, id_validacion INT, id_validacion_planeacion INT, id_validacion_supervisor INT, id_catalogo_unidad INT, it_semantica INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_entregable_producto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_entregable_producto (id_anhio INT, cve_proyecto INT, id_proyecto INT, cve_unidad INT, id_catalogo_unidad INT, cve_usuario INT, cx_nombre_proyecto INT, id_actividad INT, id_producto INT, id_catalogo_categorizacion INT, id_catalogo_tipo_producto INT, id_prodcal INT, ci_monto INT, ci_mes INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_entregables_mir`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_entregables_mir (id_indicador_resultado INT, cx_nivel INT, cx_nombre INT, id_catalogo INT, id_anhio INT, cd_opcion INT, ci_mes INT, ci_programado INT, ci_entregado INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_estrategia`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_estrategia (cc_externa INT, cd_opcion INT, df_baja INT, estatus INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_estrategia_actividades`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_estrategia_actividades (id_estaci INT, ix_tipo INT, id_actividad INT, id_catalogo INT, LOCK_FLAG INT, id_proyecto INT, cve_usuario INT, cx_nombre_actividad INT, cve_actividad INT, cs_estatus INT, cx_nombre_proyecto INT, id_anhio INT, cve_proyecto INT, id_catalogo_unidad INT, cd_opcion INT, cc_externa INT, id_catalogo_padre INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_estructura`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_estructura (id_estructura INT, df_registro INT, dh_registro INT, cve_usuario INT, cd_nombre_programa INT, cd_analisis_estado INT, cd_problemas_publicos INT, id_catalogo_alineacion INT, cs_esatus INT, df_actualizacion INT, dh_actualizacion INT, LOCK_FLAG INT, cve_usuario_actualiza INT, id_anhio INT, contarMeta INT, contarParams INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_indicadores_mir`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_indicadores_mir (id_producto INT, cs_estatus INT, id_catalogo_indicador INT, cd_opcion INT, cc_externa INT, cc_externaDos INT, id_anhio INT, id_catalogo_unidad INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_indicadores_mirV2`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_indicadores_mirV2 (id_indicador INT, id_producto INT, cs_estatus INT, id_catalogo_indicador INT, cd_opcion INT, cc_externa INT, cc_externaDos INT, id_anhio INT, id_catalogo_unidad INT, id_prodcal INT, mes INT, entregables INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_metasBienestar`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_metasBienestar (cveUsuario INT, anhio INT, id_proyecto INT, id_catalogo_unidad INT, id_catalogo_indicador INT, idMeta INT, cveObjetivo INT, cveMetaPara INT, nomIndicador INT, periodicidad INT, periodicidadOtro INT, unidadMedida INT, unidadMedidaOtro INT, tendencia INT, tendenciaOtro INT, fuente INT, fuenteOtro INT, entregables INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_metasBienestarV2`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_metasBienestarV2 (id_elemento INT, id_indicador_pi INT, id_anhio INT, cve_usuario INT, id_unidad INT, cve_objetivo INT, periodicidad INT, periodicidad_otro INT, unidad_medida INT, unidad_medida_otro INT, tendencia INT, indicador INT, entregables INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_objetivoEstraAccion`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_objetivoEstraAccion (id_anhio INT, id_catalogo INT, cd_opcion INT, cc_externa INT, idCatEstra INT, cd_opcionEstra INT, cc_externaEstra INT, idCatAcc INT, cd_opcionAcc INT, cc_externaAcc INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_objetivo_prioritario`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_objetivo_prioritario (cc_externa INT, cd_opcion INT, df_baja INT, estatus INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_paa_aprobado`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_paa_aprobado (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_presupuesto_programado_proyecto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_presupuesto_programado_proyecto (id_proyecto INT, cveProyecto INT, cx_nombre_proyecto INT, ixAnual INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_presupuesto_proyecto_unidad`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_presupuesto_proyecto_unidad (id_anhio INT, id_catalogo_unidad INT, cve_unidad INT, id_proyecto INT, cveProyecto INT, cx_nombre_proyecto INT, totalAnualAsignado INT, totalCalendarizado INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_presupuesto_unidad`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_presupuesto_unidad (id_anhio INT, id_catalogo_unidad INT, cve_unidad INT, totalAnualAsignado INT, totalCalendarizado INT, cc_externaDos INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_productoActivoEntregable`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_productoActivoEntregable (id_producto INT, entregables INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_producto_categoria`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_producto_categoria (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_producto_trimestre`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_producto_trimestre (id_producto INT, id_actividad INT, ix_trimestre INT, productosEntregados INT, entregablesProgramados INT, entregablesFinalizados INT, presupuesto INT, presupuestoUtilizado INT, adecuaciones_acciones INT, adecuaciones_presupuesto INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_productos_asociados_mir`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_productos_asociados_mir (id_producto INT, id_catalogo_indicador INT, cc_externa INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_productos_cancelados`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_productos_cancelados (id_adecuacion_producto INT, id_producto_modificacion INT, id_producto_referencia INT, id_adecuacion_solicitud INT, id_catalogo_modificacion INT, id_solicitud INT, id_catalogo_estatus INT, id_catalogo_anhio INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_productos_mir`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_productos_mir (id_producto INT, cs_estatus INT, cc_externa INT, cc_externaDos INT, cve_producto INT, cve_actividad INT, cve_proyecto INT, categorizacion INT, tipo_producto INT, cx_nombre INT, id_anhio INT, id_catalogo_unidad INT, cve_unidad INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_proyecto_apartado_estatus`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_proyecto_apartado_estatus (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_proyecto_apartado_estatus_plan`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_proyecto_apartado_estatus_plan (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_proyecto_apartado_estatus_presu`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_proyecto_apartado_estatus_presu (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_roles`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_roles (id_tipo_usuario INT, cd_tipo_usuario INT, ce_facultad INT, id_facultad INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_secuencia_actividad`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_secuencia_actividad (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_secuencia_folioSolicitud`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_secuencia_folioSolicitud (id INT, id_catalogo_unidad INT, secuencia INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_secuencia_negocio`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_secuencia_negocio (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_secuencia_presupuesto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_secuencia_presupuesto (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_secuencia_producto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_secuencia_producto (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_secuencia_solicitud`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_secuencia_solicitud (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_secuencia_solicitud_anhio`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_secuencia_solicitud_anhio (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_seguimiento_adecua_registro`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_seguimiento_adecua_registro (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_seguimiento_extractores`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_seguimiento_extractores (id_proyecto INT, id_anhio INT, id_catalogo_unidad INT, cve_proyecto INT, cx_nombre_proyecto INT, id_actividad INT, cve_actividad INT, cx_nombre_actividad INT, id_producto INT, cve_producto INT, cx_nombre INT, id_presupuesto INT, cve_accion INT, cx_nombre_accion INT, id_solicitud INT, cve_folio_solicitud INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_seguimiento_mir`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_seguimiento_mir (id_indicador_resultado INT, id_anhio INT, nivel_MIR INT, indicador INT, id_catalogo_unidad INT, unidad_corta INT, unidad_larga INT, mes INT, programado INT, entregado INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_seguimiento_proyecto`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_seguimiento_proyecto (id_proyecto INT, cve_proyecto INT, cx_nombre_proyecto INT, cx_objetivo INT, cx_objetivo_prioritario INT, cve_usuario INT, id_anhio INT, df_proyecto INT, dh_proyecto INT, cs_estatus INT, id_archivo INT, cx_nombre_unidad INT, cx_alcance INT, cx_fundamentacion INT, LOCK_FLAG INT, cve_unidad INT, ix_fuente_registro INT, df_actualizacion INT, dh_actualizacion INT, cve_usuario_actualiza INT, id_validacion INT, id_validacion_planeacion INT, id_validacion_supervisor INT, id_catalogo_unidad INT, it_semantica INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO ***  for view `mejoreduDB`.`vt_tabla_mir`
-- SQLINES DEMO *** ------------------------------------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS mejoreduDB.vt_tabla_mir (id INT);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** JA_ACCIONES_POR_CVEESTRATEGIA
-- SQLINES DEMO *** ------------------------------------

DELIMITER $$
SET SCHEMA 'mejoreduDB'$$
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE OR REPLACE  PROCEDURE PROC_BAJA_ACCIONES_POR_CVEESTRATEGIA(IN cveEstrategia VARCHAR(32), OUT respuesta VARCHAR(8))
    /* COMMENT 'Da de baja las acciones asociadas a una estrategia' */
AS $$
BEGIN
	update cat_master_catalogo set df_baja = current_date where id_catalogo_padre=640 and cd_descripcionDos like CONCAT(cveEstrategia,'%');
	respuesta:='EXITOSO';
    select @respuesta;
    
END$$

DELIMITER ;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** JA_ESTRATEGIAS_POR_CVEOBJETIVO
-- SQLINES DEMO *** ------------------------------------

DELIMITER $$
SET SCHEMA 'mejoreduDB'$$
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE OR REPLACE  PROCEDURE PROC_BAJA_ESTRATEGIAS_POR_CVEOBJETIVO(IN cveObjetivo VARCHAR(32), OUT respuesta VARCHAR(8))
    /* COMMENT 'Da de baja las estrategias y acciones asociadas a un objertivo' */
AS $$
BEGIN
	update cat_master_catalogo set df_baja = current_date where id_catalogo_padre = 771 and cc_externa = cveObjetivo;
	update cat_master_catalogo set df_baja = current_date where id_catalogo_padre=640 and cd_descripcionDos like CONCAT(cveObjetivo,'%');
	respuesta:='EXITOSO';
    select @respuesta;
    
END$$

DELIMITER ;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`VT_CP_PROYECTO_APARTADO_ESTATUS`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.VT_CP_PROYECTO_APARTADO_ESTATUS;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.VT_CP_PROYECTO_APARTADO_ESTATUS AS select row_number() OVER (ORDER BY ApartadoInfo.id_proyecto desc )  AS id_secuencia,ApartadoInfo.apartado AS apartado,max(ApartadoInfo.id_proyecto) AS id_proyecto,min(ApartadoInfo.idLlave) AS idLlave,ApartadoInfo.cs_estatus AS cs_estatus from ((select 'Proyecto' AS apartado union select 'Actividad' AS Actividad union select 'Producto' AS Producto union select 'Presupuesto' AS Presupuesto) ApartadoTempo left join (select 'Proyecto' AS apartado,mejoreduDB.met_cortoplazo_proyecto.id_proyecto AS id_proyecto,mejoreduDB.met_cortoplazo_proyecto.id_proyecto AS idLlave,mejoreduDB.met_cortoplazo_proyecto.cs_estatus AS cs_estatus from mejoreduDB.met_cortoplazo_proyecto where (mejoreduDB.met_cortoplazo_proyecto.cs_estatus <> 'B') union all select 'Actividad' AS Actividad,mca.id_proyecto AS id_proyecto,mca.id_actividad AS id_actividad,mca.cs_estatus AS cs_estatus from mejoreduDB.met_cortoplazo_actividad mca where ((mca.cs_estatus <> 'B') and (mca.cs_estatus in ('I','C'))) union all select tabActConProductos.apartado AS apartado,tabActConProductos.id_proyecto AS id_proyecto,tabActConProductos.idLlave AS idLlave,case when (tabActConProductos.contaProducto = 0) then 'I' else 'C' end AS csEstatusActividad from (select 'Actividad' AS apartado,mca.id_proyecto AS id_proyecto,mca.id_actividad AS idLlave,mca.cs_estatus AS cs_estatusAct,(select count(mcpro.id_producto) from mejoreduDB.met_cortoplazo_producto mcpro where ((mca.id_actividad = mcpro.id_actividad) and (mcpro.cs_estatus <> 'B'))) AS contaProducto,'I' AS cs_estatusPro from mejoreduDB.met_cortoplazo_actividad mca where (mca.cs_estatus = 'C')) tabActConProductos union all select 'Producto' AS Producto,(select distinct mcap.id_proyecto from mejoreduDB.met_cortoplazo_actividad mcap where (mcap.id_actividad = mcp.id_actividad)) AS id_proyecto,mcp.id_producto AS id_producto,mcp.cs_estatus AS cs_estatus from mejoreduDB.met_cortoplazo_producto mcp where (mcp.id_actividad in (select mca.id_actividad from mejoreduDB.met_cortoplazo_actividad mca where ((mca.cs_estatus <> 'B') and (mca.cs_estatus in ('I','C')))) and (mcp.cs_estatus <> 'B') and (mcp.cs_estatus in ('I','C'))) union all select tabActConProductos.apartado AS apartado,(select max(mcaP.id_proyecto) from mejoreduDB.met_cortoplazo_actividad mcaP where (mcaP.id_actividad = tabActConProductos.idLlave)) AS id_proyecto,tabActConProductos.idLlave AS idLlave,case when (tabActConProductos.contaPresupuesto = 0) then 'I' else 'C' end AS csEstatusActividad from (select 'Producto' AS apartado,mprod.id_producto AS id_producto,mprod.id_actividad AS idLlave,mprod.cs_estatus AS cs_estatusAct,(select count(mcpre.id_presupuesto) from mejoreduDB.met_cortoplazo_presupuesto mcpre where ((mprod.id_producto = mcpre.id_producto) and (mcpre.cs_estatus <> 'B'))) AS contaPresupuesto,'I' AS cs_estatusPro from mejoreduDB.met_cortoplazo_producto mprod where (mprod.cs_estatus = 'C')) tabActConProductos union all select 'Presupuesto' AS Presupuesto,(select distinct mcap2.id_proyecto from ((mejoreduDB.met_cortoplazo_actividad mcap2 join mejoreduDB.met_cortoplazo_producto mcp2) join mejoreduDB.met_cortoplazo_presupuesto pre2) where ((pre2.id_presupuesto = mcpr.id_presupuesto) and (pre2.id_producto = mcp2.id_producto) and (mcap2.id_actividad = mcp2.id_actividad))) AS id_proyecto,mcpr.id_presupuesto AS id_presupuesto,mcpr.cs_estatus AS cs_estatus from mejoreduDB.met_cortoplazo_presupuesto mcpr where (mcpr.id_producto in (select mcpro.id_producto from mejoreduDB.met_cortoplazo_producto mcpro where mcpro.id_actividad in (select mca.id_actividad from mejoreduDB.met_cortoplazo_actividad mca where ((mca.cs_estatus <> 'B') and (mca.cs_estatus in ('I','C'))))) and (mcpr.cs_estatus <> 'B'))) ApartadoInfo on((ApartadoTempo.apartado = ApartadoInfo.apartado))) group by ApartadoInfo.apartado,ApartadoInfo.id_proyecto,ApartadoInfo.cs_estatus;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_accion_puntual`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_accion_puntual;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_accion_puntual AS select mejoreduDB.cat_master_catalogo.cc_externa AS cc_externa,mejoreduDB.cat_master_catalogo.cd_opcion AS cd_opcion,mejoreduDB.cat_master_catalogo.df_baja AS df_baja,case when (mejoreduDB.cat_master_catalogo.df_baja = NULL) then 'B' else 'A' end AS estatus from mejoreduDB.cat_master_catalogo where (mejoreduDB.cat_master_catalogo.id_catalogo_padre = 640);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_actividadIndicadorPI`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_actividadIndicadorPI;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_actividadIndicadorPI AS select cpp.id_actividad AS id_actividad,cpp.id_producto AS idProducto,mc.id_catalogo AS id_catalogo_indicador,mc.cd_opcion AS nomIndicador,mc.cc_externa AS cveIndicadorPI,mc.cc_externaDos AS cveIndicadorPI2,(select mejoreduDB.cpae.entregables from mejoreduDB.vt_productoActivoEntregable cpae where (mejoreduDB.cpae.id_producto = cpp.id_producto)) AS entregables from (mejoreduDB.met_cortoplazo_producto cpp left join mejoreduDB.cat_master_catalogo mc on((mc.id_catalogo = cpp.id_catalogo_indicador_pl))) where ((cpp.id_catalogo_indicador_pl is not null) and (cpp.cs_estatus <> 'B'));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_actividadObjetivo`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_actividadObjetivo;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_actividadObjetivo AS select cp.cve_usuario AS cve_usuario,cp.id_anhio AS id_anhio,cp.id_proyecto AS id_proyecto,cp.id_catalogo_unidad AS id_catalogo_unidad,mca.id_actividad AS id_actividad,mea.id_catalogo AS id_catalogo_objetivo,mc.cd_opcion AS objetivoPrioritario,mc.cc_externa AS cveObjetivo from (((mejoreduDB.met_estrategia_accion mea join mejoreduDB.met_cortoplazo_actividad mca) join mejoreduDB.cat_master_catalogo mc) join mejoreduDB.met_cortoplazo_proyecto cp) where ((mea.ix_tipo = 3) and (mea.id_actividad = mca.id_actividad) and (mca.id_proyecto = cp.id_proyecto) and (cp.cs_estatus <> 'B') and (mc.id_catalogo = mea.id_catalogo) and (mc.df_baja is null) and (mc.id_catalogo_padre = 592));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_anhio_vigente`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_anhio_vigente;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_anhio_vigente AS select mejoreduDB.met_anho_planeacion.id_anhio AS id_anhio,curdate() AS fecha,curtime() AS hora from mejoreduDB.met_anho_planeacion where (mejoreduDB.met_anho_planeacion.cs_estatus = 'A');

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_autenticador`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_autenticador;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_autenticador AS select sc.id_contra AS id_contra,su.cve_usuario AS cve_usuario,sc.cx_palabra_secreta AS cx_palabra_secreta,su.cs_estatus AS cs_estatus,sp.cx_nombre AS cx_nombre,sp.cx_primer_apellido AS cx_primer_apellido,sp.cx_segundo_apellido AS cx_segundo_apellido,sp.cx_correo AS cx_correo,su.id_tipo_usuario AS id_tipo_usuario from (((mejoreduDB.seg_usuario su join mejoreduDB.seg_contrasenhia sc) join mejoreduDB.seg_usuario_persona sup) join mejoreduDB.seg_persona sp) where ((su.cve_usuario = sc.cve_usuario) and (su.cs_estatus = 'A') and (su.cve_usuario = sup.cve_usuario) and (sup.id_persona = sp.id_persona));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_cp_proyecto`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_cp_proyecto;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_cp_proyecto AS select mejoreduDB.met_cortoplazo_proyecto.id_proyecto AS id_proyecto,mejoreduDB.met_cortoplazo_proyecto.cve_proyecto AS cve_proyecto,mejoreduDB.met_cortoplazo_proyecto.cx_nombre_proyecto AS cx_nombre_proyecto,mejoreduDB.met_cortoplazo_proyecto.cx_objetivo AS cx_objetivo,mejoreduDB.met_cortoplazo_proyecto.cx_objetivo_prioritario AS cx_objetivo_prioritario,mejoreduDB.met_cortoplazo_proyecto.cve_usuario AS cve_usuario,mejoreduDB.met_cortoplazo_proyecto.id_anhio AS id_anhio,mejoreduDB.met_cortoplazo_proyecto.df_proyecto AS df_proyecto,mejoreduDB.met_cortoplazo_proyecto.dh_proyecto AS dh_proyecto,mejoreduDB.met_cortoplazo_proyecto.cs_estatus AS cs_estatus,mejoreduDB.met_cortoplazo_proyecto.id_archivo AS id_archivo,mejoreduDB.met_cortoplazo_proyecto.cx_nombre_unidad AS cx_nombre_unidad,mejoreduDB.met_cortoplazo_proyecto.cx_alcance AS cx_alcance,mejoreduDB.met_cortoplazo_proyecto.cx_fundamentacion AS cx_fundamentacion,mejoreduDB.met_cortoplazo_proyecto.LOCK_FLAG AS LOCK_FLAG,mejoreduDB.met_cortoplazo_proyecto.cve_unidad AS cve_unidad,mejoreduDB.met_cortoplazo_proyecto.ix_fuente_registro AS ix_fuente_registro,mejoreduDB.met_cortoplazo_proyecto.df_actualizacion AS df_actualizacion,mejoreduDB.met_cortoplazo_proyecto.dh_actualizacion AS dh_actualizacion,mejoreduDB.met_cortoplazo_proyecto.cve_usuario_actualiza AS cve_usuario_actualiza,mejoreduDB.met_cortoplazo_proyecto.id_validacion AS id_validacion,mejoreduDB.met_cortoplazo_proyecto.id_validacion_planeacion AS id_validacion_planeacion,mejoreduDB.met_cortoplazo_proyecto.id_validacion_supervisor AS id_validacion_supervisor,mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad AS id_catalogo_unidad,mejoreduDB.met_cortoplazo_proyecto.it_semantica AS it_semantica from mejoreduDB.met_cortoplazo_proyecto where ((mejoreduDB.met_cortoplazo_proyecto.it_semantica = 1) and (mejoreduDB.met_cortoplazo_proyecto.cs_estatus <> 'B'));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_entregable_producto`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_entregable_producto;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_entregable_producto AS select mejoreduDB.vcp.id_anhio AS id_anhio,concat((mejoreduDB.vcp.id_anhio - 2000),left(mejoreduDB.vcp.cve_unidad,1),mejoreduDB.vcp.cve_proyecto) AS cve_proyecto,mejoreduDB.vcp.id_proyecto AS id_proyecto,mejoreduDB.vcp.cve_unidad AS cve_unidad,mejoreduDB.vcp.id_catalogo_unidad AS id_catalogo_unidad,mejoreduDB.vcp.cve_usuario AS cve_usuario,mejoreduDB.vcp.cx_nombre_proyecto AS cx_nombre_proyecto,mca.id_actividad AS id_actividad,mcp.id_producto AS id_producto,mcp.id_catalogo_categorizacion AS id_catalogo_categorizacion,mcp.id_catalogo_tipo_producto AS id_catalogo_tipo_producto,mpcal.id_prodcal AS id_prodcal,mpcal.ci_monto AS ci_monto,mpcal.ci_mes AS ci_mes from (((mejoreduDB.vt_cp_proyecto vcp join mejoreduDB.met_cortoplazo_actividad mca) join mejoreduDB.met_cortoplazo_producto mcp) join mejoreduDB.met_producto_calendario mpcal) where ((mejoreduDB.vcp.cs_estatus = 'O') and (mejoreduDB.vcp.id_proyecto = mca.id_proyecto) and (mca.cs_estatus = 'C') and (mca.id_actividad = mcp.id_actividad) and (mcp.cs_estatus = 'C') and (mcp.id_producto = mpcal.id_producto) and (mpcal.ci_monto > 0));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_entregables_mir`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_entregables_mir;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_entregables_mir AS select mejoreduDB.met_indicador_resultado.id_indicador_resultado AS id_indicador_resultado,mejoreduDB.met_indicador_resultado.cx_nivel AS cx_nivel,mejoreduDB.met_indicador_resultado.cx_nombre AS cx_nombre,ifnull(rel_unidad.id_catalogo,0) AS id_catalogo,mejoreduDB.met_cortoplazo_proyecto.id_anhio AS id_anhio,rel_unidad.cd_opcion AS cd_opcion,mejoreduDB.met_producto_calendario.ci_mes AS ci_mes,sum(mejoreduDB.met_producto_calendario.ci_monto) AS ci_programado,sum(mejoreduDB.met_producto_calendario.ci_entregados) AS ci_entregado from ((((((mejoreduDB.met_indicador_resultado join mejoreduDB.cat_master_catalogo on((mejoreduDB.cat_master_catalogo.id_catalogo = mejoreduDB.met_indicador_resultado.id_catalogo))) join mejoreduDB.met_cortoplazo_producto on((mejoreduDB.met_cortoplazo_producto.id_catalogo_indicador = mejoreduDB.met_indicador_resultado.id_catalogo))) join mejoreduDB.met_producto_calendario on((mejoreduDB.met_producto_calendario.id_producto = mejoreduDB.met_cortoplazo_producto.id_producto))) join mejoreduDB.met_cortoplazo_actividad on((mejoreduDB.met_cortoplazo_actividad.id_actividad = mejoreduDB.met_cortoplazo_producto.id_actividad))) join mejoreduDB.met_cortoplazo_proyecto on((mejoreduDB.met_cortoplazo_proyecto.id_proyecto = mejoreduDB.met_cortoplazo_proyecto.id_proyecto))) left join mejoreduDB.cat_master_catalogo rel_unidad on((rel_unidad.id_catalogo = mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad))) group by mejoreduDB.met_indicador_resultado.id_indicador_resultado,rel_unidad.id_catalogo,mejoreduDB.met_cortoplazo_proyecto.id_anhio,mejoreduDB.met_producto_calendario.ci_mes;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_estrategia`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_estrategia;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_estrategia AS select mejoreduDB.cat_master_catalogo.cc_externa AS cc_externa,mejoreduDB.cat_master_catalogo.cd_opcion AS cd_opcion,mejoreduDB.cat_master_catalogo.df_baja AS df_baja,case when (mejoreduDB.cat_master_catalogo.df_baja = NULL) then 'B' else 'A' end AS estatus from mejoreduDB.cat_master_catalogo where (mejoreduDB.cat_master_catalogo.id_catalogo_padre = 771);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_estrategia_actividades`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_estrategia_actividades;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_estrategia_actividades AS select mejoreduDB.met_estrategia_accion.id_estaci AS id_estaci,mejoreduDB.met_estrategia_accion.ix_tipo AS ix_tipo,mejoreduDB.met_estrategia_accion.id_actividad AS id_actividad,mejoreduDB.met_estrategia_accion.id_catalogo AS id_catalogo,mejoreduDB.met_estrategia_accion.LOCK_FLAG AS LOCK_FLAG,mejoreduDB.met_cortoplazo_actividad.id_proyecto AS id_proyecto,mejoreduDB.met_cortoplazo_actividad.cve_usuario AS cve_usuario,mejoreduDB.met_cortoplazo_actividad.cx_nombre_actividad AS cx_nombre_actividad,mejoreduDB.met_cortoplazo_actividad.cve_actividad AS cve_actividad,mejoreduDB.met_cortoplazo_actividad.cs_estatus AS cs_estatus,mejoreduDB.met_cortoplazo_proyecto.cx_nombre_proyecto AS cx_nombre_proyecto,mejoreduDB.met_cortoplazo_proyecto.id_anhio AS id_anhio,mejoreduDB.met_cortoplazo_proyecto.cve_proyecto AS cve_proyecto,mejoreduDB.seg_perfil_laboral.id_catalogo_unidad AS id_catalogo_unidad,mejoreduDB.cat_master_catalogo.cd_opcion AS cd_opcion,mejoreduDB.cat_master_catalogo.cc_externa AS cc_externa,mejoreduDB.cat_master_catalogo.id_catalogo_padre AS id_catalogo_padre from ((((mejoreduDB.met_estrategia_accion join mejoreduDB.met_cortoplazo_actividad on((mejoreduDB.met_cortoplazo_actividad.id_actividad = mejoreduDB.met_estrategia_accion.id_actividad))) join mejoreduDB.cat_master_catalogo on((mejoreduDB.cat_master_catalogo.id_catalogo = mejoreduDB.met_estrategia_accion.id_catalogo))) join mejoreduDB.seg_perfil_laboral on((mejoreduDB.seg_perfil_laboral.cve_usuario = mejoreduDB.met_cortoplazo_actividad.cve_usuario))) join mejoreduDB.met_cortoplazo_proyecto on((mejoreduDB.met_cortoplazo_proyecto.id_proyecto = mejoreduDB.met_cortoplazo_actividad.id_proyecto))) where ((mejoreduDB.met_estrategia_accion.ix_tipo = 2) and (mejoreduDB.met_cortoplazo_actividad.cs_estatus = 'C')) order by mejoreduDB.cat_master_catalogo.cc_externa;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_estructura`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_estructura;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_estructura AS select me.id_estructura AS id_estructura,me.df_registro AS df_registro,me.dh_registro AS dh_registro,me.cve_usuario AS cve_usuario,me.cd_nombre_programa AS cd_nombre_programa,me.cd_analisis_estado AS cd_analisis_estado,me.cd_problemas_publicos AS cd_problemas_publicos,me.id_catalogo_alineacion AS id_catalogo_alineacion,me.cs_esatus AS cs_esatus,me.df_actualizacion AS df_actualizacion,me.dh_actualizacion AS dh_actualizacion,me.LOCK_FLAG AS LOCK_FLAG,me.cve_usuario_actualiza AS cve_usuario_actualiza,me.id_anhio AS id_anhio,(select count(mp.id_estructura) from mejoreduDB.met_mp_meta_parametro mp where ((mp.ix_tipo = 1) and (mp.id_estructura = me.id_estructura))) AS contarMeta,(select count(mp.id_estructura) from mejoreduDB.met_mp_meta_parametro mp where ((mp.ix_tipo = 2) and (mp.id_estructura = me.id_estructura))) AS contarParams from mejoreduDB.met_mp_estructura me;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_indicadores_mir`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_indicadores_mir;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_indicadores_mir AS select mejoreduDB.met_cortoplazo_producto.id_producto AS id_producto,mejoreduDB.met_cortoplazo_producto.cs_estatus AS cs_estatus,mejoreduDB.met_cortoplazo_producto.id_catalogo_indicador AS id_catalogo_indicador,mejoreduDB.cat_master_catalogo.cd_opcion AS cd_opcion,mejoreduDB.cat_master_catalogo.cc_externa AS cc_externa,mejoreduDB.cat_master_catalogo.cc_externaDos AS cc_externaDos,mejoreduDB.met_cortoplazo_proyecto.id_anhio AS id_anhio,mejoreduDB.seg_perfil_laboral.id_catalogo_unidad AS id_catalogo_unidad from (((((mejoreduDB.met_cortoplazo_producto left join mejoreduDB.met_cortoplazo_actividad on((mejoreduDB.met_cortoplazo_producto.id_actividad = mejoreduDB.met_cortoplazo_actividad.id_actividad))) left join mejoreduDB.met_cortoplazo_proyecto on(((mejoreduDB.met_cortoplazo_proyecto.it_semantica = 1) and (mejoreduDB.met_cortoplazo_actividad.id_proyecto = mejoreduDB.met_cortoplazo_proyecto.id_proyecto)))) left join mejoreduDB.seg_usuario on((mejoreduDB.met_cortoplazo_proyecto.cve_usuario = mejoreduDB.seg_usuario.cve_usuario))) left join mejoreduDB.seg_perfil_laboral on((mejoreduDB.seg_usuario.cve_usuario = mejoreduDB.seg_perfil_laboral.cve_usuario))) join mejoreduDB.cat_master_catalogo on((mejoreduDB.met_cortoplazo_producto.id_catalogo_indicador = mejoreduDB.cat_master_catalogo.id_catalogo))) where ((mejoreduDB.met_cortoplazo_producto.id_catalogo_indicador is not null) and (mejoreduDB.met_cortoplazo_producto.cs_estatus <> 'B'));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_indicadores_mirV2`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_indicadores_mirV2;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_indicadores_mirV2 AS select mejoreduDB.met_indicador_resultado.id_indicador_resultado AS id_indicador,mejoreduDB.met_cortoplazo_producto.id_producto AS id_producto,mejoreduDB.met_cortoplazo_producto.cs_estatus AS cs_estatus,mejoreduDB.met_cortoplazo_producto.id_catalogo_indicador AS id_catalogo_indicador,mejoreduDB.cat_master_catalogo.cd_opcion AS cd_opcion,mejoreduDB.cat_master_catalogo.cc_externa AS cc_externa,mejoreduDB.cat_master_catalogo.cc_externaDos AS cc_externaDos,mejoreduDB.met_cortoplazo_proyecto.id_anhio AS id_anhio,mejoreduDB.seg_perfil_laboral.id_catalogo_unidad AS id_catalogo_unidad,mejoreduDB.met_producto_calendario.id_prodcal AS id_prodcal,mejoreduDB.met_producto_calendario.ci_mes AS mes,mejoreduDB.met_producto_calendario.ci_monto AS entregables from (((((((mejoreduDB.met_indicador_resultado join mejoreduDB.cat_master_catalogo on((mejoreduDB.cat_master_catalogo.id_catalogo = mejoreduDB.met_indicador_resultado.id_catalogo))) join mejoreduDB.met_cortoplazo_producto on((mejoreduDB.met_cortoplazo_producto.id_catalogo_indicador = mejoreduDB.cat_master_catalogo.id_catalogo))) join mejoreduDB.met_producto_calendario on((mejoreduDB.met_producto_calendario.id_producto = mejoreduDB.met_cortoplazo_producto.id_producto))) join mejoreduDB.met_cortoplazo_actividad on((mejoreduDB.met_cortoplazo_actividad.id_actividad = mejoreduDB.met_cortoplazo_producto.id_actividad))) join mejoreduDB.met_cortoplazo_proyecto on((mejoreduDB.met_cortoplazo_proyecto.id_proyecto = mejoreduDB.met_cortoplazo_actividad.id_proyecto))) join mejoreduDB.seg_usuario on((mejoreduDB.met_cortoplazo_proyecto.cve_usuario = mejoreduDB.seg_usuario.cve_usuario))) join mejoreduDB.seg_perfil_laboral on((mejoreduDB.seg_usuario.cve_usuario = mejoreduDB.seg_perfil_laboral.cve_usuario))) where ((mejoreduDB.met_cortoplazo_proyecto.cs_estatus <> 'B') and (mejoreduDB.met_cortoplazo_proyecto.it_semantica = 1) and (mejoreduDB.cat_master_catalogo.cd_opcion <> 'NO APLICA') and (mejoreduDB.met_cortoplazo_actividad.cs_estatus <> 'B') and (mejoreduDB.met_cortoplazo_producto.cs_estatus <> 'B'));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_metasBienestar`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_metasBienestar;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_metasBienestar AS select mejoreduDB.vao.cve_usuario AS cveUsuario,mejoreduDB.vao.id_anhio AS anhio,mejoreduDB.vao.id_proyecto AS id_proyecto,mejoreduDB.vao.id_catalogo_unidad AS id_catalogo_unidad,mejoreduDB.vai.id_catalogo_indicador AS id_catalogo_indicador,mme.id_elemento AS idMeta,mejoreduDB.vao.cveObjetivo AS cveObjetivo,'.' AS cveMetaPara,mejoreduDB.vai.nomIndicador AS nomIndicador,cmc.cd_opcion AS periodicidad,mme.cx_periodo AS periodicidadOtro,cmcMed.cd_opcion AS unidadMedida,mme.cx_unidad_medida AS unidadMedidaOtro,cmcTend.cd_opcion AS tendencia,'tendenciaOtro' AS tendenciaOtro,'Encuesta' AS fuente,'fuenteOtro' AS fuenteOtro,sum(mejoreduDB.vai.entregables) AS entregables from ((mejoreduDB.vt_actividadObjetivo vao join mejoreduDB.vt_actividadIndicadorPI vai) join (((mejoreduDB.met_mp_elemento mme left join mejoreduDB.cat_master_catalogo cmc on((mme.id_catalogo_periodicidad = cmc.id_catalogo))) left join mejoreduDB.cat_master_catalogo cmcMed on((mme.id_catalogo_unidad_medida = cmcMed.id_catalogo))) left join mejoreduDB.cat_master_catalogo cmcTend on((mme.id_catalogo_tendencia = cmcTend.id_catalogo)))) where ((`mejoreduDB`.`vao`.`id_actividad` = mejoreduDB.vai.id_actividad) and (mme.id_catalogo_objetivo = mejoreduDB.vao.id_catalogo_objetivo)) group by mejoreduDB.vao.cve_usuario,mejoreduDB.vao.id_anhio,mejoreduDB.vao.id_proyecto,mejoreduDB.vao.id_catalogo_unidad,mejoreduDB.vai.id_catalogo_indicador,mme.id_elemento,mejoreduDB.vao.cveObjetivo,'.',mejoreduDB.vai.nomIndicador,cmc.cd_opcion,mme.cx_periodo,cmcMed.cd_opcion,mme.cx_unidad_medida,cmcTend.cd_opcion,'tendenciaOtro','Encuesta';

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_metasBienestarV2`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_metasBienestarV2;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_metasBienestarV2 AS select mejoreduDB.met_mp_elemento.id_elemento AS id_elemento,mejoreduDB.met_mp_elemento.id_elemento AS id_indicador_pi,mejoreduDB.met_cortoplazo_proyecto.id_anhio AS id_anhio,mejoreduDB.met_cortoplazo_proyecto.cve_usuario AS cve_usuario,mejoreduDB.seg_perfil_laboral.id_catalogo_unidad AS id_unidad,objetivo_prioritario.cc_externa AS cve_objetivo,rel_periodicidad.cd_opcion AS periodicidad,mejoreduDB.met_mp_elemento.cx_periodo AS periodicidad_otro,rel_unidad_medida.cd_opcion AS unidad_medida,mejoreduDB.met_mp_elemento.cx_unidad_medida AS unidad_medida_otro,rel_tendencia.cd_opcion AS tendencia,mejoreduDB.met_mp_elemento.cx_nombre AS indicador,mejoreduDB.met_producto_calendario.ci_monto AS entregables from (((((((((mejoreduDB.met_mp_elemento left join mejoreduDB.cat_master_catalogo rel_periodicidad on((mejoreduDB.met_mp_elemento.id_catalogo_periodicidad = rel_periodicidad.id_catalogo))) left join mejoreduDB.cat_master_catalogo rel_unidad_medida on((mejoreduDB.met_mp_elemento.id_catalogo_unidad_medida = rel_unidad_medida.id_catalogo))) left join mejoreduDB.cat_master_catalogo rel_tendencia on((mejoreduDB.met_mp_elemento.id_catalogo_tendencia = rel_tendencia.id_catalogo))) join mejoreduDB.cat_master_catalogo objetivo_prioritario on((objetivo_prioritario.id_catalogo = mejoreduDB.met_mp_elemento.id_catalogo_objetivo))) join mejoreduDB.met_cortoplazo_producto on((mejoreduDB.met_cortoplazo_producto.id_indicador_pi = mejoreduDB.met_mp_elemento.id_elemento))) join mejoreduDB.met_cortoplazo_actividad on((mejoreduDB.met_cortoplazo_actividad.id_actividad = mejoreduDB.met_cortoplazo_producto.id_actividad))) join mejoreduDB.met_cortoplazo_proyecto on((mejoreduDB.met_cortoplazo_proyecto.id_proyecto = mejoreduDB.met_cortoplazo_actividad.id_proyecto))) left join mejoreduDB.seg_perfil_laboral on((mejoreduDB.seg_perfil_laboral.cve_usuario = mejoreduDB.met_cortoplazo_proyecto.cve_usuario))) join mejoreduDB.met_producto_calendario on((mejoreduDB.met_producto_calendario.id_producto = mejoreduDB.met_cortoplazo_producto.id_producto))) where ((objetivo_prioritario.df_baja is null) and (mejoreduDB.met_cortoplazo_proyecto.cs_estatus <> 'B') and (mejoreduDB.met_cortoplazo_actividad.cs_estatus <> 'B') and (mejoreduDB.met_cortoplazo_producto.cs_estatus <> 'B'));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_objetivoEstraAccion`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_objetivoEstraAccion;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_objetivoEstraAccion AS select ap.id_anhio AS id_anhio,objPri.id_catalogo AS id_catalogo,objPri.cd_opcion AS cd_opcion,objPri.cc_externa AS cc_externa,estra.id_catalogo AS idCatEstra,estra.cd_opcion AS cd_opcionEstra,estra.cc_externa AS cc_externaEstra,acc.id_catalogo AS idCatAcc,acc.cd_opcion AS cd_opcionAcc,acc.cc_externa AS cc_externaAcc from (((mejoreduDB.met_anho_planeacion ap join mejoreduDB.cat_master_catalogo objPri) join mejoreduDB.cat_master_catalogo estra) join mejoreduDB.cat_master_catalogo acc) where ((ap.df_baja is null) and (objPri.id_catalogo_padre = 592) and (objPri.df_baja is null) and (estra.id_catalogo_padre = 771) and (estra.df_baja is null) and (objPri.cc_externa = estra.cc_externa) and (acc.id_catalogo_padre = 640) and (acc.df_baja is null) and (estra.cc_externaDos = acc.cd_descripcionDos));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_objetivo_prioritario`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_objetivo_prioritario;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_objetivo_prioritario AS select mejoreduDB.cat_master_catalogo.cc_externa AS cc_externa,mejoreduDB.cat_master_catalogo.cd_opcion AS cd_opcion,mejoreduDB.cat_master_catalogo.df_baja AS df_baja,case when (mejoreduDB.cat_master_catalogo.df_baja = NULL) then 'B' else 'A' end AS estatus from mejoreduDB.cat_master_catalogo where (mejoreduDB.cat_master_catalogo.id_catalogo_padre = 592);

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_paa_aprobado`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_paa_aprobado;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_paa_aprobado AS select row_number() OVER (ORDER BY cp.id_anhio desc )  AS id,cp.id_anhio AS id_anhio,'PAA_Aprobado' AS origen,cp.cve_unidad AS cve_unidad,concat(cast(right(cp.id_anhio,2) using utf8mb3),left(cp.cve_unidad,1),cp.cve_proyecto) AS cve_proyecto,cp.cx_nombre_proyecto AS cx_nombre_proyecto,concat(cast(right(cp.id_anhio,2) using utf8mb3),left(cp.cve_unidad,1),cp.cve_proyecto,'-',ca.cve_actividad) AS cve_actividad,ca.cx_nombre_actividad AS cx_nombre_actividad,concat(cast(right(cp.id_anhio,2) using utf8mb3),'1',cp.cve_proyecto,'-',ca.cve_actividad,'-',cpro.cve_producto,'-','0',mcCatego.cc_externa,'-',mcTipo.cc_externa) AS cve_producto,cpro.cx_nombre AS cx_nombre,mcCatego.cd_opcion AS categoria,mcTipo.cd_opcion AS tipo,mCalProd.ci_mes AS mes,mCalProd.ci_monto AS entregable from ((((mejoreduDB.met_cortoplazo_proyecto cp join mejoreduDB.met_validacion mv) join mejoreduDB.met_cortoplazo_actividad ca) join ((mejoreduDB.met_cortoplazo_producto cpro left join mejoreduDB.cat_master_catalogo mcCatego on((cpro.id_catalogo_categorizacion = mcCatego.id_catalogo))) left join mejoreduDB.cat_master_catalogo mcTipo on((cpro.id_catalogo_tipo_producto = mcTipo.id_catalogo)))) join mejoreduDBemet_producto_calendario mCalProd) where ((cp.it_semantica = 1) and (cp.cs_estatus = 'O') and (cp.id_validacion_supervisor = mv.id_validacion) and (mv.cs_estatus = 'O') and (cp.id_proyecto = ca.id_proyecto) and (ca.cs_estatus <> 'B') and (ca.id_actividad = cpro.id_actividad) and (cpro.cs_estatus <> 'B') and (mCalProd.id_producto = cpro.id_producto) and (mCalProd.ci_monto > 0));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_presupuesto_programado_proyecto`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_presupuesto_programado_proyecto;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_presupuesto_programado_proyecto AS select cpro.id_proyecto AS id_proyecto,concat(cast(right(cpro.id_anhio,2) using utf8mb3),left(cpro.cve_unidad,1),cpro.cve_proyecto) AS cveProyecto,cpro.cx_nombre_proyecto AS cx_nombre_proyecto,sum(mpc.ix_monto) AS ixAnual from (((((mejoreduDB.met_presupuesto_calendario mpc join mejoreduDB.met_partida_gasto pg) join mejoreduDB.met_cortoplazo_presupuesto cpre) join mejoreduDB.met_cortoplazo_producto cprod) join mejoreduDB.met_cortoplazo_actividad cact) join mejoreduDB.met_cortoplazo_proyecto cpro) where ((cpro.cs_estatus = 'O') and (cpro.id_proyecto = cact.id_proyecto) and (cprod.id_actividad = cact.id_actividad) and (cpre.id_presupuesto = pg.id_presupuesto) and (cpre.id_producto = cprod.id_producto) and (mpc.id_partida = pg.id_partida) and (cact.cs_estatus = 'C') and (cprod.cs_estatus = 'C') and (cpre.cs_estatus = 'C')) group by cpro.id_proyecto,cpro.cve_proyecto,cpro.cve_unidad,cpro.cx_nombre_proyecto;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_presupuesto_proyecto_unidad`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_presupuesto_proyecto_unidad;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_presupuesto_proyecto_unidad AS select cpro.id_anhio AS id_anhio,cpro.id_catalogo_unidad AS id_catalogo_unidad,cpro.cve_unidad AS cve_unidad,cpro.id_proyecto AS id_proyecto,concat(cast(right(cpro.id_anhio,2) using utf8mb3),left(cpro.cve_unidad,1),cpro.cve_proyecto) AS cveProyecto,cpro.cx_nombre_proyecto AS cx_nombre_proyecto,sum(pg.ix_anual) AS totalAnualAsignado,mejoreduDB.vppp.ixAnual AS totalCalendarizado from (((((mejoreduDB.met_partida_gasto pg join mejoreduDB.met_cortoplazo_presupuesto cpre) join mejoreduDB.met_cortoplazo_producto cprod) join mejoreduDB.met_cortoplazo_actividad cact) join mejoreduDB.met_cortoplazo_proyecto cpro) left join mejoreduDB.vt_presupuesto_programado_proyecto vppp on((cpro.id_proyecto = mejoreduDB.vppp.id_proyecto))) where ((cpre.id_presupuesto = pg.id_presupuesto) and (cpre.id_producto = cprod.id_producto) and (cpre.id_producto = cprod.id_producto) and (cprod.id_actividad = cact.id_actividad) and (cpro.id_proyecto = cact.id_proyecto) and (cpro.cs_estatus = 'O') and (cact.cs_estatus = 'C') and (cprod.cs_estatus = 'C') and (cpre.cs_estatus = 'C')) group by cpro.id_anhio,cpro.id_catalogo_unidad,cpro.id_proyecto,cpro.cve_proyecto,cpro.cve_unidad,cpro.cx_nombre_proyecto;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_presupuesto_unidad`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_presupuesto_unidad;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_presupuesto_unidad AS select mejoreduDB.vpro.id_anhio AS id_anhio,mejoreduDB.vpro.id_catalogo_unidad AS id_catalogo_unidad,mejoreduDB.vpro.cve_unidad AS cve_unidad,sum(pg.ix_anual) AS totalAnualAsignado,sum(pc.ix_monto) AS totalCalendarizado,mc.cc_externaDos AS cc_externaDos from (((mejoreduDB.met_presupuesto_calendario pc join mejoreduDB.met_partida_gasto pg) join mejoreduDB.vt_proyecto_apartado_estatus pae) join (mejoreduDB.vt_cp_proyecto vpro left join mejoreduDB.cat_master_catalogo mc on((mejoreduDB.vpro.id_catalogo_unidad = mc.id_catalogo)))) where ((pg.id_partida = pc.id_partida) and (mejoreduDB.pae.apartado = '4 presupuesto') and (mejoreduDB.pae.id = pg.id_presupuesto) and (mejoreduDB.pae.id_proyecto = mejoreduDB.vpro.id_proyecto) and (mejoreduDB.vpro.cs_estatus = 'O')) group by mejoreduDB.vpro.id_anhio,mejoreduDB.vpro.id_catalogo_unidad,mejoreduDB.vpro.cve_unidad;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_productoActivoEntregable`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_productoActivoEntregable;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_productoActivoEntregable AS select cpp.id_producto AS id_producto,sum(pcal.ci_monto) AS entregables from (mejoreduDB.met_cortoplazo_producto cpp join mejoreduDB.met_producto_calendario pcal) where ((cpp.id_producto = pcal.id_producto) and (cpp.cs_estatus <> 'B')) group by cpp.id_producto;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_producto_categoria`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_producto_categoria;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_producto_categoria AS select row_number() OVER (ORDER BY catego.id_anhio desc )  AS id,catego.id_anhio AS id_anhio,catego.cve_proyecto AS cve_proyecto,catego.id_catalogo_unidad AS id_catalogo_unidad,catego.id_catalogo_categorizacion AS id_catalogo_categorizacion,count(0) AS cx_totalProducto from (select mejoreduDB.vt_entregable_producto.id_anhio AS id_anhio,mejoreduDB.vt_entregable_producto.cve_proyecto AS cve_proyecto,mejoreduDB.vt_entregable_producto.id_catalogo_unidad AS id_catalogo_unidad,mejoreduDB.vt_entregable_producto.id_catalogo_categorizacion AS id_catalogo_categorizacion,mejoreduDB.vt_entregable_producto.id_producto AS id_producto from mejoreduDB.vt_entregable_producto group by mejoreduDB.vt_entregable_producto.id_anhio,mejoreduDB.vt_entregable_producto.cve_proyecto,mejoreduDB.vt_entregable_producto.id_catalogo_unidad,mejoreduDB.vt_entregable_producto.id_actividad,mejoreduDB.vt_entregable_producto.id_producto,mejoreduDB.vt_entregable_producto.id_catalogo_categorizacion) catego group by catego.id_anhio,catego.cve_proyecto,catego.id_catalogo_unidad,catego.id_catalogo_categorizacion;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_producto_trimestre`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_producto_trimestre;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_producto_trimestre AS select mejoreduDB.met_cortoplazo_producto.id_producto AS id_producto,mejoreduDB.met_cortoplazo_producto.id_actividad AS id_actividad,mejoreduDB.met_mes.ix_trimestre AS ix_trimestre,case when (sum(producto_entregables.entregablesFinalizados) >= sum(producto_entregables.entregablesProgramados)) then true else false end AS productosEntregados,sum(producto_entregables.entregablesProgramados) AS entregablesProgramados,sum(producto_entregables.entregablesFinalizados) AS entregablesFinalizados,sum(producto_presupuesto.presupuesto) AS presupuesto,case when (sum(producto_entregables.entregablesFinalizados) >= sum(producto_entregables.entregablesProgramados)) then sum(producto_presupuesto.presupuesto) else 0 end AS presupuestoUtilizado,sum(producto_presupuesto.adecuaciones_acciones) AS adecuaciones_acciones,sum(producto_presupuesto.adecuaciones_acciones) AS adecuaciones_presupuesto from (((mejoreduDB.met_cortoplazo_producto join mejoreduDB.met_mes) left join (select mejoreduDB.met_cortoplazo_presupuesto.id_producto AS id_producto,mejoreduDB.met_presupuesto_calendario.ix_mes AS ix_mes,sum(mejoreduDB.met_presupuesto_calendario.ix_monto) AS presupuesto,count(distinct adecuacion_accion.id_adecuacion_accion) AS adecuaciones_acciones,count(distinct adecuacion_presupuesto.id_adecuacion_presupuesto) AS adecuaciones_presupuesto from ((((((mejoreduDB.met_cortoplazo_presupuesto left join mejoreduDB.met_partida_gasto on((mejoreduDB.met_cortoplazo_presupuesto.id_presupuesto = mejoreduDB.met_partida_gasto.id_presupuesto))) left join mejoreduDB.met_presupuesto_calendario on((mejoreduDB.met_partida_gasto.id_partida = mejoreduDB.met_presupuesto_calendario.id_partida))) left join mejoreduDB.met_adecuacion_accion on((mejoreduDB.met_cortoplazo_presupuesto.id_presupuesto = mejoreduDB.met_adecuacion_accion.id_presupuesto_modificacion))) left join mejoreduDB.met_adecuacion_accion adecuacion_accion on((mejoreduDB.met_cortoplazo_presupuesto.id_presupuesto = adecuacion_accion.id_presupuesto_referencia))) left join mejoreduDB.met_adecuacion_presupuesto on((mejoreduDB.met_cortoplazo_presupuesto.id_presupuesto = mejoreduDB.met_adecuacion_presupuesto.id_presupuesto_modificacion))) left join mejoreduDB.met_adecuacion_presupuesto adecuacion_presupuesto on((mejoreduDB.met_cortoplazo_presupuesto.id_presupuesto = adecuacion_presupuesto.id_presupuesto_referencia))) where ((mejoreduDB.met_adecuacion_accion.id_adecuacion_accion is null) and (mejoreduDB.met_adecuacion_presupuesto.id_adecuacion_presupuesto is null)) group by mejoreduDB.met_cortoplazo_presupuesto.id_producto,mejoreduDB.met_presupuesto_calendario.ix_mes) producto_presupuesto on(((mejoreduDB.met_cortoplazo_producto.id_producto = producto_presupuesto.id_producto) and (producto_presupuesto.ix_mes = mejoreduDB.met_mes.ix_mes)))) left join (select mejoreduDB.met_producto_calendario.id_producto AS id_producto,mejoreduDB.met_producto_calendario.ci_mes AS ci_mes,sum(mejoreduDB.met_producto_calendario.ci_monto) AS entregablesProgramados,sum(mejoreduDB.met_producto_calendario.ci_entregados) AS entregablesFinalizados from mejoreduDB.met_producto_calendario group by mejoreduDB.met_producto_calendario.id_producto,mejoreduDB.met_producto_calendario.ci_mes) producto_entregables on(((mejoreduDB.met_cortoplazo_producto.id_producto = producto_entregables.id_producto) and (producto_entregables.ci_mes = mejoreduDB.met_mes.ix_mes)))) group by mejoreduDB.met_cortoplazo_producto.id_producto,mejoreduDB.met_mes.ix_trimestre order by mejoreduDB.met_cortoplazo_producto.id_producto;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_productos_asociados_mir`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_productos_asociados_mir;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_productos_asociados_mir AS select mejoreduDB.met_cortoplazo_producto.id_producto AS id_producto,mejoreduDB.met_cortoplazo_producto.id_catalogo_indicador AS id_catalogo_indicador,mejoreduDB.cat_master_catalogo.cc_externa AS cc_externa from (mejoreduDB.met_cortoplazo_producto join mejoreduDB.cat_master_catalogo on((mejoreduDB.met_cortoplazo_producto.id_catalogo_indicador = mejoreduDB.cat_master_catalogo.id_catalogo)));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_productos_cancelados`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_productos_cancelados;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_productos_cancelados AS select mejoreduDB.met_adecuacion_producto.id_adecuacion_producto AS id_adecuacion_producto,mejoreduDB.met_adecuacion_producto.id_producto_modificacion AS id_producto_modificacion,mejoreduDB.met_adecuacion_producto.id_producto_referencia AS id_producto_referencia,mejoreduDB.met_adecuacion_solicitud.id_adecuacion_solicitud AS id_adecuacion_solicitud,mejoreduDB.met_adecuacion_solicitud.id_catalogo_modificacion AS id_catalogo_modificacion,mejoreduDB.met_solicitud.id_solicitud AS id_solicitud,mejoreduDB.met_solicitud.id_catalogo_estatus AS id_catalogo_estatus,mejoreduDB.met_solicitud.id_catalogo_anhio AS id_catalogo_anhio from ((mejoreduDB.met_adecuacion_producto join mejoreduDB.met_adecuacion_solicitud on((mejoreduDB.met_adecuacion_solicitud.id_adecuacion_solicitud = mejoreduDB.met_adecuacion_producto.id_adecuacion_solicitud))) join mejoreduDB.met_solicitud on((mejoreduDB.met_solicitud.id_solicitud = mejoreduDB.met_adecuacion_solicitud.id_adecuacion_solicitud))) where ((mejoreduDB.met_adecuacion_producto.id_producto_modificacion is null) and (mejoreduDB.met_adecuacion_producto.id_producto_referencia is not null) and (mejoreduDB.met_solicitud.id_catalogo_estatus = 2243));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_productos_mir`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_productos_mir;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_productos_mir AS select mejoreduDB.met_cortoplazo_producto.id_producto AS id_producto,mejoreduDB.met_cortoplazo_producto.cs_estatus AS cs_estatus,indicador.cc_externa AS cc_externa,indicador.cc_externaDos AS cc_externaDos,mejoreduDB.met_cortoplazo_producto.cve_producto AS cve_producto,mejoreduDB.met_cortoplazo_actividad.cve_actividad AS cve_actividad,mejoreduDB.met_cortoplazo_proyecto.cve_proyecto AS cve_proyecto,categorizacion.cc_externa AS categorizacion,tipo_producto.cc_externa AS tipo_producto,mejoreduDB.met_cortoplazo_producto.cx_nombre AS cx_nombre,mejoreduDB.met_cortoplazo_proyecto.id_anhio AS id_anhio,mejoreduDB.seg_perfil_laboral.id_catalogo_unidad AS id_catalogo_unidad,unidad.cc_externa AS cve_unidad from (((((((((mejoreduDB.met_cortoplazo_producto join mejoreduDB.met_cortoplazo_actividad on((mejoreduDB.met_cortoplazo_producto.id_actividad = mejoreduDB.met_cortoplazo_actividad.id_actividad))) join mejoreduDB.met_cortoplazo_proyecto on((mejoreduDB.met_cortoplazo_actividad.id_proyecto = mejoreduDB.met_cortoplazo_proyecto.id_proyecto))) join mejoreduDB.seg_usuario on((mejoreduDB.met_cortoplazo_proyecto.cve_usuario = mejoreduDB.seg_usuario.cve_usuario))) join mejoreduDB.seg_perfil_laboral on((mejoreduDB.seg_usuario.cve_usuario = mejoreduDB.seg_perfil_laboral.cve_usuario))) join mejoreduDB.cat_master_catalogo indicador on((indicador.id_catalogo = mejoreduDB.met_cortoplazo_producto.id_catalogo_indicador))) join mejoreduDB.met_indicador_resultado on((mejoreduDB.met_indicador_resultado.id_catalogo = indicador.id_catalogo))) join mejoreduDB.cat_master_catalogo categorizacion on((categorizacion.id_catalogo = mejoreduDB.met_cortoplazo_producto.id_catalogo_categorizacion))) join mejoreduDB.cat_master_catalogo tipo_producto on((tipo_producto.id_catalogo = mejoreduDB.met_cortoplazo_producto.id_catalogo_tipo_producto))) join mejoreduDB.cat_master_catalogo unidad on((unidad.id_catalogo = mejoreduDB.seg_perfil_laboral.id_catalogo_unidad))) where ((mejoreduDB.met_cortoplazo_proyecto.cs_estatus <> 'B') and (mejoreduDB.met_cortoplazo_actividad.cs_estatus <> 'B') and (mejoreduDB.met_cortoplazo_producto.cs_estatus <> 'B'));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_proyecto_apartado_estatus`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_proyecto_apartado_estatus;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_proyecto_apartado_estatus AS select row_number() OVER (ORDER BY tcpv.id_proyecto desc )  AS id_secuencia,tcpv.id_proyecto AS id_proyecto,tcpv.id AS id,tcpv.apartado AS apartado,tcpv.id_validacion_supervisor AS id_validacion_supervisor,tcpv.cs_estatus AS cs_estatus from (select cp.id_proyecto AS id_proyecto,'1 proyecto' AS apartado,cp.id_proyecto AS id,cp.id_validacion_supervisor AS id_validacion_supervisor,mv.cs_estatus AS cs_estatus from (mejoreduDB.met_cortoplazo_proyecto cp left join mejoreduDB.met_validacion mv on((mv.id_validacion = cp.id_validacion_supervisor))) where (cp.cs_estatus <> 'B') union select cp.id_proyecto AS id_proyecto,'2 actividades' AS apartado,ca.id_actividad AS id,ca.id_validacion_supervisor AS id_validacion_supervisor,mv.cs_estatus AS cs_estatus from (mejoreduDB.met_cortoplazo_proyecto cp join (mejoreduDB.met_cortoplazo_actividad ca left join mejoreduDB.met_validacion mv on((mv.id_validacion = ca.id_validacion_supervisor)))) where ((cp.id_proyecto = ca.id_proyecto) and (cp.cs_estatus <> 'B') and (ca.cs_estatus <> 'B')) union select cp.id_proyecto AS id_proyecto,'3 productos' AS apartado,cpro.id_producto AS id,cpro.id_validacion_supervisor AS id_validacion_supervisor,mv.cs_estatus AS cs_estatus from ((mejoreduDB.met_cortoplazo_actividad ca join mejoreduDB.met_cortoplazo_proyecto cp) join (mejoreduDB.met_cortoplazo_producto cpro left join mejoreduDB.met_validacion mv on((mv.id_validacion = cpro.id_validacion_supervisor)))) where ((cp.id_proyecto = ca.id_proyecto) and (ca.id_actividad = cpro.id_actividad) and (cp.cs_estatus <> 'B') and (ca.cs_estatus <> 'B') and (cpro.cs_estatus <> 'B')) union select cp.id_proyecto AS id_proyecto,'4 presupuesto' AS apartado,cpre.id_presupuesto AS id,cpre.id_validacion_supervisor AS id_validacion_supervisor,mv.cs_estatus AS cs_estatus from (((mejoreduDB.met_cortoplazo_proyecto cp join mejoreduDB.met_cortoplazo_producto cpro) join mejoreduDB.met_cortoplazo_actividad ca) join (mejoreduDB.met_cortoplazo_presupuesto cpre left join mejoreduDB.met_validacion mv on((mv.id_validacion = cpre.id_validacion_supervisor)))) where ((cp.id_proyecto = ca.id_proyecto) and (ca.id_actividad = cpro.id_actividad) and (cpre.id_producto = cpro.id_producto) and (cp.cs_estatus <> 'B') and (ca.cs_estatus <> 'B') and (cpro.cs_estatus <> 'B') and (cpre.cs_estatus <> 'B'))) tcpv;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_proyecto_apartado_estatus_plan`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_proyecto_apartado_estatus_plan;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_proyecto_apartado_estatus_plan AS select row_number() OVER (ORDER BY tcpv.id_proyecto desc )  AS id_secuencia,tcpv.id_proyecto AS id_proyecto,tcpv.id AS id,tcpv.apartado AS apartado,tcpv.id_validacion_planeacion AS id_validacion_planeacion,tcpv.cs_estatus AS cs_estatus from (select cp.id_proyecto AS id_proyecto,'1 proyecto' AS apartado,cp.id_proyecto AS id,cp.id_validacion_planeacion AS id_validacion_planeacion,mv.cs_estatus AS cs_estatus from (mejoreduDB.met_cortoplazo_proyecto cp join mejoreduDB.met_validacion mv) where ((mv.id_validacion = cp.id_validacion_planeacion) and (cp.cs_estatus <> 'B')) union select cp.id_proyecto AS id_proyecto,'2 actividades' AS apartado,ca.id_actividad AS id,ca.id_validacion_planeacion AS id_validacion_planeacion,mv.cs_estatus AS cs_estatus from (mejoreduDB.met_cortoplazo_proyecto cp join (mejoreduDB.met_cortoplazo_actividad ca left join mejoreduDB.met_validacion mv on((mv.id_validacion = ca.id_validacion_planeacion)))) where ((cp.id_proyecto = ca.id_proyecto) and (cp.cs_estatus <> 'B') and (ca.cs_estatus <> 'B')) union select cp.id_proyecto AS id_proyecto,'3 productos' AS apartado,cpro.id_producto AS id,cpro.id_validacion_planeacion AS id_validacion_planeacion,mv.cs_estatus AS cs_estatus from ((mejoreduDB.met_cortoplazo_actividad ca join mejoreduDB.met_cortoplazo_proyecto cp) join (mejoreduDB.met_cortoplazo_producto cpro left join mejoreduDB.met_validacion mv on((mv.id_validacion = cpro.id_validacion_planeacion)))) where ((cp.id_proyecto = ca.id_proyecto) and (ca.id_actividad = cpro.id_actividad) and (cp.cs_estatus <> 'B') and (ca.cs_estatus <> 'B') and (cpro.cs_estatus <> 'B')) union select cp.id_proyecto AS id_proyecto,'4 presupuesto' AS apartado,cpre.id_presupuesto AS id,cpre.id_validacion_planeacion AS id_validacion_planeacion,mv.cs_estatus AS cs_estatus from (((mejoreduDB.met_cortoplazo_proyecto cp join mejoreduDB.met_cortoplazo_producto cpro) join mejoreduDB.met_cortoplazo_actividad ca) join (mejoreduDB.met_cortoplazo_presupuesto cpre left join mejoreduDB.met_validacion mv on((mv.id_validacion = cpre.id_validacion_planeacion)))) where ((cp.id_proyecto = ca.id_proyecto) and (ca.id_actividad = cpro.id_actividad) and (cp.cs_estatus <> 'B') and (ca.cs_estatus <> 'B') and (cpro.cs_estatus <> 'B') and (cpre.cs_estatus <> 'B') and (cpre.id_producto = cpro.id_producto))) tcpv;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_proyecto_apartado_estatus_presu`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_proyecto_apartado_estatus_presu;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_proyecto_apartado_estatus_presu AS select row_number() OVER (ORDER BY tcpv.id_proyecto desc )  AS id_secuencia,tcpv.id_proyecto AS id_proyecto,tcpv.id AS id,tcpv.apartado AS apartado,tcpv.id_validacion AS id_validacion,tcpv.cs_estatus AS cs_estatus from (select cp.id_proyecto AS id_proyecto,'1 proyecto' AS apartado,cp.id_proyecto AS id,cp.id_validacion AS id_validacion,mv.cs_estatus AS cs_estatus from (mejoreduDB.met_cortoplazo_proyecto cp join mejoreduDB.met_validacion mv) where ((mv.id_validacion = cp.id_validacion) and (cp.cs_estatus <> 'B')) union select cp.id_proyecto AS id_proyecto,'2 actividades' AS apartado,ca.id_actividad AS id,ca.id_validacion AS id_validacion,mv.cs_estatus AS cs_estatus from (mejoreduDB.met_cortoplazo_proyecto cp join (mejoreduDB.met_cortoplazo_actividad ca left join mejoreduDB.met_validacion mv on((mv.id_validacion = ca.id_validacion)))) where ((cp.id_proyecto = ca.id_proyecto) and (cp.cs_estatus <> 'B') and (ca.cs_estatus <> 'B')) union select cp.id_proyecto AS id_proyecto,'3 productos' AS apartado,cpro.id_producto AS id,cpro.id_validacion AS id_validacion,mv.cs_estatus AS cs_estatus from ((mejoreduDB.met_cortoplazo_actividad ca join mejoreduDB.met_cortoplazo_proyecto cp) join (mejoreduDB.met_cortoplazo_producto cpro left join mejoreduDB.met_validacion mv on((mv.id_validacion = cpro.id_validacion)))) where ((cp.id_proyecto = ca.id_proyecto) and (cp.cs_estatus <> 'B') and (ca.cs_estatus <> 'B') and (cpro.cs_estatus <> 'B') and (ca.id_actividad = cpro.id_actividad)) union select cp.id_proyecto AS id_proyecto,'4 presupuesto' AS apartado,cpre.id_presupuesto AS id,cpre.id_validacion AS id_validacion,mv.cs_estatus AS cs_estatus from (((mejoreduDB.met_cortoplazo_proyecto cp join mejoreduDB.met_cortoplazo_producto cpro) join mejoreduDB.met_cortoplazo_actividad ca) join (mejoreduDB.met_cortoplazo_presupuesto cpre left join mejoreduDB.met_validacion mv on((mv.id_validacion = cpre.id_validacion)))) where ((cp.it_semantica = 1) and (cp.cs_estatus <> 'B') and (ca.cs_estatus <> 'B') and (cpro.cs_estatus <> 'B') and (cpre.cs_estatus <> 'B') and (cp.id_proyecto = ca.id_proyecto) and (ca.id_actividad = cpro.id_actividad) and (cpre.id_producto = cpro.id_producto))) tcpv;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_roles`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_roles;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_roles AS select stu.id_tipo_usuario AS id_tipo_usuario,stu.cd_tipo_usuario AS cd_tipo_usuario,sf.ce_facultad AS ce_facultad,sf.id_facultad AS id_facultad from ((mejoreduDB.seg_tipo_usuario stu join mejoreduDB.seg_usuario_facultad suf) join mejoreduDB.seg_facultad sf) where ((stu.id_tipo_usuario = suf.id_tipo_usuario) and (suf.id_facultad = sf.id_facultad) and (stu.cs_estatus = 'A') and (sf.cs_status = 'A'));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_secuencia_actividad`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_secuencia_actividad;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_secuencia_actividad AS select row_number() OVER (ORDER BY proy.id_proyecto desc )  AS id_secuencia,proy.id_catalogo_unidad AS id_unidad_admiva,proy.id_proyecto AS id_proyecto,(max(act.cve_actividad) + 1) AS ix_secuencia,count(act.id_actividad) AS LOCK_FLAG from (mejoreduDB.met_cortoplazo_proyecto proy join mejoreduDB.met_cortoplazo_actividad act on(((proy.id_proyecto = act.id_proyecto) and (act.cs_estatus <> 'B')))) where ((proy.id_catalogo_unidad is not null) and (proy.cs_estatus <> 'B') and (act.cs_estatus <> 'B')) group by proy.id_proyecto;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_secuencia_folioSolicitud`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_secuencia_folioSolicitud;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_secuencia_folioSolicitud AS select max(ms.id_solicitud) AS id,ms.id_catalogo_unidad AS id_catalogo_unidad,(max(ms.ix_folio_secuencia) + 1) AS secuencia from mejoreduDB.met_solicitud ms where (ms.id_catalogo_estatus <> 2242) group by ms.id_catalogo_unidad;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_secuencia_negocio`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_secuencia_negocio;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_secuencia_negocio AS select row_number() OVER (ORDER BY mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad desc )  AS id_secuencia,mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad AS id_unidad_admiva,(max(mejoreduDB.met_cortoplazo_proyecto.cve_proyecto) + 1) AS ix_secuencia,count(mejoreduDB.met_cortoplazo_proyecto.id_proyecto) AS LOCK_FLAG from mejoreduDB.met_cortoplazo_proyecto where ((mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad is not null) and (mejoreduDB.met_cortoplazo_proyecto.cs_estatus <> 'B')) group by mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_secuencia_presupuesto`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_secuencia_presupuesto;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_secuencia_presupuesto AS select row_number() OVER (ORDER BY prod.id_producto desc )  AS id_secuencia,proy.id_catalogo_unidad AS id_unidad_admiva,prod.id_producto AS id_producto,(max(pres.cve_accion) + 1) AS ix_secuencia,count(pres.id_presupuesto) AS LOCK_FLAG from (((mejoreduDB.met_cortoplazo_proyecto proy join mejoreduDB.met_cortoplazo_actividad act on((proy.id_proyecto = act.id_proyecto))) join mejoreduDB.met_cortoplazo_producto prod on((act.id_actividad = prod.id_actividad))) join mejoreduDB.met_cortoplazo_presupuesto pres on((prod.id_producto = pres.id_producto))) where ((proy.id_catalogo_unidad is not null) and (proy.cs_estatus <> 'B') and (act.cs_estatus <> 'B') and (prod.cs_estatus <> 'B') and (pres.cs_estatus <> 'B')) group by prod.id_producto;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_secuencia_producto`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_secuencia_producto;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_secuencia_producto AS select row_number() OVER (ORDER BY act.id_actividad desc )  AS id_secuencia,proy.id_catalogo_unidad AS id_unidad_admiva,act.id_actividad AS id_actividad,(max(prod.cve_producto) + 1) AS ix_secuencia,count(prod.id_producto) AS LOCK_FLAG from ((mejoreduDB.met_cortoplazo_proyecto proy join mejoreduDB.met_cortoplazo_actividad act on((proy.id_proyecto = act.id_proyecto))) join mejoreduDB.met_cortoplazo_producto prod on((act.id_actividad = prod.id_actividad))) where ((proy.id_catalogo_unidad is not null) and (proy.cs_estatus <> 'B') and (act.cs_estatus <> 'B') and (prod.cs_estatus <> 'B')) group by act.id_actividad;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_secuencia_solicitud`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_secuencia_solicitud;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_secuencia_solicitud AS select row_number() OVER (ORDER BY mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad desc )  AS id_secuencia,mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad AS id_unidad_admiva,(max(mejoreduDB.met_cortoplazo_proyecto.cve_proyecto) + 1) AS ix_secuencia,count(mejoreduDB.met_cortoplazo_proyecto.id_proyecto) AS LOCK_FLAG from mejoreduDB.met_cortoplazo_proyecto where ((mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad is not null) and (mejoreduDB.met_cortoplazo_proyecto.cs_estatus <> 'B')) group by mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_secuencia_solicitud_anhio`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_secuencia_solicitud_anhio;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_secuencia_solicitud_anhio AS select row_number() OVER (ORDER BY mejoreduDB.met_cortoplazo_proyecto.id_anhio desc )  AS id_secuencia,mejoreduDB.met_cortoplazo_proyecto.id_anhio AS id_anhio,(max(mejoreduDB.met_cortoplazo_proyecto.cve_proyecto) + 1) AS ix_secuencia,count(mejoreduDB.met_cortoplazo_proyecto.id_proyecto) AS LOCK_FLAG from mejoreduDB.met_cortoplazo_proyecto where ((mejoreduDB.met_cortoplazo_proyecto.id_anhio is not null) and (mejoreduDB.met_cortoplazo_proyecto.cs_estatus <> 'B')) group by mejoreduDB.met_cortoplazo_proyecto.id_anhio;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_seguimiento_adecua_registro`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_seguimiento_adecua_registro;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_seguimiento_adecua_registro AS select row_number() OVER (ORDER BY segAdecua.id_solicitud desc )  AS id,segAdecua.tipo AS tipo,segAdecua.id_solicitud AS id_solicitud,segAdecua.id_catalogo_modificacion AS id_catalogo_modificacion,segAdecua.id_catalogo_apartado AS id_catalogo_apartado,segAdecua.id_modificacion AS id_modificacion,segAdecua.id_referencia AS id_referencia from (select 'APRO' AS tipo,s.id_solicitud AS id_solicitud,asol.id_catalogo_modificacion AS id_catalogo_modificacion,asol.id_catalogo_apartado AS id_catalogo_apartado,mapro.id_proyecto_modificacion AS id_modificacion,mapro.id_proyecto_referencia AS id_referencia from ((mejoreduDB.met_solicitud s join mejoreduDB.met_adecuacion_solicitud asol) join mejoreduDB.met_adecuacion_proyecto mapro) where ((asol.id_solicitud = s.id_solicitud) and (asol.id_adecuacion_solicitud = mapro.id_adecuacion_solicitud)) union all select 'AACT' AS tipo,s.id_solicitud AS id_solicitud,asol.id_catalogo_modificacion AS id_catalogo_modificacion,asol.id_catalogo_apartado AS id_catalogo_apartado,maact.id_actividad_modificacion AS id_actividad_modificacion,maact.id_actividad_referencia AS id_actividad_referencia from ((mejoreduDB.met_solicitud s join mejoreduDB.met_adecuacion_solicitud asol) join mejoreduDB.met_adecuacion_actividad maact) where ((asol.id_solicitud = s.id_solicitud) and (asol.id_adecuacion_solicitud = maact.id_adecuacion_solicitud)) union all select 'APTO' AS tipo,s.id_solicitud AS id_solicitud,asol.id_catalogo_modificacion AS id_catalogo_modificacion,asol.id_catalogo_apartado AS id_catalogo_apartado,mapto.id_producto_modificacion AS id_producto_modificacion,mapto.id_producto_referencia AS id_producto_referencia from ((mejoreduDB.met_solicitud s join mejoreduDB.met_adecuacion_solicitud asol) join mejoreduDB.met_adecuacion_producto mapto) where ((asol.id_solicitud = s.id_solicitud) and (asol.id_adecuacion_solicitud = mapto.id_adecuacion_solicitud)) union all select 'APRE' AS tipo,s.id_solicitud AS id_solicitud,asol.id_catalogo_modificacion AS id_catalogo_modificacion,asol.id_catalogo_apartado AS id_catalogo_apartado,mapre.id_presupuesto_modificacion AS id_presupuesto_modificacion,mapre.id_presupuesto_referencia AS id_presupuesto_referencia from ((mejoreduDB.met_solicitud s join mejoreduDB.met_adecuacion_solicitud asol) join mejoreduDB.met_adecuacion_presupuesto mapre) where ((asol.id_solicitud = s.id_solicitud) and (asol.id_adecuacion_solicitud = mapre.id_adecuacion_solicitud))) segAdecua;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_seguimiento_extractores`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_seguimiento_extractores;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_seguimiento_extractores AS select mejoreduDB.met_cortoplazo_proyecto.id_proyecto AS id_proyecto,mejoreduDB.met_cortoplazo_proyecto.id_anhio AS id_anhio,mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad AS id_catalogo_unidad,mejoreduDB.met_cortoplazo_proyecto.cve_proyecto AS cve_proyecto,mejoreduDB.met_cortoplazo_proyecto.cx_nombre_proyecto AS cx_nombre_proyecto,mejoreduDB.met_cortoplazo_actividad.id_actividad AS id_actividad,mejoreduDB.met_cortoplazo_actividad.cve_actividad AS cve_actividad,mejoreduDB.met_cortoplazo_actividad.cx_nombre_actividad AS cx_nombre_actividad,mejoreduDB.met_cortoplazo_producto.id_producto AS id_producto,mejoreduDB.met_cortoplazo_producto.cve_producto AS cve_producto,mejoreduDB.met_cortoplazo_producto.cx_nombre AS cx_nombre,mejoreduDB.met_cortoplazo_presupuesto.id_presupuesto AS id_presupuesto,mejoreduDB.met_cortoplazo_presupuesto.cve_accion AS cve_accion,mejoreduDB.met_cortoplazo_presupuesto.cx_nombre_accion AS cx_nombre_accion,mejoreduDB.met_solicitud.id_solicitud AS id_solicitud,mejoreduDB.met_solicitud.cve_folio_solicitud AS cve_folio_solicitud from ((((((((((mejoreduDB.met_cortoplazo_proyecto join mejoreduDB.met_cortoplazo_actividad on((mejoreduDB.met_cortoplazo_proyecto.id_proyecto = mejoreduDB.met_cortoplazo_actividad.id_proyecto))) join mejoreduDB.met_cortoplazo_producto on((mejoreduDB.met_cortoplazo_actividad.id_actividad = mejoreduDB.met_cortoplazo_producto.id_actividad))) join mejoreduDB.met_cortoplazo_presupuesto on((mejoreduDB.met_cortoplazo_producto.id_producto = mejoreduDB.met_cortoplazo_presupuesto.id_producto))) left join mejoreduDB.met_adecuacion_proyecto on((mejoreduDB.met_cortoplazo_proyecto.id_proyecto = mejoreduDB.met_adecuacion_proyecto.id_proyecto_modificacion))) left join mejoreduDB.met_adecuacion_actividad on((mejoreduDB.met_cortoplazo_actividad.id_actividad = mejoreduDB.met_adecuacion_actividad.id_actividad_modificacion))) left join mejoreduDB.met_adecuacion_producto on((mejoreduDB.met_cortoplazo_producto.id_producto = mejoreduDB.met_adecuacion_producto.id_producto_modificacion))) left join mejoreduDB.met_adecuacion_accion on((mejoreduDB.met_cortoplazo_presupuesto.id_presupuesto = mejoreduDB.met_adecuacion_accion.id_presupuesto_modificacion))) left join mejoreduDB.met_adecuacion_presupuesto on((mejoreduDB.met_cortoplazo_presupuesto.id_presupuesto = mejoreduDB.met_adecuacion_presupuesto.id_presupuesto_modificacion))) join mejoreduDB.met_adecuacion_solicitud on(((mejoreduDB.met_adecuacion_proyecto.id_adecuacion_solicitud = mejoreduDB.met_adecuacion_solicitud.id_adecuacion_solicitud) or (mejoreduDB.met_adecuacion_actividad.id_adecuacion_solicitud = mejoreduDB.met_adecuacion_solicitud.id_adecuacion_solicitud) or (mejoreduDB.met_adecuacion_producto.id_adecuacion_solicitud = mejoreduDB.met_adecuacion_solicitud.id_adecuacion_solicitud) or (mejoreduDB.met_adecuacion_accion.id_adecuacion_solicitud = mejoreduDB.met_adecuacion_solicitud.id_adecuacion_solicitud) or (mejoreduDB.met_adecuacion_presupuesto.id_adecuacion_solicitud = mejoreduDB.met_adecuacion_solicitud.id_adecuacion_solicitud)))) join mejoreduDB.met_solicitud on((mejoreduDB.met_adecuacion_solicitud.id_solicitud = mejoreduDB.met_solicitud.id_solicitud)));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_seguimiento_mir`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_seguimiento_mir;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_seguimiento_mir AS select mejoreduDB.met_indicador_resultado.id_indicador_resultado AS id_indicador_resultado,mejoreduDB.met_cortoplazo_proyecto.id_anhio AS id_anhio,mejoreduDB.met_indicador_resultado.cx_nivel AS nivel_MIR,mejoreduDB.met_indicador_resultado.cx_nombre AS indicador,rel_unidad.id_catalogo AS id_catalogo_unidad,rel_unidad.cc_externaDos AS unidad_corta,rel_unidad.cd_opcion AS unidad_larga,mejoreduDB.met_producto_calendario.ci_mes AS mes,sum(ifnull(mejoreduDB.met_producto_calendario.ci_monto,0)) AS programado,sum(ifnull(mejoreduDB.met_producto_calendario.ci_entregados,0)) AS entregado from (((((mejoreduDB.met_indicador_resultado join mejoreduDB.met_cortoplazo_producto on((mejoreduDB.met_cortoplazo_producto.id_catalogo_indicador = mejoreduDB.met_indicador_resultado.id_catalogo))) join mejoreduDB.met_producto_calendario on((mejoreduDB.met_producto_calendario.id_producto = mejoreduDB.met_cortoplazo_producto.id_producto))) join mejoreduDB.met_cortoplazo_actividad on((mejoreduDB.met_cortoplazo_actividad.id_actividad = mejoreduDB.met_cortoplazo_producto.id_actividad))) join mejoreduDB.met_cortoplazo_proyecto on((mejoreduDB.met_cortoplazo_proyecto.id_proyecto = mejoreduDB.met_cortoplazo_actividad.id_proyecto))) join mejoreduDB.cat_master_catalogo rel_unidad on((rel_unidad.id_catalogo = mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad))) where ((mejoreduDB.met_cortoplazo_proyecto.cs_estatus <> 'B') and (mejoreduDB.met_cortoplazo_actividad.cs_estatus <> 'B') and (mejoreduDB.met_cortoplazo_producto.cs_estatus = 'C')) group by mejoreduDB.met_indicador_resultado.id_indicador_resultado,mejoreduDB.met_indicador_resultado.cx_nivel,mejoreduDB.met_cortoplazo_proyecto.id_anhio,nivel_MIR,indicador,mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad,unidad_corta,unidad_larga,mes;

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_seguimiento_proyecto`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_seguimiento_proyecto;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_seguimiento_proyecto AS select mejoreduDB.met_cortoplazo_proyecto.id_proyecto AS id_proyecto,mejoreduDB.met_cortoplazo_proyecto.cve_proyecto AS cve_proyecto,mejoreduDB.met_cortoplazo_proyecto.cx_nombre_proyecto AS cx_nombre_proyecto,mejoreduDB.met_cortoplazo_proyecto.cx_objetivo AS cx_objetivo,mejoreduDB.met_cortoplazo_proyecto.cx_objetivo_prioritario AS cx_objetivo_prioritario,mejoreduDB.met_cortoplazo_proyecto.cve_usuario AS cve_usuario,mejoreduDB.met_cortoplazo_proyecto.id_anhio AS id_anhio,mejoreduDB.met_cortoplazo_proyecto.df_proyecto AS df_proyecto,mejoreduDB.met_cortoplazo_proyecto.dh_proyecto AS dh_proyecto,mejoreduDB.met_cortoplazo_proyecto.cs_estatus AS cs_estatus,mejoreduDB.met_cortoplazo_proyecto.id_archivo AS id_archivo,mejoreduDB.met_cortoplazo_proyecto.cx_nombre_unidad AS cx_nombre_unidad,mejoreduDB.met_cortoplazo_proyecto.cx_alcance AS cx_alcance,mejoreduDB.met_cortoplazo_proyecto.cx_fundamentacion AS cx_fundamentacion,mejoreduDB.met_cortoplazo_proyecto.LOCK_FLAG AS LOCK_FLAG,mejoreduDB.met_cortoplazo_proyecto.cve_unidad AS cve_unidad,mejoreduDB.met_cortoplazo_proyecto.ix_fuente_registro AS ix_fuente_registro,mejoreduDB.met_cortoplazo_proyecto.df_actualizacion AS df_actualizacion,mejoreduDB.met_cortoplazo_proyecto.dh_actualizacion AS dh_actualizacion,mejoreduDB.met_cortoplazo_proyecto.cve_usuario_actualiza AS cve_usuario_actualiza,mejoreduDB.met_cortoplazo_proyecto.id_validacion AS id_validacion,mejoreduDB.met_cortoplazo_proyecto.id_validacion_planeacion AS id_validacion_planeacion,mejoreduDB.met_cortoplazo_proyecto.id_validacion_supervisor AS id_validacion_supervisor,mejoreduDB.met_cortoplazo_proyecto.id_catalogo_unidad AS id_catalogo_unidad,mejoreduDB.met_cortoplazo_proyecto.it_semantica AS it_semantica from mejoreduDB.met_cortoplazo_proyecto where ((mejoreduDB.met_cortoplazo_proyecto.it_semantica = 2) and (mejoreduDB.met_cortoplazo_proyecto.cs_estatus <> 'B'));

-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** .`vt_tabla_mir`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS mejoreduDB.vt_tabla_mir;
SET SCHEMA 'mejoreduDB';
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE  OR REPLACE  VIEW mejoreduDB.vt_tabla_mir AS select row_number() OVER (ORDER BY mejoreduDB.imir.id_catalogo_indicador desc )  AS id,mejoreduDB.imir.id_anhio AS id_anhio,mejoreduDB.imir.id_catalogo_unidad AS id_catalogo_unidad,mejoreduDB.imir.id_catalogo_indicador AS id_catalogo_indicador,mejoreduDB.imir.cd_opcion AS cd_opcion,mejoreduDB.imir.cc_externa AS nivel,mejoreduDB.imir.cc_externaDos AS tipo,count(0) AS entregables,sum(pc.ci_mes) AS totEntregables from (mejoreduDB.vt_indicadores_mir imir join mejoreduDB.met_producto_calendario pc) where ((mejoreduDB.imir.id_producto = pc.id_producto) and (pc.ci_monto > 0)) group by mejoreduDB.imir.id_anhio,mejoreduDB.imir.id_catalogo_unidad,mejoreduDB.imir.id_catalogo_indicador,mejoreduDB.imir.cd_opcion;
SET SCHEMA 'mejoreduDB';

DELIMITER $$
SET SCHEMA 'mejoreduDB'$$
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE OR REPLACE FUNCTION mejoreduDB.get_fecha_hora_registro_on_insert_met_archivo_func() RETURNS TRIGGER AS $$ 
BEGIN
    DECLARE nowTimestamp TIMESTAMP(0);
    nowTz TIMESTAMP(0);
    nowDate DATE;
    nowTime TIME(0);

    nowTimestamp := CURRENT_TIMESTAMP;

    nowTz := CAST(nowTimestamp AS TIMESTAMP(0));
    nowDate := CAST(nowTz as DATE);
    nowTime := CAST(nowTz as TIME(0));

    NEW.df_fecha_carga := nowDate;
    NEW.dh_hora_carga := nowTime;
end$$

SET SCHEMA 'mejoreduDB'$$
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE OR REPLACE FUNCTION mejoreduDB.met_indicador_resultado_AFTER_DELETE_func() RETURNS TRIGGER AS $$ 
BEGIN
    UPDATE mejoreduDB.cat_master_catalogo
    SET mejoreduDB.cat_master_catalogo.df_baja = NOW()
    WHERE mejoreduDB.cat_master_catalogo.id_catalogo = OLD.id_catalogo;
    
    UPDATE mejoreduDB.met_cortoplazo_producto
    SET mejoreduDB.met_cortoplazo_producto.id_catalogo_indicador = null
    WHERE mejoreduDB.met_cortoplazo_producto.id_catalogo_indicador = OLD.id_catalogo;
END$$

SET SCHEMA 'mejoreduDB'$$
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE OR REPLACE FUNCTION mejoreduDB.met_indicador_resultado_BEFORE_INSERT_func() RETURNS TRIGGER AS $$ 
BEGIN
	DECLARE nombre_indicador VARCHAR(500);
    clave VARCHAR(45);
    nivel VARCHAR(45);
    
    nombre_indicador := NEW.cx_nombre;
    clave := NEW.cx_clave;
    nivel := NEW.cx_nivel;
    
    IF NEW.id_catalogo IS NULL THEN
		-- SQLINES LICENSE FOR EVALUATION USE ONLY
		INSERT INTO cat_master_catalogo (cd_opcion, cc_externa, cc_externaDos, id_catalogo_padre, cve_usuario) VALUES (nombre_indicador, nivel, clave, 625, 'superusuario');
    
		NEW.id_catalogo := LAST_INSERT_ID();
	END IF;
END$$

SET SCHEMA 'mejoreduDB'$$
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE OR REPLACE FUNCTION mejoreduDB.met_indicador_resultado_BEFORE_UPDATE_func() RETURNS TRIGGER AS $$ 
BEGIN
    DECLARE nombre_indicador VARCHAR(500);
    clave VARCHAR(45);
    nivel VARCHAR(45);

    nombre_indicador := NEW.cx_nombre;
    clave := NEW.cx_clave;
    nivel := NEW.cx_nivel;
    UPDATE cat_master_catalogo
    SET cd_opcion     = nombre_indicador,
        cc_externa    = nivel,
        cc_externaDos = clave
    WHERE id_catalogo = NEW.id_catalogo;
END$$

SET SCHEMA 'mejoreduDB'$$
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE OR REPLACE FUNCTION mejoreduDB.met_arbol_AFTER_INSERT_func() RETURNS TRIGGER AS $$ 
BEGIN
    DECLARE id_presupuestal INT;
    id_catalogo INT;
    id_indicador_resultado INT;
    
    cd_opcion VARCHAR(500);
    
	IF NEW.ix_tipo = 2 THEN
		id_presupuestal := NEW.id_presupuestal;
		id_indicador_resultado := NEW.id_indicador_resultado;

		cd_opcion := NEW.cx_descripcion;

		-- SQLINES DEMO *** aster_catalogo and get the id_catalogo
		-- SQLINES DEMO *** aster_catalogo (cd_opcion, cc_externa, cc_externaDos, id_catalogo_padre, cve_usuario) VALUES (cd_opcion, 'P', 'Propósito', 625, 'superusuario');
		-- SQLINES DEMO ***  LAST_INSERT_ID();

		-- SQLINES DEMO *** ndicador_resultado
		-- SQLINES LICENSE FOR EVALUATION USE ONLY
		INSERT INTO met_indicador_resultado (id_catalogo, cx_nivel, cx_clave, cx_nombre, id_presupuestal) VALUES (id_catalogo, 'Propósito', 'P', cd_opcion, id_presupuestal);
		id_indicador_resultado := LAST_INSERT_ID();

		-- SQLINES DEMO *** with the id_indicador_resultado
		NEW.id_indicador_resultado := id_indicador_resultado;
	END IF;
END$$

SET SCHEMA 'mejoreduDB'$$
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE OR REPLACE FUNCTION mejoreduDB.met_arbol_AFTER_UPDATE_func() RETURNS TRIGGER AS $$ 
BEGIN
	DECLARE id_arbol INT;
 id_presupuestal INT;
 id_catalogo INT;
 id_indicador_resultado INT;
    
 cd_opcion VARCHAR(500);
  
	IF NEW.ix_tipo = 2 THEN
		id_arbol := NEW.id_arbol;
		id_presupuestal := NEW.id_presupuestal;
		id_indicador_resultado := NEW.id_indicador_resultado;

		cd_opcion := NEW.cx_descripcion;

		IF id_indicador_resultado IS NULL THEN
			-- SQLINES DEMO *** aster_catalogo and get the id_catalogo
			-- SQLINES DEMO *** aster_catalogo (cd_opcion, cc_externa, cc_externaDos, id_catalogo_padre, cve_usuario) VALUES (cd_opcion, 'P', 'Propósito', 625, 'superusuario');
			-- SQLINES DEMO ***  LAST_INSERT_ID();

			-- SQLINES DEMO *** ndicador_resultado
			-- SQLINES LICENSE FOR EVALUATION USE ONLY
			INSERT INTO met_indicador_resultado (cx_nivel, cx_clave, cx_nombre, id_presupuestal) VALUES ('Propósito', 'P', cd_opcion, id_presupuestal);
			id_indicador_resultado := LAST_INSERT_ID();

			-- SQLINES DEMO *** with the id_indicador_resultado
			NEW.id_indicador_resultado := id_indicador_resultado;
		ELSE
		    UPDATE met_indicador_resultado SET
                cx_nombre = cd_opcion
		    WHERE id_indicador_resultado = NEW.id_indicador_resultado;
		END IF;
			-- SQLINES DEMO *** _catalogo
			-- SQLINES DEMO *** _catalogo SET cd_opcion = cd_opcion WHERE id_catalogo = (SELECT id_catalogo FROM met_indicador_resultado WHERE id_indicador_resultado = id_indicador_resultado);

			-- SQLINES DEMO *** dor_resultado
			-- SQLINES DEMO *** dor_resultado SET cx_nombre = cd_opcion WHERE id_indicador_resultado = id_indicador_resultado;
		-- EN... SQLINES DEMO ***
	END IF;
END$$

SET SCHEMA 'mejoreduDB'$$
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE OR REPLACE FUNCTION mejoreduDB.delete_indicador_resultado_on_delete_arbol_nodo_func() RETURNS TRIGGER AS $$ 
BEGIN
    DELETE FROM mejoreduDB.met_indicador_resultado WHERE mejoreduDB.met_indicador_resultado.id_indicador_resultado = OLD.id_indicador_resultado;
END$$


DELIMITER ;

/* SET SQL_MODE=@OLD_SQL_MODE; */
/* SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS; */
/* SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS; */
$$ LANGUAGE plpgsql;

CREATE

TRIGGER mejoreduDB.delete_indicador_resultado_on_delete_arbol_nodo
AFTER DELETE ON mejoreduDB.met_arbol_nodo
FOR EACH ROW
EXECUTE FUNCTION mejoreduDB.delete_indicador_resultado_on_delete_arbol_nodo_func();
$$ LANGUAGE plpgsql;

CREATE

TRIGGER mejoreduDB.met_arbol_AFTER_UPDATE
BEFORE UPDATE ON mejoreduDB.met_arbol
FOR EACH ROW
EXECUTE FUNCTION mejoreduDB.met_arbol_AFTER_UPDATE_func();
$$ LANGUAGE plpgsql;

CREATE

TRIGGER mejoreduDB.met_arbol_AFTER_INSERT
BEFORE INSERT ON mejoreduDB.met_arbol
FOR EACH ROW
EXECUTE FUNCTION mejoreduDB.met_arbol_AFTER_INSERT_func();
$$ LANGUAGE plpgsql;

CREATE

TRIGGER mejoreduDB.met_indicador_resultado_BEFORE_UPDATE
BEFORE UPDATE ON mejoreduDB.met_indicador_resultado
FOR EACH ROW
EXECUTE FUNCTION mejoreduDB.met_indicador_resultado_BEFORE_UPDATE_func();
$$ LANGUAGE plpgsql;

CREATE

TRIGGER mejoreduDB.met_indicador_resultado_BEFORE_INSERT
BEFORE INSERT ON mejoreduDB.met_indicador_resultado
FOR EACH ROW
EXECUTE FUNCTION mejoreduDB.met_indicador_resultado_BEFORE_INSERT_func();
$$ LANGUAGE plpgsql;

CREATE

TRIGGER mejoreduDB.met_indicador_resultado_AFTER_DELETE
AFTER DELETE ON mejoreduDB.met_indicador_resultado
FOR EACH ROW
EXECUTE FUNCTION mejoreduDB.met_indicador_resultado_AFTER_DELETE_func();
$$ LANGUAGE plpgsql;

CREATE

TRIGGER mejoreduDB.get_fecha_hora_registro_on_insert_met_archivo
BEFORE INSERT ON mejoreduDB.met_archivo
FOR EACH ROW
EXECUTE FUNCTION mejoreduDB.get_fecha_hora_registro_on_insert_met_archivo_func();
$$ LANGUAGE plpgsql;
$$ LANGUAGE plpgsql;
