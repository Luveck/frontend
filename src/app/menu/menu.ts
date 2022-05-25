import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'home',
    title: 'Inicio',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'home'
  },
  {
    id: 'roles',
    title: 'Gestión de roles',
    translate: 'MENU.SAMPLE',
    type: 'item',
    icon: 'users',
    url: 'sample'
  }
]
