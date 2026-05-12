# To-Do

App móvil para gestión personal de tareas con recordatorios locales, desarrollada en React Native + Expo para el Parcial 1 de Apps Móviles, ISTEA 2026.

## Opción elegida

**Gestor de tareas**. El usuario se registra, inicia sesión y administra sus tareas. Cada tarea tiene título, notas opcionales y un recordatorio opcional que dispara una notificación local en la fecha y hora elegidas.

## Stack tecnológico

- ***React Native*** con ***Expo*** (~54)
- ***TypeScript***
- ***React Navigation*** (Stack)
- ***AsyncStorage*** para persistencia local
- ***expo-notifications*** para notificaciones locales programadas
- ***@react-native-community/datetimepicker*** para selección de fecha y hora

## Funcionalidades implementadas

- Registro de usuario (usuario + contraseña), persistido en almacenamiento local del dispositivo
- Login validando credenciales contra los usuarios registrados
- Sesión persistente: no se pide volver a loguearse al cerrar y abrir la app
- Logout desde la pantalla principal
- Toggle Mostrar / Ocultar contraseña en las pantallas de Login y Registro
- Listado de tareas con ***FlatList***
- Alta de tarea con título, notas opcionales y recordatorio (fecha + hora)
- Marcar tarea como completada con animación de salida
- Eliminar tarea con confirmación
- Notificación local programada para la fecha del recordatorio
- Cancelación automática de la notificación si la tarea se borra antes del recordatorio
- Pantalla vacía con imagen ilustrativa cuando no hay tareas

## Cómo ejecutar

### Opción A, APK Android (recomendada para Android)

Descargar e instalar el APK desde el siguiente link:

https://expo.dev/accounts/leandroglassman/projects/gestor-tareas/builds/e1306821-4612-482f-99c2-5913373f0d5b

En el dispositivo Android, puede ser necesario habilitar la opción ***Instalar apps de fuentes desconocidas*** al abrir el archivo.

### Opción B, Expo Go (iOS o Android)

Requisitos: ***Node*** 22 o superior y la app ***Expo Go*** instalada en el dispositivo, o un simulador iOS / emulador Android.

```bash
git clone https://github.com/LeandroGlassman/ISTEAAppMobile.git
cd ISTEAAppMobile/Clases/Apps\ Moviles/Parcial1/gestor-tareas
npm install
npx expo start
```

Después:

- Escanear el QR con la cámara del iPhone para abrir en ***Expo Go***
- O tocar ***i*** en la terminal para correr en iOS Simulator
- O tocar ***a*** para correr en emulador de Android

## Estructura del proyecto

```
src/
├── components/
│   ├── ItemCard.tsx           tarjeta reutilizable de cada tarea
│   └── PasswordInput.tsx      input de password con toggle de visibilidad
├── context/
│   ├── AuthContext.tsx        sesión y registro de usuarios
│   └── TasksContext.tsx       lista global de tareas
├── hooks/
│   └── useNotifications.ts    permisos y programación de notificaciones
├── navigation/
│   └── AppNavigator.tsx       Stack Navigator con condicional de auth
└── screens/
    ├── LoginScreen.tsx
    ├── RegisterScreen.tsx
    ├── HomeScreen.tsx
    └── AddItemScreen.tsx
```

## Notas sobre notificaciones en Android

Las notificaciones locales funcionan correctamente en iOS con ***Expo Go*** y en Android con el APK instalado. En Android usando ***Expo Go***, a partir del SDK 53 Expo limita la funcionalidad de notificaciones; por eso se recomienda usar el APK provisto en la Opción A para probar la app en Android.

## Video DEMO

https://youtube.com/shorts/mCz14Hms90I

## Autor

Leandro Glassman
