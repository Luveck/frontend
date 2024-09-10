// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlSecuritySevice: 'https://localhost:7066/api/',
  //urlSecuritySevice: 'https://appluvecksecurity.azurewebsites.net/api',
  //urlAdminSevice: 'https://appluveckadmin.azurewebsites.net/api',
  urlAdminSevice: 'https://localhost:7294/api',
  menu: [
    {
      text: "Inicio",
      subText: "Vista General",
      icon: "house",
      routerLink: "home",
    },
    {
      text: "Farmacias",
      subText: "Gestión de paises",
      icon: "add_business",
      routerLink: "zonas/farmacias",
      rol: "Admin",
      module: 'Farmacias'
    },
    {
      text: "Reglas de canje",
      subText: "Gestión de reglas",
      icon: "rule",
      routerLink: "inventario/reglas",
      rol: "Admin",
      module: 'Reglas-Canje'
    },
    {
      text: "Registro de ventas",
      subText: "Gestión de ventas",
      icon: "point_of_sale",
      routerLink: "ventas/ventas",
      rol: "Admin",
      module: 'Registro-ventas'
    },
    {
      text: "Seguridad",
      subText: "Gestión de seguridad",
      icon: "admin_panel_settings",
      rol: "Admin",      
      children: [
        {
          text: "Países",
          icon: "flag",
          routerLink: "zonas/paises",
          module: 'Paises',
        },
        {
          text: "Departamentos",
          icon: "signpost",
          routerLink: "zonas/departamentos",
          module: 'Departamentos',
        },
        {
          text: "Ciudades",
          icon: "apartment",
          routerLink: "zonas/ciudades",
          module: 'Ciudades',
        },
        {
          text: "Usuarios",
          icon: "group",
          routerLink: "security/usuarios",
          module: 'Usuarios',
        }
      ]
    },
    {
      text: "Accesibilidad",
      subText: "Gestión de seguridad",
      icon: "account_box",
      rol: "Admin",
      children: [
        {
          text: "Roles",
          icon: "perm_identity",
          routerLink: "security/roles",
          module: 'Roles',
        },
        {
          text: "Modulos por Role",
          icon: "accessibility",
          routerLink: "security/moduleRoles",
          module: 'Modulos-Role',
        }
      ]
    },
    {
      text: "Inventario",
      subText: "Gestión de inventario",
      icon: "inventory",
      children: [
        {
          text: "Categorías",
          icon: "bookmarks",
          routerLink: "inventario/categorias",
          module: 'Categorías',
        },
        {
          text: "Productos",
          icon: "shopping_basket",
          routerLink: "inventario/productos",
          module: 'Productos',
        }
      ]
    },
    {
      text: "Médicos",
      subText: "Gestión de medicos",
      icon: "medical_information",
      children: [
        {
          text: "Especialidades",
          icon: "workspace_premium",
          module: 'Especialidades',
          routerLink: "medicos/especialidades"
        },
        {
          text: "Médicos",
          module: 'Medicos',
          icon: "group_add",
          routerLink: "medicos/medicos"
        }
      ]
    }
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
