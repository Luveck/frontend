export const environment = {
  production: true,
  urlSecuritySevice: '',
  urlAdminSevice: '',
  urlApi: 'https://security.dev.pasionporvivir.luveck.com/api',
  menu: [
    {
      text: 'Inicio',
      subText: 'Inicio',
      icon: 'house',
      routerLink: 'home',
      module: 'inicio',
      enabled: true,
    },
    {
      text: 'Inicio',
      subText: 'Vista General',
      icon: 'house',
      routerLink: 'panelControl',
      module: 'PanelControl',
      enabled: true,
    },
    {
      text: 'Cadenas',
      subText: 'Gestión de cadenas',
      icon: 'add_business',
      routerLink: 'zonas/cadenas',
      module: 'Cadenas',
      enabled: true,
    },
    {
      text: 'Farmacias',
      subText: 'Gestión de farmacias',
      icon: 'add_business',
      routerLink: 'zonas/farmacias',
      module: 'Farmacias',
      enabled: true,
    },
    {
      text: 'Reglas de canje',
      subText: 'Gestión de reglas',
      icon: 'rule',
      routerLink: 'inventario/reglas',
      module: 'Reglas-Canje',
      enabled: true,
    },
    {
      text: 'Registro de ventas',
      subText: 'Gestión de ventas',
      icon: 'point_of_sale',
      routerLink: 'ventas/ventas',
      module: 'Registro-ventas',
      enabled: true,
    },
    {
      text: 'Seguridad',
      subText: 'Gestión de seguridad',
      icon: 'admin_panel_settings',
      module: 'Seguridad',
      enabled: true,
      children: [
        {
          text: 'Países',
          icon: 'flag',
          routerLink: 'zonas/paises',
          module: 'Paises',
          enabled: true,
        },
        {
          text: 'Departamentos',
          icon: 'signpost',
          routerLink: 'zonas/departamentos',
          module: 'Departamentos',
          enabled: true,
        },
        {
          text: 'Ciudades',
          icon: 'apartment',
          routerLink: 'zonas/ciudades',
          module: 'Ciudades',
          enabled: true,
        },
        {
          text: 'Usuarios',
          icon: 'group',
          routerLink: 'security/usuarios',
          module: 'Usuarios',
          enabled: true,
        },
      ],
    },
    {
      text: 'Accesibilidad',
      subText: 'Gestión de seguridad',
      icon: 'account_box',
      module: 'Accesibilidad',
      enabled: true,
      children: [
        {
          text: 'Roles',
          icon: 'perm_identity',
          routerLink: 'security/roles',
          module: 'Roles',
          enabled: true,
        },
        {
          text: 'Modulos por Role',
          icon: 'accessibility',
          routerLink: 'security/moduleRoles',
          module: 'Modulos-Role',
          enabled: true,
        },
        {
          text: 'Permisos por Role',
          icon: 'accessibility',
          routerLink: 'security/rolesPermissions',
          module: 'Modulos-Role',
          enabled: true,
        },
      ],
    },
    {
      text: 'Inventario',
      subText: 'Gestión de inventario',
      icon: 'inventory',
      module: 'Inventario',
      enabled: true,
      children: [
        {
          text: 'Categorías',
          icon: 'bookmarks',
          routerLink: 'inventario/categorias',
          module: 'Categorías',
          enabled: true,
        },
        {
          text: 'Productos',
          icon: 'shopping_basket',
          routerLink: 'inventario/productos',
          module: 'Productos',
          enabled: true,
        },
      ],
    },
    {
      text: 'Médicos',
      subText: 'Gestión de medicos',
      icon: 'medical_information',
      module: 'medicos',
      enabled: true,
      children: [
        {
          text: 'Especialidades',
          icon: 'workspace_premium',
          module: 'Especialidades',
          routerLink: 'medicos/especialidades',
          enabled: true,
        },
        {
          text: 'Médicos',
          module: 'Medicos',
          icon: 'group_add',
          routerLink: 'medicos/medicos',
          enabled: true,
        },
        {
          text: 'Patología',
          module: 'Patologias',
          icon: 'group_add',
          routerLink: 'medicos/patologias',
          enabled: true,
        },
      ],
    },
  ],
};
