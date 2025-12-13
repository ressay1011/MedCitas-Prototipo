# MedCitas - Prototipo Funcional

Prototipo funcional completo de **MedCitas**, una aplicación web progresiva (PWA) para gestión de citas médicas en Colombia. Este prototipo está diseñado para ser testeado en Maze y simula todas las funcionalidades de una aplicación real sin requerir backend.

Características

- ✅ **Autenticación completa**: Login y registro de usuarios
- ✅ **Agendamiento de citas**: Flujo completo de 5 pasos (Especialidad → Fecha → Horario → Resumen → Confirmación)
- ✅ **Gestión de citas**: Visualización, detalle y cancelación de citas
- ✅ **Persistencia offline**: LocalStorage para guardar datos localmente
- ✅ **PWA ready**: Instalable en dispositivos móviles
- ✅ **Responsive**: Mobile-first design optimizado para dispositivos móviles
- ✅ **Accesibilidad**: Cumple con WCAG 2.1 AA

Tecnologías

- **React 18+** con hooks modernos
- **Vite** como build tool
- **Tailwind CSS** para estilos (Material Design tokens)
- **React Router v6** para navegación
- **Context API + useReducer** para gestión de estado
- **date-fns** para manejo de fechas
- **Lucide React** para iconos
- **React Hot Toast** para notificaciones

Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Build para producción
npm run build

# 4. Preview de build de producción
npm run preview
```

Credenciales de Prueba

Para testing en Maze, usa las siguientes credenciales:

```
Email: demo@medcitas.com
Contraseña: demo123
```

Este usuario tiene **2 citas pre-cargadas** para testear las funcionalidades de visualización, detalle y cancelación de citas.

Estructura del Proyecto

```
medcitas-prototype/
├── public/
│   ├── manifest.json (PWA)
│   └── icons/ (iconos PWA)
├── src/
│   ├── components/
│   │   ├── common/ (Button, Input, Card, LoadingSpinner, BottomNavigation)
│   │   ├── auth/ (LoginForm, RegisterForm)
│   │   ├── appointments/ (SpecialtySelector, DateCalendar, TimeSlotSelector, etc.)
│   │   └── profile/ (ProfileSettings)
│   ├── pages/ (Login, Register, Home, BookAppointment, MyAppointments, Detail, Profile)
│   ├── context/ (AuthContext, AppointmentContext)
│   ├── services/ (mockApi, localStorage)
│   ├── data/ (mockUsers, mockSpecialties, mockDoctors, mockAppointments)
│   ├── utils/ (dateHelpers, validators)
│   ├── constants/ (theme)
│   └── hooks/ (useLocalStorage)
└── package.json
```

Flujos de Usuario

### 1. Registro e Inicio de Sesión
- Registro completo con validaciones en tiempo real
- Login con credenciales
- Persistencia de sesión con localStorage

### 2. Agendar Cita (5 Pasos)
1. **Seleccionar especialidad**: 5 especialidades disponibles
2. **Seleccionar fecha**: Calendario con próximos 30 días (excluyendo domingos)
3. **Seleccionar horario**: Slots disponibles de 9 AM a 5 PM
4. **Resumen y confirmación**: Revisar detalles y confirmar
5. **Confirmación exitosa**: Código único de cita generado

### 3. Visualizar Citas
- Lista de próximas citas e historial
- Vista de detalle completo
- Cancelación de citas con motivo opcional

Testing en Maze

### Tareas Sugeridas

1. **Registro de Usuario Nuevo**
   - Completar formulario de registro
   - Recibir confirmación de cuenta creada

2. **Agendar una Cita de Medicina General**
   - Seleccionar especialidad
   - Seleccionar fecha (ej: 25 de noviembre)
   - Seleccionar horario (ej: 10:00 AM)
   - Confirmar cita
   - Ver código de confirmación

3. **Visualizar Próximas Citas**
   - Acceder a "Mis citas"
   - Ver lista de próximas citas

4. **Ver Detalle de una Cita**
   - Seleccionar una cita desde la lista
   - Ver todos los detalles (fecha, hora, doctor, consultorio)

5. **Cancelar una Cita**
   - Acceder al detalle de la cita
   - Iniciar proceso de cancelación
   - Confirmar cancelación
   - Ver confirmación de cancelación exitosa

 Datos Mock

El prototipo incluye:
- **3 usuarios de prueba** (incluyendo usuario demo)
- **5 especialidades médicas**
- **6 médicos** distribuidos en las especialidades
- **2 citas pre-cargadas** para el usuario demo
- **Fechas y horarios disponibles** generados dinámicamente

Paleta de Colores (Material Design)

- **Primary**: #2196F3 (Azul médico)
- **Success**: #4CAF50 (Verde confirmaciones)
- **Error**: #F44336 (Rojo errores/cancelaciones)
- **Warning**: #FF9800 (Naranja advertencias)

Responsive Design

- **Mobile (360px - 640px)**: Layout single column, full-width
- **Tablet (641px - 1024px)**: Layout centrado con max-width 600px
- **Desktop (1025px+)**: Layout centrado con max-width 480px (simula móvil)

Accesibilidad

- Contraste mínimo 4.5:1 para texto normal
- Elementos táctiles mínimo 44x44px
- Navegación por teclado funcional
- Atributos ARIA en componentes interactivos
- Labels asociados correctamente a inputs

Notas Importantes

- **NO hay backend real**: Todo está simulado con `mockApi.js`
- **Los datos persisten en localStorage**: Las citas creadas se guardan localmente
- **Latencia simulada**: Las llamadas API tienen delay de 200-500ms para simular red real
- **Credenciales visibles**: El usuario demo y sus credenciales están visibles en la página de login

Troubleshooting

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de build
```bash
npm run build
# Revisar errores en consola
```

### Problemas con localStorage
- Verificar que el navegador tenga localStorage habilitado
- En modo incógnito, algunos navegadores limitan localStorage

Licencia

Este es un prototipo funcional para testing y demostración.


