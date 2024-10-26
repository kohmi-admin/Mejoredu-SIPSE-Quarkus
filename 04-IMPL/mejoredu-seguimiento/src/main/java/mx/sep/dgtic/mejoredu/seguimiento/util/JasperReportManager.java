package mx.sep.dgtic.mejoredu.seguimiento.util;

import java.awt.image.BufferedImage;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.*;

import lombok.SneakyThrows;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProyectoVO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaPresupuesto;
import mx.sep.dgtic.mejoredu.seguimiento.ActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.accion.RespuestaAccionVO;
import mx.sep.dgtic.mejoredu.seguimiento.actividad.RespuestaAdecuacionActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.dao.*;
import mx.sep.dgtic.mejoredu.seguimiento.entity.*;
import mx.sep.dgtic.mejoredu.seguimiento.presupuesto.RespuestaAdecuacionPresupuestoVO;
import mx.sep.dgtic.mejoredu.seguimiento.rest.client.AlfrescoRestClient;
import net.sf.jasperreports.engine.*;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.springframework.stereotype.Component;

import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.Enums.TipoApartadoEnum;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoCalendarioVO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProductoVO;
import mx.edu.sep.dgtic.mejoredu.jasper.JasperReportResponse;
import mx.sep.dgtic.mejoredu.seguimiento.service.AccionService;
import mx.sep.dgtic.mejoredu.seguimiento.service.ActividadService;
import mx.sep.dgtic.mejoredu.seguimiento.service.PresupuestoService;
import mx.sep.dgtic.mejoredu.seguimiento.service.ProductoService;
import mx.sep.dgtic.mejoredu.seguimiento.service.ProyectoService;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.util.JRLoader;

import javax.imageio.ImageIO;
import java.util.List;
import java.util.stream.Collectors;

@SuppressWarnings("ALL")
@Component
public class JasperReportManager {

    private static int Tipo_Adecuacion = 0;
    private static String cveProyecto;
    private static String cveActividad;
    private static final String REPORT_FOLDER = "reports/";
    private static final String JASPER = ".jasper";

    @ConfigProperty(name = "sipse.alf.seguimiento.firma")
    private String uuidFirma;
    @ConfigProperty(name = "sipse.alf.seguimiento.firmaValido")
    private String uuidFirmaValido;
    @ConfigProperty(name = "sipse.alf.seguimiento.firmaAprobo")
    private String uuidFirmaAprobo;
    @ConfigProperty(name = "sipse.alf.seguimiento.firmaMir")
    private String uuidFirmaMir;

    @Inject
    private PresupuestoRepository presupuestoRepository;
    @Inject
    private ActividadService actividadService;
    @Inject
    private PresupuestoService presupuestoService;
    @Inject
    private ProyectoService proyectoService;
    @Inject
    private ProductoService productoService;
    @Inject
    private AccionService accionService;
    @Inject
    private MasterCatalogoRepository catalogoRepository;
    @Inject
    private PartidaGastoRepository partidaGastoRepository;
    @Inject
    private AjustadorPartidaRepository ajustadorPartidaRepository;
    @Inject
    private AdecuacionSolicitudRepository adecuacionSolicitudRepository;
    @Inject
    private PerfilLaboralRepository perfilLaboralRepository;
    @Inject
    private PresupuestoCalendarioRepository presupuestoCalendarioRepository;
    @Inject
    private UsuarioPersonaRepository usuarioPersonaRepository;
    @Inject
    private MehSolicitudRepository mehSolicitudRepository;
    @Inject
    private PersonaRepository personaRepository;
    @Inject
    @RestClient
    private AlfrescoRestClient alfrescoRestClient;

    public JasperReportResponse getItemReport(String fileJasperName, Solicitud solicitud) {
        try {
            // Cargar el archivo JasperReport
            InputStream jasperStream = getClass().getClassLoader()
                    .getResourceAsStream(REPORT_FOLDER + fileJasperName + JASPER);

            if (jasperStream == null) {
                throw new FileNotFoundException("No se encontró el archivo Jasper: " + fileJasperName + JASPER);
            }

            JasperReport jasperReport = (JasperReport) JRLoader.loadObject(jasperStream);

            // Llenar el reporte con los parámetros y un data source vacío
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, getParams(solicitud), new JREmptyDataSource());

            // Exportar el reporte a PDF
            byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);

