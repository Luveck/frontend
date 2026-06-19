# Luveck Frontend

Aplicación web de administración de Luveck construida con [Angular](https://angular.io/) 14 y [Angular Material](https://material.angular.io/). Gestiona cadenas, farmacias, inventario, ventas, canjes, médicos y la seguridad/accesibilidad de la plataforma.

## Requisitos previos

Antes de empezar asegúrate de tener instalado:

- **Node.js** 16.10.0 o superior (compatible con Angular CLI 14). Recomendado: la última LTS 16.x o 18.x. Descárgalo desde [nodejs.org](https://nodejs.org/).
- **npm** 8 o superior (se instala junto con Node.js).
- **Angular CLI 14** de forma global:

  ```bash
  npm install -g @angular/cli@14
  ```

- **Git** para clonar el repositorio.

Verifica las versiones instaladas:

```bash
node -v
npm -v
ng version
```

## Instalación

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd "Front Luveck"
   ```

2. Instala las dependencias del proyecto:

   ```bash
   npm install
   ```

## Configuración del entorno

La configuración (URL del API y menú de la aplicación) vive en los archivos de entorno:

- `src/environments/environment.ts` — usado en desarrollo.
- `src/environments/environment.prod.ts` — usado en la build de producción (Angular reemplaza el archivo automáticamente al compilar con `--configuration production`).

Ajusta el valor de `urlApi` para que apunte al backend que quieras consumir. Por ejemplo:

```ts
export const environment = {
  production: false,
  urlApi: 'https://localhost:7150/api', // backend local
  // ...
};
```

## Ejecutar en desarrollo

Levanta el servidor de desarrollo:

```bash
npm start
```

o, de forma equivalente:

```bash
ng serve
```

Abre el navegador en [http://localhost:4200/](http://localhost:4200/). La aplicación se recarga automáticamente al guardar cambios en el código fuente.

## Compilar para producción

Genera la build optimizada de producción:

```bash
npm run build
```

Los artefactos resultantes quedan en el directorio `dist/`.

Para una build de desarrollo en modo *watch* (recompila al detectar cambios):

```bash
npm run watch
```

## Pruebas

Ejecuta las pruebas unitarias con [Karma](https://karma-runner.github.io):

```bash
npm test
```

o:

```bash
ng test
```

## Generar componentes (scaffolding)

Para crear nuevos artefactos con Angular CLI:

```bash
ng generate component nombre-componente
```

También puedes generar `directive`, `pipe`, `service`, `class`, `guard`, `interface`, `enum` o `module`.

## Más ayuda

Para más información sobre Angular CLI usa `ng help` o consulta la [referencia oficial de Angular CLI](https://angular.io/cli).
