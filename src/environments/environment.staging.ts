const API_DOMAIN = 'http://3.231.217.94:80/bffgestar/api/v1';

export const environmentProd = {
  production: false,
  addresses: {
    project: {
      getNewProyect: `${API_DOMAIN}/Proyectos/New/`,
      getOpenProyect: `${API_DOMAIN}/Proyectos/Doc/`,
      putSaveProject: `${API_DOMAIN}/Proyectos`,
      putChangeProject: `${API_DOMAIN}Proyectos/`,
      searchProject: `${API_DOMAIN}Proyectos/Find`
    },
    requirement: {
      getNewSelects: `${API_DOMAIN}/Requerimientos/New/Keywords`,
      getNewRequirements: `${API_DOMAIN}/Requerimientos/New`,
      getOpenByDocId: `${API_DOMAIN}/Requerimientos/Doc`,
      saveNewRequirement: `${API_DOMAIN}/Requerimientos`,
      changeRequirementById: `${API_DOMAIN}/Requerimientos/Doc`,
    },
    user: {
      findUser: `${API_DOMAIN}/Usuarios`,
    },
    contact: {
      findCliend: `${API_DOMAIN}/Contactos`,
    },
    activities: {
      searchActivities: `${API_DOMAIN}/Actividades`
    }
  },
};

