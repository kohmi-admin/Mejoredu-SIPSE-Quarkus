const SERVICE_MESSAGES = {
  authUser: {
    200: "Consulta correcta",
    701: "Petición mal realizada en consulta de Entidades Federativas",
    702: "Petición mal realizada en consulta de Municipio por Entidades Federativas",
    703: "Petición mal realizada en consulta de Localidades por municipio y entidad",
    704: "Petición mal realizada en consulta de asentamiento por Localidad, Municipio y Entidad Federativa.",
    705: "Petición mal realizada en consulta de asentamiento por CP.",
  },
  catalogs: {
    200: "Consulta correcta",
    404: "El identificador consultado no éxite"
  }
}

export default SERVICE_MESSAGES;
