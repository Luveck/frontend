import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'home',
    title: 'Inicio',
    //translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: '/sample/home'
  },
  {
    id: 'paises',
    title: 'Gestión de Paises',
    //translate: 'MENU.PAISES',
    type: 'collapsible',
    icon: 'globe',
    children: [
      {
        id: 'paises',
        title: 'Paises',
        //translate: 'MENU.PAISES.PAISES',
        type: 'item',
        //role: ['Admin'], //? To set multiple role: ['Admin', 'Client']
        icon: 'circle',
        url: 'pages/zona/listpaises'
      },
      {
        id: 'departamentos',
        title: 'Departamentos',
        //translate: 'MENU.PAISES.DEPARTAMENTOS',
        type: 'item',
        //role: ['Admin'], //? To set multiple role: ['Admin', 'Client']
        icon: 'circle',
        url: 'pages/zona/listdepartamentos'
      },
      {
        id: 'ciudades',
        title: 'Ciudades',
        //translate: 'MENU.PAISES.CIUDADES',
        type: 'item',
        //role: ['Admin'], //? To set multiple role: ['Admin', 'Client']
        icon: 'circle',
        url: 'pages/zona/listciudades'
      }
    ]
  }
]
