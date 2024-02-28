export const environment = {
  production: true,
  urlSecuritySevice: 'https://appluvecksecurity.azurewebsites.net/api',
  urlAdminSevice: 'https://appluveckadmin.azurewebsites.net/api',
  menu: [
    {
      text: "Inicio",
      subText: "Vista General",
      icon: "house",
      routerLink: "home"
    },
    {
      text: "Farmacias",
      subText: "Gestión de paises",
      icon: "add_business",
      routerLink: "zonas/farmacias",
      rol: "Admin"
    },
    {
      text: "Reglas de canje",
      subText: "Gestión de reglas",
      icon: "rule",
      routerLink: "inventario/reglas",
      rol: "Admin"
    },
    {
      text: "Registro de ventas",
      subText: "Gestión de ventas",
      icon: "point_of_sale",
      routerLink: "ventas/ventas",
      rol: "Admin"
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
          routerLink: "zonas/paises"
        },
        {
          text: "Departamentos",
          icon: "signpost",
          routerLink: "zonas/departamentos"
        },
        {
          text: "Ciudades",
          icon: "apartment",
          routerLink: "zonas/ciudades"
        },
        {
          text: "Usuarios",
          icon: "group",
          routerLink: "security/usuarios"
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
          routerLink: "inventario/categorias"
        },
        {
          text: "Productos",
          icon: "shopping_basket",
          routerLink: "inventario/productos"
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
          routerLink: "medicos/especialidades"
        },
        {
          text: "Médicos",
          icon: "group_add",
          routerLink: "medicos/medicos"
        }
      ]
    }
  ]
};
