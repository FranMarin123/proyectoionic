## Requisitos previos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (generalmente se incluye con Node.js)
- [Ionic CLI](https://ionicframework.com/docs/cli) (instalar con `npm install -g @ionic/cli`)

## Instalación

Una vez clonado el repositorio, instala las dependencias:

```bash
npm install
```

## Configuración de entornos

El proyecto requiere configurar los archivos de entorno antes de ejecutarse. Los archivos necesarios son:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

1. Copia los archivos de ejemplo y renómbralos:
   ```bash
   cp src/environments/environment.ts.dist src/environments/environment.ts
   cp src/environments/environment.prod.ts.dist src/environments/environment.prod.ts
   ```

2. Edita los archivos `environment.ts` y `environment.prod.ts` según sea necesario para tu entorno. Estos archivos contienen las configuraciones específicas de Firebase entre otros.

## Ejecución de la aplicación

Para ejecutar la aplicación en modo de desarrollo:

```bash
ionic serve
```

Esto iniciará un servidor de desarrollo y abrirá la aplicación en tu navegador predeterminado. Los cambios en el código se reflejarán automáticamente.

## Generar build de producción

Para generar una versión optimizada de la aplicación para producción:

```bash
ionic build --prod
```