            // Crear la respuesta con el archivo PDF
            return JasperReportResponse.builder()
                    .streamByte(pdfBytes)
                    .nombreArchivo(fileJasperName + "_" + solicitud.getIdSolicitud())
                    .build();
        } catch (FileNotFoundException e) {
            // Manejo específico para archivo no encontrado
            System.err.println("Error: " + e.getMessage());
        } catch (JRException e) {
            // Manejo de excepciones específicas de JasperReports
            System.err.println("Error al generar el reporte: " + e.getMessage());
        } catch (Exception e) {
            // Manejo de cualquier otra excepción
            System.err.println("Ocurrió un error inesperado: " + e.getMessage());
        }
        return null;
    }


    @SneakyThrows
    private Map<String, Object> getParams(Solicitud solicitud) {

        Map<String, Object> params = new HashMap<>();
        PerfilLaboral perfil = perfilLaboralRepository.findByCveUsuario(solicitud.getUsuario().getCveUsuario()).orElse(null);
        MasterCatalogo area = catalogoRepository.findById(Objects.requireNonNull(perfil).getIdCatalogoUnidad());
        params.put("areaAdministrativa", area.getCcExterna() + "  " + area.getCdOpcion());
        try {
            llenaSeccionSolicitud(params, solicitud);
            for (AdecuacionSolicitud adecuacion : solicitud.getAdecuaciones()) {
                TipoApartadoEnum apartado = TipoApartadoEnum.fromValue(adecuacion.getCatalogoApartado().getId());

                switch (apartado) {
                    case PRESUPUESTO:
                        llenaSeccionPresupuestario(params, adecuacion.getIdAdecuacionSolicitud());
                        //llenaSeccionLineasPresupuesto(params, adecuacion.getIdAdecuacionSolicitud());

                        break;
                    case PROYECTO:
                        llenaSeccionProyecto(params, adecuacion.getIdAdecuacionSolicitud());
                        break;
                    case ACTIVIDAD:
                        llenaSeccionActividad(params, adecuacion.getIdAdecuacionSolicitud());
                        break;
                    case PRODUCTO:
                        llenaSeccionProductos(params, adecuacion.getIdAdecuacionSolicitud());
                        break;
                    case ACCION:
                        llenaSeccionAccion(params, adecuacion.getIdAdecuacionSolicitud());
                        break;
                }
            }


        } catch (Exception e) {
            e.printStackTrace();
        }
        var mehSolicitud = mehSolicitudRepository.find("solicitud.idSolicitud", solicitud.getIdSolicitud()).list();
        List<Integer> idsPermitidos = Arrays.asList(2241, 2243, 2240, 2244);

        List<MasterCatalogo> estatus = mehSolicitud.stream()
                .map(MehSolicitud::getCatalogoEstatus)  // Extrae los estatus
                .distinct()  // Elimina duplicados
                .toList();
        List<MasterCatalogo> estatus2 = estatus.stream().filter(e -> idsPermitidos.contains(e.getId())).toList();
        for (MasterCatalogo catalogoEstatus : estatus2) {

            if (catalogoEstatus.getId().equals(2241)) {

                var lista = mehSolicitud.stream().filter(e -> e.getCatalogoEstatus().getId().equals(2241)).toList();
                PerfilLaboral perfil1 = perfilLaboralRepository.findByCveUsuario(lista.get(0).getUsuario().getCveUsuario()).orElse(null);
                UsuarioPersona usuarioPersona2 = usuarioPersonaRepository.findByCveUsuario(lista.get(0).getUsuario());
                Persona persona3 = personaRepository.findById(usuarioPersona2.getIdUsuarioPersona());
                MasterCatalogo area4 = catalogoRepository.findById(Objects.requireNonNull(perfil1).getIdCatalogoUnidad());

                params.put("formalizoNombre", persona3.getCxNombre() + " " + persona3.getCxPrimerApellido() + " " + persona3.getCxSegundoApellido());
                params.put("formalizoRol", area4.getCdOpcion());

                var file = alfrescoRestClient.getFile(uuidFirma);
                InputStream firma = null;
                try {
                    firma = file.readEntity(InputStream.class);
                    BufferedImage firmaImage = ImageIO.read(firma);
                    params.put("firma", firmaImage);
                } finally {
                    if (firma != null) {
                        firma.close();
                        file.close();
                    }
                }

            }
            if (catalogoEstatus.getId().equals(2243)) {
                var lista = mehSolicitud.stream().filter(e -> e.getCatalogoEstatus().getId().equals(2243)).toList();
                PerfilLaboral perfil1 = perfilLaboralRepository.findByCveUsuario(lista.get(0).getUsuario().getCveUsuario()).orElse(null);
                UsuarioPersona usuarioPersona2 = usuarioPersonaRepository.findByCveUsuario(lista.get(0).getUsuario());
                Persona persona3 = personaRepository.findById(usuarioPersona2.getIdUsuarioPersona());
                MasterCatalogo area4 = catalogoRepository.findById(Objects.requireNonNull(perfil1).getIdCatalogoUnidad());

                params.put("cambiomirNombre", persona3.getCxNombre() + " " + persona3.getCxPrimerApellido() + " " + persona3.getCxSegundoApellido());
                params.put("cambiomirRol", area4.getCdOpcion());

                var file4 = alfrescoRestClient.getFile(uuidFirmaMir);
                InputStream firma4 = null;
                try {
                    firma4 = file4.readEntity(InputStream.class);
                    BufferedImage firmaMir = ImageIO.read(firma4);
                    params.put("firmaMir", firmaMir);
                } finally {
                    if (firma4 != null) {
                        firma4.close();
                        file4.close();
                    }
                }


            }
            if (catalogoEstatus.getId().equals(2240)) {
                var lista = mehSolicitud.stream().filter(e -> e.getCatalogoEstatus().getId().equals(2240)).toList();
                PerfilLaboral perfil1 = perfilLaboralRepository.findByCveUsuario(lista.get(0).getUsuario().getCveUsuario()).orElse(null);
                UsuarioPersona usuarioPersona2 = usuarioPersonaRepository.findByCveUsuario(lista.get(0).getUsuario());
                Persona persona3 = personaRepository.findById(usuarioPersona2.getIdUsuarioPersona());
                MasterCatalogo area4 = catalogoRepository.findById(Objects.requireNonNull(perfil1).getIdCatalogoUnidad());

                params.put("validoNombre", persona3.getCxNombre() + " " + persona3.getCxPrimerApellido() + " " + persona3.getCxSegundoApellido());
                params.put("validoRol", area4.getCdOpcion());

                var file2 = alfrescoRestClient.getFile(uuidFirmaValido);
                InputStream firma2 = null;
                try {
                    firma2 = file2.readEntity(InputStream.class);
                    BufferedImage firmaValido = ImageIO.read(firma2);
                    params.put("firmaValido", firmaValido);
                } finally {
                    if (firma2 != null) {
                        firma2.close();
                        file2.close();
                    }
                }


            }
            if (catalogoEstatus.getId().equals(2244)) {
                var lista = mehSolicitud.stream().filter(e -> e.getCatalogoEstatus().getId().equals(2244)).toList();
                PerfilLaboral perfil1 = perfilLaboralRepository.findByCveUsuario(lista.get(0).getUsuario().getCveUsuario()).orElse(null);
                UsuarioPersona usuarioPersona2 = usuarioPersonaRepository.findByCveUsuario(lista.get(0).getUsuario());
                Persona persona3 = personaRepository.findById(usuarioPersona2.getIdUsuarioPersona());
                MasterCatalogo area4 = catalogoRepository.findById(Objects.requireNonNull(perfil1).getIdCatalogoUnidad());

                params.put("autorizoNombre", persona3.getCxNombre() + " " + persona3.getCxPrimerApellido() + " " + persona3.getCxSegundoApellido());
                params.put("autorizoRol", area4.getCdOpcion());

                var file3 = alfrescoRestClient.getFile(uuidFirmaAprobo);
                InputStream firma3 = null;
                try {
                    firma3 = file3.readEntity(InputStream.class);
                    BufferedImage firmaAprobo = ImageIO.read(firma3);
                    params.put("firmaAprobo", firmaAprobo);
                } finally {
                    if (firma3 != null) {
                        firma3.close();
                        file3.close();

                    }
                }
            }


        }

            return params;
    }

    private void llenaSeccionSolicitud(Map<String, Object> params, Solicitud solicitud) {
        params.put("direccionGeneral", getValorCatalogo(solicitud.getDireccionCatalogo()));
        params.put("tituloAdecuacion",
                getValorCatalogo(solicitud.getAdecuacionCatalogo()) + " " + solicitud.getFechaSolicitud().getYear());
        params.put("tipoAdecuacion",
                "Objetivo de la Adecuación " + getValorCatalogo(solicitud.getAdecuacionCatalogo()));
        params.put("folioSapp", solicitud.getFolioSolicitud());

        params.put("fechaSolicitud", solicitud.getFechaSolicitud());
        params.put("objetivo", solicitud.getObjetivo());
        params.put("justificacion", solicitud.getJustificacion());
    }

    private void llenaSeccionProyecto(Map<String, Object> params, Integer idSolicitud) {
        Tipo_Adecuacion++;
        var proyectos = proyectoService.consultarSolicitudAdecuacionList(idSolicitud);
        if (proyectos.isEmpty()) {
            proyectos = proyectoService.consultaProyectoCancelacion(idSolicitud);
        }
        if (proyectos != null) {
            for (var proyectosIter : proyectos) {
                var proyectoOld = proyectosIter.getProyectoReferencia();
                var proyectoNuevo = proyectosIter.getProyectoModificacion();
                if (proyectosIter.getIdProyectoModificacion() != null && proyectosIter.getIdProyectoReferencia() == null) {
                    if (proyectoNuevo.getClaveUnidad() != null) {
                        int numero = Integer.parseInt(proyectoNuevo.getClaveUnidad());
                        String numeroStr = Integer.toString(numero);
                        char primerDigitoChar = numeroStr.charAt(0);
                        String primerDigito = String.valueOf(Character.getNumericValue(primerDigitoChar));
                        cveProyecto = String.valueOf(proyectoNuevo.getAnhio() % 100) + primerDigito + proyectoNuevo.getClave();
                    }else{ throw new RuntimeException("No tiene clave de unidad el Proyecto");}

                    if (proyectoNuevo.getContribucionProgramaEspecial() != null) {
                        var catalogosNew = catalogoRepository.findById(proyectoNuevo.getContribucionProgramaEspecial());
                        params.put("programaPresupuestarioNew", catalogosNew.getCdOpcion());

                    } else {
                        params.put("programaPresupuestarioNew", "");
                    }

                    params.put("tipoModificacion", "Alta");

                    params.put("proyectoOld", cveProyecto + " - " + proyectoNuevo.getNombre());
                    if (proyectoNuevo.getContribucionProgramaEspecial() != null) {
                        var catalogosOld = catalogoRepository.findById(proyectoNuevo.getContribucionProgramaEspecial());
                        params.put("programaPresupuestarioOld", catalogosOld.getCdOpcion());
                    }
                    params.put("proyectoNew", "");
                    params.put("accionProyecto", "Alta");

                }
                if (proyectosIter.getIdProyectoReferencia() != null && proyectosIter.getIdProyectoModificacion() != null) {
                    if (proyectoOld.getClaveUnidad() != null) {


                        int numero = Integer.parseInt(proyectoOld.getClaveUnidad());
                        String numeroStr = Integer.toString(numero);
                        char primerDigitoChar = numeroStr.charAt(0);
                        String primerDigito = String.valueOf(Character.getNumericValue(primerDigitoChar));
                        cveProyecto = String.valueOf(proyectoOld.getAnhio() % 100) + primerDigito + proyectoOld.getClave();
                    }
                    String proyectoNew = cveProyecto + " - " + proyectoNuevo.getNombre();
                    params.put("tipoModificacion", "Modificación");
                    params.put("proyectoOld", cveProyecto + " - " + proyectoOld.getNombre());
                    if (proyectoOld.getContribucionProgramaEspecial() != null) {
                        var catalogosOld = catalogoRepository.findById(proyectoOld.getContribucionProgramaEspecial());
                        params.put("programaPresupuestarioOld", catalogosOld.getCdOpcion());
                    }
                    if (proyectoNuevo.getContribucionProgramaEspecial() != null) {
                        var catalogosNew = catalogoRepository.findById(proyectoNuevo.getContribucionProgramaEspecial());
                        params.put("programaPresupuestarioOld", catalogosNew.getCdOpcion());
                    }
                    params.put("proyectoNew", proyectoNew);


                    params.put("accionProyecto", "Modificación");
                }
                if (proyectosIter.getIdProyectoReferencia() != null && proyectosIter.getIdProyectoModificacion() == null) {
                    if (proyectoOld.getClaveUnidad() != null) {
                        int numero = Integer.parseInt(proyectoOld.getClaveUnidad());
                        String numeroStr = Integer.toString(numero);
                        char primerDigitoChar = numeroStr.charAt(0);
                        String primerDigito = String.valueOf(Character.getNumericValue(primerDigitoChar));
                        cveProyecto = String.valueOf(proyectoOld.getAnhio() % 100) + primerDigito + proyectoOld.getClave();
                    }
                    params.put("accionProyecto", "Cancelación");
                    params.put("tipoModificacion", "Cancelación");
                    int claveOld = Integer.parseInt(proyectoOld.getClave());
                    params.put("proyectoOld",  cveProyecto + " - " + proyectoOld.getNombre());
                    if (proyectoOld.getContribucionProgramaEspecial() != null) {
                        var catalogosOld = catalogoRepository.findById(proyectoOld.getContribucionProgramaEspecial());
                        params.put("programaPresupuestarioOld", catalogosOld.getCdOpcion());
                    }
                }
                if (proyectoOld != null) {
                    llenarCampos(params, proyectoOld,null,null,null);

                }else {
                    llenarCampos(params, proyectoNuevo,null,null,null);
                }
            }

        }
    }

    private void llenaSeccionActividad(Map<String, Object> params, Integer idSolicitud) {
        Tipo_Adecuacion++;
        var actividades = actividadService.consultarActividad(idSolicitud);
        if (actividades.isEmpty()) {
            actividades = actividadService.consultarActividadCancelacion(idSolicitud);
        }
        ProyectoVO proyecto = null;

        if (!actividades.isEmpty()) {
            List<ActividadJasper> actividadJasper = getActividadJasper(actividades);
            List<ActividadOldJasper> actividadOld = new ArrayList<>();
            List<ActividadNewJasper> actividadNew = new ArrayList<>();

            for (var actividad : actividadJasper) {
                actividadOld.addAll(actividad.getActividadOldJaspers());
                actividadNew.addAll(actividad.getActividadNewJaspers());

            }
            for (var actividad : actividades) {
                if (actividad.getActividadModificacion() != null && actividad.getActividadReferencia() == null) {
                    proyecto = proyectoService.consultaProyectoPorId(actividades.get(0).getActividadModificacion().idProyecto);
                    cveProyecto = claveProyecto(proyecto);
                    proyecto = proyectoService.consultaProyectoPorId(actividad.getActividadModificacion().idProyecto);
                    params.put("tipoModificacion", "Alta");
                    params.put("accionActividad", "Alta");
                    params.put("collectionActividadOld", new JRBeanCollectionDataSource(actividadOld));

                }
                if (actividad.getActividadModificacion() != null && actividad.getActividadReferencia() != null) {
                    proyecto = proyectoService.consultaProyectoPorId(actividades.get(0).getActividadModificacion().idProyecto);
                    cveProyecto = claveProyecto(proyecto);
                    proyecto = proyectoService.consultaProyectoPorId(actividad.getActividadReferencia().idProyecto);
                    params.put("tipoModificacion", "Modificación");
                    params.put("accionActividad", "Modificación");
                    params.put("collectionActividadOld", new JRBeanCollectionDataSource(actividadOld));
                    params.put("collectionActividadNew", new JRBeanCollectionDataSource(actividadNew));

                }
                if (actividad.getActividadModificacion() == null && actividad.getActividadReferencia() != null) {
                    proyecto = proyectoService.consultaProyectoPorId(actividades.get(0).getActividadReferencia().idProyecto);
                    cveProyecto = claveProyecto(proyecto);
                    proyecto = proyectoService.consultaProyectoPorId(actividad.getActividadReferencia().idProyecto);
                    params.put("accionActividad", "Cancelación");
                    params.put("tipoModificacion", "Cancelación");
                    params.put("collectionActividadOld", new JRBeanCollectionDataSource(actividadOld));

                }
            }
        }
        llenarCampos(params, proyecto, null, null, null);


    }

    private void llenaSeccionProductos(Map<String, Object> params, Integer idSolicitud) {
        Tipo_Adecuacion++;
        var producto = productoService.consultaProducto(idSolicitud);
        if (producto.isEmpty()) {
            producto = productoService.consultaProductoCancelacion(idSolicitud);
        }


        if (!producto.isEmpty()) {
            List<ActividadProductoOldJasper> productosOld = new ArrayList<>();
            List<ProductoJasper> productoOldJaspers = new ArrayList<>();
            List<ActividadProductoNewJasper> productosNuevo = new ArrayList<>();
            ActividadVO actividad = null;
            ProyectoVO proyecto = null;
            for (var productoIter : producto) {
                var productoOld = productoIter.getProductoReferencia();
                var productoNuevo = productoIter.getProductoModificacion();
                List<ProductoVO> listaProductos = new ArrayList<>();
                List<ProductoJasper> productoJasperList = new ArrayList<>();


                if (productoNuevo != null && productoOld == null) {
                    actividad = actividadService.consultarPorIdActividad(productoNuevo.getIdActividad());
                    proyecto = proyectoService.consultaProyectoPorId(actividad.idProyecto);
                    params.put("tipoModificacion", "Alta");
                    params.put("accionProducto", "Alta");
                    cveProyecto = claveProyecto(proyecto);
                    cveActividad = claveActividad(actividad);
                    var actividadesOld = productoIter.getProductoModificacion().getProductoCalendario();
                    ActividadProductoOldJasper pOld = new ActividadProductoOldJasper();
                    pOld.setActividadOld(cveProyecto + "-" + cveActividad + " - " + actividad.getCxNombreActividad());
                    pOld.setCollectionProductosAlta(getProductoJasper(actividadesOld).stream().sorted(Comparator.comparing(ProductoJasper::getProducto)).toList());
                    productosOld.add(pOld);
                    params.put("collectionActividadAlta", new JRBeanCollectionDataSource(productosOld));

                }
                if (productoNuevo != null && productoOld != null) {
                    actividad = actividadService.consultarPorIdActividad(productoOld.getIdActividad());
                    proyecto = proyectoService.consultaProyectoPorId(actividad.idProyecto);
                    cveProyecto = claveProyecto(proyecto);
                    cveActividad = claveActividad(actividad);
                     listaProductos.addAll(productoService.consultaPorActividad(actividad.getIdActividad()));
                    params.put("tipoModificacion", "Modificación");
                    params.put("accionProducto", "Modificación");


                    var actividadesOld = productoIter.getProductoReferencia().getProductoCalendario();
                    var actividadesNew = productoIter.getProductoModificacion().getProductoCalendario();
                    ActividadProductoNewJasper pOld = new ActividadProductoNewJasper();
                    pOld.setActividadOld(cveProyecto + "-" + cveActividad + " - " + actividad.getCxNombreActividad());
                    pOld.setCollectionProductosModificacion(getProductoJasper(actividadesNew));
                    for (var p : listaProductos) {
                        productoJasperList.addAll(getProductoJasper(p.getProductoCalendario()));

                    }
                    pOld.setCollectionProductosAlta(productoJasperList);
                    productosNuevo.add(pOld);
                    params.put("collectionActividadAlta", new JRBeanCollectionDataSource(productosNuevo));


                }
                if (productoNuevo == null && productoOld != null) {
                    actividad = actividadService.consultarPorIdActividad(productoOld.getIdActividad());
                    proyecto = proyectoService.consultaProyectoPorId(actividad.idProyecto);
                    cveProyecto = claveProyecto(proyecto);
                    cveActividad = claveActividad(actividad);
                    params.put("tipoModificacion", "Cancelación");
                    params.put("accionProducto", "Cancelación");
                    var actividadesOld = productoIter.getProductoReferencia().getProductoCalendario();
                    ActividadProductoOldJasper pOld = new ActividadProductoOldJasper();
                    pOld.setActividadOld(cveProyecto + "-" + cveActividad + " - " + actividad.getCxNombreActividad());
                    pOld.setCollectionProductosAlta(getProductoJasper(actividadesOld));
                    productosOld.add(pOld);

                    params.put("collectionActividadAlta", new JRBeanCollectionDataSource(productosOld));

                }


            }
            llenarCampos(params, proyecto, actividad, null, null);

        }
    }

    private void llenaSeccionAccion(Map<String, Object> params, Integer idSolicitud) {
        Tipo_Adecuacion++;
        var acciones = accionService.consultarAccion(idSolicitud);
        if (acciones.isEmpty()) {
            acciones = accionService.consultarAccionCancelacion(idSolicitud);
        }
        ProductoVO producto = new ProductoVO();

        ActividadVO actividad = new ActividadVO();
        ProyectoVO proyecto = new ProyectoVO();
        List<AccionOldJasper> accionJasper = new ArrayList<>();
        List<AccionNewJasper> accionJasper2 = new ArrayList<>();

        if (!acciones.isEmpty()) {
                for (var a : acciones) {
                    if (a.getAccionModificacion() != null && a.getAccionReferencia() == null) {
                        params.put("tipoModificacion", "Alta");
                        params.put("accionAccion", "Alta");
                        producto = productoService.consultarPorId(a.getAccionModificacion().getIdProducto());
                        actividad = actividadService.consultarPorIdActividad(producto.getIdActividad());
                        proyecto = proyectoService.consultaProyectoPorId(actividad.idProyecto);
                        AccionOldJasper pOld = new AccionOldJasper();
                        cveProyecto = claveProyecto(proyecto);
                        cveActividad = claveActividad(actividad);
                        int cve = Integer.parseInt(producto.getCveProducto());

                        pOld.setAccionOld(cveProyecto + "-" +cveActividad + "-" + String.format("%02d",cve) + "-" +String.format("%02d",a.getAccionModificacion().getClaveAccion()) + " - " + a.getAccionModificacion().getNombre());
                        accionJasper.add(pOld);

                        params.put("collectionAccionOld", new JRBeanCollectionDataSource(accionJasper));
                    }
                    if (a.getAccionReferencia() != null && a.getAccionModificacion() == null) {
                        params.put("tipoModificacion", "Cancelación");
                        params.put("accionAccion", "Cancelación");
                        producto = productoService.consultarPorId(a.getAccionReferencia().getIdProducto());
                        actividad = actividadService.consultarPorIdActividad(producto.getIdActividad());
                        proyecto = proyectoService.consultaProyectoPorId(actividad.idProyecto);
                        AccionOldJasper pOld = new AccionOldJasper();
                        cveProyecto = claveProyecto(proyecto);
                        cveActividad = claveActividad(actividad);
                        int cve = Integer.parseInt(producto.getCveProducto());
                        pOld.setAccionOld(cveProyecto + "-" +cveActividad + "-" +String.format("%02d",cve) + "-" +String.format("%02d",a.getAccionReferencia().getClaveAccion()) + " - " + a.getAccionReferencia().getNombre());
                        accionJasper.add(pOld);

                        params.put("collectionAccionOld", new JRBeanCollectionDataSource(accionJasper));

                    }if (a.getAccionReferencia() != null && a.getAccionModificacion() != null) {
                        params.put("tipoModificacion", "Modificación");
                        params.put("accionAccion", "Modificación");
                        producto = productoService.consultarPorId(a.getAccionModificacion().getIdProducto());
                        actividad = actividadService.consultarPorIdActividad(producto.getIdActividad());
                        proyecto = proyectoService.consultaProyectoPorId(actividad.idProyecto);
                        AccionOldJasper pOld = new AccionOldJasper();
                        cveProyecto = claveProyecto(proyecto);
                        cveActividad = claveActividad(actividad);
                        int cve = Integer.parseInt(producto.getCveProducto());

                        AccionNewJasper pOld2 = new AccionNewJasper();
                        pOld2.setAccionNew( cveProyecto + "-" +cveActividad + "-" + String.format("%02d",cve) + "-" +String.format("%02d",a.getAccionModificacion().getClaveAccion()) + " - " + a.getAccionModificacion().getNombre());
                        accionJasper2.add(pOld2);
                        pOld.setAccionOld(cveProyecto + "-" +cveActividad + "-" +String.format("%02d",cve) + "-" +String.format("%02d",a.getAccionReferencia().getClaveAccion()) + " - " + a.getAccionReferencia().getNombre());
                        accionJasper.add(pOld);
                        params.put("collectionAccionOld", new JRBeanCollectionDataSource(accionJasper));
                        params.put("collectionAccionNew", new JRBeanCollectionDataSource(accionJasper2));

                    }

                }

                llenarCampos(params, proyecto, actividad, producto, null);


        }
    }

    private void llenaSeccionPresupuestario(Map<String, Object> params, Integer idSolicitud) {
        Tipo_Adecuacion++;
        var soli = adecuacionSolicitudRepository.findById(idSolicitud);
        var presupuestos = presupuestoService.consultarPresupuesto(soli.getIdAdecuacionSolicitud());
        if (presupuestos.isEmpty()) {
            presupuestos = presupuestoService.consultarPresupuestoCancelacion(idSolicitud);
        }
        if (Tipo_Adecuacion == 1) {
            params.put("tipoModificacion", "Presupuestal");
        }if (Tipo_Adecuacion > 1) {
            params.put("tipoModificacion", "Programática Presupuestal");
        }
        final String[] mes = {"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
                "Septiembre", "Octubre", "Noviembre", "Diciembre"};
        Presupuesto presupuestoOld;
        Presupuesto presupuestoNuevo;
        RespuestaAccionVO accion = null;
        ProductoVO producto = null;
        ActividadVO actividad = null;
        ProyectoVO proyecto = null;

        if (!presupuestos.isEmpty()) {
            List<AccionPresupuestoJasper> accionPresupuestoJaspersList = new ArrayList<>();
            for (var presu : presupuestos) {
                if (presu.getIdPresupuestoReferencia() == null && presu.getIdPresupuestoModificacion() != null) {
                    params.put("tipoModificacion", "Alta");
                    params.put("accionPresupuesto", "Alta");
                    accion = accionService.consultarPorId(presu.getIdPresupuestoModificacion());
                    producto = productoService.consultarPorId(accion.getIdProducto());
                    actividad = actividadService.consultarPorIdActividad(producto.getIdActividad());
                    proyecto = proyectoService.consultaProyectoPorId(actividad.idProyecto);
                    cveProyecto = claveProyecto(proyecto);
                    cveActividad = claveActividad(actividad);


                    presupuestoNuevo = presupuestoRepository.findById(presu.getIdPresupuestoModificacion());
                    AccionPresupuestoJasper accionPresupuestoJasper = new AccionPresupuestoJasper();
                    params.put("programaPresupuestarioOld",
                            presupuestoNuevo.getCveAccion() + " - " + presupuestoNuevo.getCxNombreAccion());
                    List<PresupuestoJasper> calendarioPresupuestoList = new ArrayList<>();
                    int cve = Integer.parseInt(producto.getCveProducto());
                    accionPresupuestoJasper.setAccionOld( cveProyecto + "-" + cveActividad + " - " + String.format("%02d", cve) + " - " + presupuestoNuevo.getCveAccion() + " - " + presupuestoNuevo.getCxNombreAccion());

                    for (var presupuesto : presupuestoNuevo.getPartidasGasto()) {

                        for (var calendario : presupuesto.getCalendarios().stream().sorted(Comparator.comparing(PresupuestoCalendario::getIxMes)).toList()) {
                            if (calendario.getIxMonto() > 0.0 || calendario.getIxMonto() != 0 || calendario.getIxMonto() > 0) {
                                PresupuestoJasper presupuestoJasper = new PresupuestoJasper();
                                presupuestoJasper.setPartida(calendario.getPartidaGasto().getCatalogoPartida().getCdOpcion());
                                presupuestoJasper.setMesAmpliacion(mes[calendario.getIxMes() - 1]);
                                presupuestoJasper.setImporteNeto(calendario.getIxMonto());
//                        presupuestoJasper.setClave(calendario.getIxMonto());
                                presupuestoJasper.setClaveAmpliacion(calendario.getPartidaGasto().getCatalogoPartida().getCcExterna());
//                        presupuestoJasper.setMesAmpliacion(calendario.getIxMonto());
                                presupuestoJasper.setImporteAmpliacion(calendario.getIxMonto());
                                calendarioPresupuestoList.add(presupuestoJasper);
                            }
                        }

                    }

                    accionPresupuestoJasper.setCollectionPresupuestos(calendarioPresupuestoList);
                    accionPresupuestoJaspersList.add(accionPresupuestoJasper);


                    params.put("collectionAccionAlta", new JRBeanCollectionDataSource(accionPresupuestoJaspersList));
                }
                // MODIFICACION
                if (presu.getIdPresupuestoReferencia() != null && presu.getIdPresupuestoModificacion() != null) {
                    params.put("tipoModificacion", "Modificación");
                    params.put("accionPresupuesto", "Modificación");
                   llenaSeccionLineasPresupuesto(params, idSolicitud);

                }
                if (presu.getIdPresupuestoReferencia() != null && presu.getIdPresupuestoModificacion() == null) {
                    params.put("tipoModificacion", "Cancelación");
                    params.put("accionPresupuesto", "Cancelación");
                    llenaSeccionLineasPresupuesto(params, idSolicitud);
                }

            }
            llenarCampos(params, proyecto, actividad, producto, accion);
        }


    }

    private void llenaSeccionLineasPresupuesto(Map<String, Object> params, Integer idSolicitud) {
        Tipo_Adecuacion++;
//        if (Tipo_Adecuacion == 1 || Tipo_Adecuacion == 2) {
//            params.put("tipoModificacion", "Presupuestal");
//        }
//        if (Tipo_Adecuacion == 6) {
//            params.put("tipoModificacion", "Programatica Presupuestal");
//        }
        var presupuestoss = presupuestoService.consultarPresupuesto(idSolicitud);
        if (presupuestoss.isEmpty()) {
            presupuestoss = presupuestoService.consultarPresupuestoCancelacion(idSolicitud);
        }
        if (presupuestoss.isEmpty()) {
            var adecuacionSolicitudes = adecuacionSolicitudRepository.find("solicitud.idSolicitud = ?1 and catalogoApartado.id = ?2 ", idSolicitud,2221).list();
            presupuestoss = presupuestoService.consultarPresupuestoCancelacion(adecuacionSolicitudes.get(0).getIdAdecuacionSolicitud());
            if (presupuestoss.isEmpty())
            presupuestoss = presupuestoService.consultarPresupuestoModificacion(adecuacionSolicitudes.get(0).getIdAdecuacionSolicitud());
        }
        List<AccionPresupuestoJasper> accionPresupuestoJaspersList = new ArrayList<>();
        for (var presupuesto : presupuestoss) {
            RespuestaPresupuesto presupuestoDat = null;
            if (presupuesto.getPresupuestoReferencia() == null && presupuesto.getPresupuestoModificacion() != null) {
                 presupuestoDat =presupuesto.getPresupuestoModificacion();
                params.put("tipoModificacion", "Alta");
            }if (presupuesto.getPresupuestoReferencia() != null && presupuesto.getPresupuestoModificacion() == null) {
                presupuestoDat =presupuesto.getPresupuestoReferencia();
                params.put("tipoModificacion", "Cancelación");
            }if (presupuesto.getPresupuestoReferencia() != null && presupuesto.getPresupuestoModificacion() != null) {
                presupuestoDat =presupuesto.getPresupuestoModificacion();
                params.put("tipoModificacion", "Modificación");
            }
                RespuestaAccionVO accion;
                ProductoVO producto;
                ActividadVO actividad;
                ProyectoVO proyecto;

                accion = accionService.consultarPorId(presupuestoDat.getIdPresupuesto());
                producto = productoService.consultarPorId(accion.getIdProducto());
                actividad = actividadService.consultarPorIdActividad(producto.getIdActividad());
                proyecto = proyectoService.consultaProyectoPorId(actividad.idProyecto);
                var presupuestoRepo = presupuestoRepository.findById(presupuesto.getIdPresupuestoReferencia());
                if (presupuestoRepo == null) {
                    break;
                }
                var partidagAsto = ajustadorPartidaRepository.find("idPresupuesto = ?1 and idAdecuacionSolicitud = ?2 ORDER BY id ", presupuestoRepo.getIdPresupuesto(),idSolicitud)
                        .list();

                List<AjustadorPartida> partidagAsto2 = partidagAsto.stream()
                        .filter(x -> x.getIxMes() != 0) // Filtra los elementos donde ixMes no es 0
                        .collect(Collectors.toMap(
                                AjustadorPartida::getIxMes, // Usa ixMes como clave
                                x -> x,                         // Usa el objeto como valor
                                (existing, replacement) -> existing)) // Maneja colisiones manteniendo el existente
                        .values() // Obtén los valores del mapa (sin duplicados)
                        .stream() // Convierte de nuevo a stream
                        .toList();

                List<PresupuestoCalendario> calendarioList = new ArrayList<>();
                for (PartidaGasto partida : presupuestoRepo.getPartidasGasto()) {
                    for (PresupuestoCalendario calendario : partida.getCalendarios()) {
                        for (AjustadorPartida ajustador : partidagAsto) {
                            if (ajustador.getIxMes().equals(calendario.getIxMes())) {
                                if (ajustador.getIxMonto() != 0.0)
                                    calendarioList.add(calendario);
                            }
                        }

                    }
                }
                calendarioList.sort(Comparator.comparingInt(PresupuestoCalendario::getIxMes));
                final String[] mes = {"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
                        "Septiembre", "Octubre", "Noviembre", "Diciembre"};
                AccionPresupuestoJasper accionPresupuestoJasper = new AccionPresupuestoJasper();
                accionPresupuestoJasper.setAccionOld(accion.getClaveAccion() + " - " + accion.getNombre());
                List<PresupuestoJasper> presupuestosList = new ArrayList<>();
                for (AjustadorPartida cal : partidagAsto) {
                    var catalogo = catalogoRepository.findById(cal.getIdPartida());
                    var partidaGAsto = partidaGastoRepository
                            .find("presupuesto.idPresupuesto = ?1", presupuestoRepo.getIdPresupuesto()).firstResult();
                    var presupuestoCalendario = presupuestoCalendarioRepository.find("partidaGasto.idPartida = ?1", partidaGAsto.getIdPartida()).firstResult();

                    if (cal.getTipo().equals(1) /*&& cal.getIxMonto().equals(calendarizacion.getIxMonto())*/) {
                        presupuestosList.add(PresupuestoJasper.builder()
                                .partida(cal.getCvePresupuestal() + " - "
                                        + catalogo.getCdOpcion())
                                .claveAmpliacion(cal.getCvePresupuestal()).importeAmpliacion(cal.getIxMonto())
                                .mesAmpliacion(mes[cal.getIxMes() - 1]).importeNeto(cal.getIxMonto())
                                .build());

                        JRBeanCollectionDataSource beanColDataSourcePresupuestos = new JRBeanCollectionDataSource(
                                presupuestosList);
                        params.put("accionPresupuesto", "Traspaso");

                    } else if (cal.getTipo().equals(2) /*&& cal.getIxMonto().equals(calendarizacion.getIxMonto())*/) {
                        presupuestosList.add(PresupuestoJasper.builder()
                                .partida(cal.getCvePresupuestal() + " - "
                                        + catalogo.getCdOpcion())
                                .clave(cal.getCvePresupuestal()).importe(cal.getIxMonto())
                                .mes(mes[cal.getIxMes() - 1]).importeNeto(cal.getIxMonto()).build());

                        JRBeanCollectionDataSource beanColDataSourcePresupuestos = new JRBeanCollectionDataSource(
                                presupuestosList);

                        params.put("accionPresupuesto", "Traspaso");
                    }



                }
                accionPresupuestoJasper.setCollectionPresupuestos(presupuestosList);
                accionPresupuestoJaspersList.add(accionPresupuestoJasper);
                params.put("collectionAccionAlta", new JRBeanCollectionDataSource(accionPresupuestoJaspersList));

                llenarCampos(params, proyecto, actividad, producto, accion);
                break;


        }

    }

    private List<ProductoJasper> getProductoJasper(List<ProductoCalendarioVO> calendarios) {
        List<ProductoJasper> productos = new ArrayList<>();

        Set<Integer> idProductos = new HashSet<>();
        for (ProductoCalendarioVO calendario : calendarios) {
            idProductos.add(calendario.getIdProducto());
        }

        for (Integer idProducto : idProductos) {
            ProductoVO producto = productoService.consultarPorId(idProducto);
            ProductoJasper pJasper = new ProductoJasper();
            int cve = Integer.parseInt(producto.getCveProducto());
            pJasper.setProducto(cveProyecto + "-" +cveActividad + "-" +String.format("%02d",cve) + " - " + producto.getNombre());
            for (ProductoCalendarioVO calendario : calendarios) {
                if (idProducto.equals(calendario.getIdProducto())) {
                    llenaMeses(pJasper, calendario.getMes(), calendario.getMonto());
                }
            }
            productos.add(pJasper);
        }

        return productos;


    }

    private List<ActividadJasper> getActividadJasper(List<RespuestaAdecuacionActividadVO> actividadList) {
        List<ActividadJasper> actividadJaspers = new ArrayList<>();
        List<ActividadOldJasper> listaactividadOld = new ArrayList<>();
        List<ActividadNewJasper> listaactividadNew = new ArrayList<>();

        for (RespuestaAdecuacionActividadVO actividad : actividadList) {

            ActividadNewJasper aJasper1 = new ActividadNewJasper();

            if (actividad.getActividadReferencia() != null && actividad.getActividadModificacion() != null) {
                var actividadOldlst = actividadService.consultarPorIdActividadList(actividad.getIdActividadReferencia());

                List<ActividadVO> actividadVOSList = actividadService.consultarPorIdProyecto(actividad.getActividadReferencia().getIdProyecto(),EstatusEnum.COMPLETO.getEstatus());
//                for (ActividadVO actividadOld : actividadVOSList) {
//                    ActividadOldJasper aJasper = new ActividadOldJasper();
//                    aJasper.setActividadOld(cveProyecto + "-" + String.format("%02d",actividadOld.getCveActividad()) + " - " + actividadOld.getCxNombreActividad());
//                    listaactividadOld.add(aJasper);
//                }
                ActividadOldJasper aJasper = new ActividadOldJasper();
                aJasper.setActividadOld(cveProyecto + "-" + String.format("%02d",actividadOldlst.get(0).getCveActividad()) + " - " + actividadOldlst.get(0).getCxNombreActividad());
                listaactividadOld.add(aJasper);

                var actividadNewlst = actividadService.consultarPorIdActividadList(actividad.getIdActividadModificacion());

                aJasper1.setActividadNew(cveProyecto + "-" + String.format("%02d",actividadNewlst.get(0).getCveActividad()) + " - " + actividadNewlst.get(0).getCxNombreActividad());
                listaactividadNew.add(aJasper1);
            }
            // Consultar la actividad por su ID de referencia
            if (actividad.getActividadModificacion() != null && actividad.getActividadReferencia() == null) {
                var actividadOldlst = actividadService.consultarPorIdActividadList(actividad.getIdActividadModificacion());
                ActividadOldJasper aJasper = new ActividadOldJasper();
                aJasper.setActividadOld(cveProyecto + "-" + String.format("%02d",actividadOldlst.get(0).getCveActividad()) + " - " + actividadOldlst.get(0).getCxNombreActividad());
                listaactividadOld.add(aJasper);

            }
            if (actividad.getActividadReferencia() != null && actividad.getActividadModificacion() == null) {
                var actividadOldlst = actividadService.consultarPorIdActividadList(actividad.getIdActividadReferencia());
                ActividadOldJasper aJasper = new ActividadOldJasper();
                aJasper.setActividadOld(cveProyecto + "-" + String.format("%02d",actividadOldlst.get(0).getCveActividad()) + " - " + actividadOldlst.get(0).getCxNombreActividad());
                listaactividadOld.add(aJasper);

            }
        }
        actividadJaspers.add(new ActividadJasper(listaactividadOld, null, listaactividadNew));


        return actividadJaspers;
    }

    private void llenaMeses(ProductoJasper pJasper, Integer mes, Integer monto) {
        switch (mes) {
            case 1:
                pJasper.setEnero(monto);
                break;
            case 2:
                pJasper.setFebrero(monto);
                break;
            case 3:
                pJasper.setMarzo(monto);
                break;
            case 4:
                pJasper.setAbril(monto);
                break;
            case 5:
                pJasper.setMayo(monto);
                break;
            case 6:
                pJasper.setJunio(monto);
                break;
            case 7:
                pJasper.setJulio(monto);
                break;
            case 8:
                pJasper.setAgosto(monto);
                break;
            case 9:
                pJasper.setSeptiembre(monto);
                break;
            case 10:
                pJasper.setOctubre(monto);
                break;
            case 11:
                pJasper.setNoviembre(monto);
                break;
            case 12:
                pJasper.setDiciembre(monto);
                break;
        }
    }


    private void llenarCampos(Map<String, Object> params, ProyectoVO proyecto, ActividadVO actividad, ProductoVO producto, RespuestaAccionVO accion) {
        List<ActividadVO> activi = new ArrayList<>();
        List<ProductoVO> product = new ArrayList<>();

        // Llenar Proyectos
        if (proyecto != null) {
            int numero = Integer.parseInt(proyecto.getClaveUnidad());
            String numeroStr = Integer.toString(numero);
            char primerDigitoChar = numeroStr.charAt(0);
            String primerDigito = String.valueOf(Character.getNumericValue(primerDigitoChar));
            cveProyecto = String.valueOf(proyecto.getAnhio() % 100) + primerDigito + proyecto.getClave();
            params.putIfAbsent("accionProyecto", "Sin cambios");
            params.putIfAbsent("proyectoOld", cveProyecto + " - " + proyecto.getNombre());
        }

        // Llenar Actividad

            List<ActividadOldJasper> actividades = new ArrayList<>();
            var listaActividades = actividadService.consultarPorIdProyecto(Objects.requireNonNull(proyecto).getIdProyecto(), EstatusEnum.COMPLETO.getEstatus());
            activi = listaActividades;
            for (var actividadIndex : listaActividades.stream().sorted(Comparator.comparing(ActividadVO::getCveActividad)).toList()) {
                actividades.add(new ActividadOldJasper(cveProyecto + "-" + String.format("%02d",actividadIndex.getCveActividad()) + " - " + actividadIndex.getCxNombreActividad(), null));
            }
            params.putIfAbsent("collectionActividadOld", new JRBeanCollectionDataSource(actividades.stream().distinct().collect(Collectors.toList())));
            params.putIfAbsent("accionActividad", "Sin cambios");

        // Llenar Productos

            List<ActividadProductoOldJasper> actividades2 = new ArrayList<>();

            for (var actividadIndex : activi) {

                ActividadProductoOldJasper pOld = new ActividadProductoOldJasper();
                pOld.setActividadOld(String.format("%02d",actividadIndex.getCveActividad()) + " - " + actividadIndex.getCxNombreActividad());

                var listaProductos = productoService.consultaPorActividad(actividadIndex.getIdActividad());
                product.addAll(listaProductos);
                List<ProductoJasper> productos2 = new ArrayList<>();

                for (var productoIndex : listaProductos.stream().sorted(Comparator.comparing(ProductoVO::getCveProducto)).toList()) {
                    ProductoJasper prod = new ProductoJasper();
                    int cve = Integer.parseInt(productoIndex.getCveProducto());
                    prod.setProducto(String.format(cveProyecto + "-" + "%02d",actividadIndex.getCveActividad()) + "-" + String.format("%02d",cve) + " - " + productoIndex.getNombre());
                    for (var productoIndex2 : productoIndex.getProductoCalendario()) {
                        llenaMeses(prod, productoIndex2.getMes(), productoIndex2.getMonto());
                    }
                    productos2.add(prod);
                }
                pOld.setCollectionProductosAlta(productos2);
                actividades2.add(pOld);
                params.putIfAbsent("collectionProductosAlta", new JRBeanCollectionDataSource(productos2));
                params.putIfAbsent("productosOld", new JRBeanCollectionDataSource(productos2));
            }

            params.putIfAbsent("actividadCanc", new JRBeanCollectionDataSource(actividades2));
            params.putIfAbsent("collectionActividadAlta", new JRBeanCollectionDataSource(actividades2.stream().distinct().filter(x -> !x.getCollectionProductosAlta().isEmpty()).collect(Collectors.toList())));
            params.putIfAbsent("productosNew", new JRBeanCollectionDataSource(Collections.emptyList()));
            params.putIfAbsent("accionProducto", "Sin cambios");

        // Llenar Accion
        List<AccionOldJasper> acciones2 = new ArrayList<>();

            for (var listaProdu : product) {

                var actividadIndex = actividadService.consultarPorIdActividad(listaProdu.getIdActividad());
                int cve = Integer.parseInt(listaProdu.getCveProducto());
                var accionList = accionService.consultarPorProducto(listaProdu.getIdProducto());
                for (var accionIndex : accionList.stream().sorted(Comparator.comparing(RespuestaAccionVO::getClaveAccion)).toList()) {
                    acciones2.add(new AccionOldJasper(cveProyecto + "-" + String.format("%02d",actividadIndex.getCveActividad()) + "-" + String.format("%02d", cve) + "-" + String.format("%02d", accionIndex.getClaveAccion()) + " - " + accionIndex.getNombre()));
                }
            }

        params.putIfAbsent("accionAccion", "Sin cambios");
        params.putIfAbsent("collectionAccionOld", new JRBeanCollectionDataSource(acciones2.stream().sorted(Comparator.comparing(AccionOldJasper::getAccionOld)).toList().stream().distinct().collect(Collectors.toList())));
        params.putIfAbsent("collectionAccionNew", new JRBeanCollectionDataSource(Collections.emptyList()));

            for (var listaProdu: product) {
                var presu = presupuestoRepository.consultarAccionPorIdProducto(listaProdu.getIdProducto()).stream().filter(x -> x.getPartidasGasto().size() > 0).collect(Collectors.toList());
                for (var presuIndex : presu) {
                    // estaba intentando rellenar el presupuesto cuando solo se tiene la actividad
                }
            }
            // Llenar Presupuesto
//            llenaSeccionPresupuestario(params, );

    }


    private String getValorCatalogo(MasterCatalogo catalogo) {
        return catalogo != null ? catalogo.getCdOpcion() : "";
    }
    private String claveProyecto(ProyectoVO pro) {
        int numero = Integer.parseInt(pro.getClaveUnidad());
        String numeroStr = Integer.toString(numero);
        char primerDigitoChar = numeroStr.charAt(0);
        String primerDigito = String.valueOf(Character.getNumericValue(primerDigitoChar));
        cveProyecto = String.valueOf(pro.getAnhio() % 100) + primerDigito + pro.getClave();

        return cveProyecto;
    }
    private String claveActividad(ActividadVO act) {
        return String.format("%02d",act.getCveActividad());
    }

}
