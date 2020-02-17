import { settings } from 'cluster';

const API_DOMAIN = 'http://3.209.10.150:80/bffgestar/api/v1';
const GESTAR_SERVER = 'http://3.209.10.150'
const APPVIRTUALROOT = "c"

export const environment = {
  production: false,
  addresses: {
    project: {
      getNewProyect: `${API_DOMAIN}/Proyectos/New/`,
      getOpenProyect: `${API_DOMAIN}/Proyectos/Doc/`,
      putSaveProject: `${API_DOMAIN}/Proyectos`,
      putChangeProject: `${API_DOMAIN}/Proyectos/Doc/`,
      searchProject: `${API_DOMAIN}/Proyectos/Find`
    },
    requirement: {
      getNewSelects: `${API_DOMAIN}/Requerimientos/New/Keywords`,
      getNewRequirements: `${API_DOMAIN}/Requerimientos/New`,
      getOpenByDocId: `${API_DOMAIN}/Requerimientos/Doc/`,
      saveNewRequirement: `${API_DOMAIN}/Requerimientos`,
      changeRequirementById: `${API_DOMAIN}/Requerimientos/Doc/`,
    },
    user: {
      findUser: `${API_DOMAIN}/Usuarios`,
    },
    contact: {
      findCliend: `${API_DOMAIN}/Contactos`,
    },
    activities: {
      searchActivities: `${API_DOMAIN}/Actividades`,
      newActivity: `${GESTAR_SERVER}/${APPVIRTUALROOT}/forms/generic3.asp?closeonexit=1&action=new&actionact=newact&fld_id=5213`
    },
    loggedUserInfo: {
      loggedUserInfo: `${API_DOMAIN}/Usuarios/loggedUserInfo`
    },
    closeRequirement: {
      close: `${GESTAR_SERVER}/${APPVIRTUALROOT}/content.asp?fld_id=`
    },
    closeProject: {
      close: `${GESTAR_SERVER}/${APPVIRTUALROOT}/content.asp?fld_id=`
    },
    settings: {
      getSetting : `${API_DOMAIN}/Settings`
    }
  },
};

