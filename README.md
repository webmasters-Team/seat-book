# CHECKOUT BACKEND

Backend del checkout payment 

## Instalación

Para instalar las dependencias del proyecto, ejecuta el siguiente comando:

```bash
npm install
````

Una vez instaladas las dependencias coloca en el archivo .env el SECRET_ID y TITLE_ID sin comillas 

```.env
TILTE_ID=xxxxxxxxx
SECRET_KEY=xxxxxxxxx
````

## Ejecucion del proyecto

Para iniciar el proyecto en modo desarrollo, utiliza el siguiente comando:


```bash
npm run dev
````

Una vez ejecutado el proyecto valida si el servidor esta funcionando mediante la ruta
[(http://localhost:5000)](http://localhost:5000)

debe aparecer esta respuesta

````json
{ "message": "Servidor funcionando", "isSucces": true }
````




