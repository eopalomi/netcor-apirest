// ============================
//  PUERTO
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  ENTORNO
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  VENCIMIENTO DEL TOKEN
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ============================
//  SEED DE AUTENTICACION
// ============================
process.env.SEED = process.env.SEED || 'netcor-app-seed';