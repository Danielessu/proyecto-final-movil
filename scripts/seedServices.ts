import { supabase } from "../utils/supabase";

async function seedServices() {
  const services = [
    {
      code: "OIL_CHANGE",
      title: "Cambio de aceite",
      est_price: 850,
      est_duration_minutes: 30,
      description: "Servicio profesional de cambio de aceite para su motor."
    },
    {
      code: "BRAKE_INSPECTION",
      title: "Revisión de frenos",
      est_price: 400,
      est_duration_minutes: 45,
      description: "Inspección y mantenimiento completo de frenos."
    },
    {
      code: "ALIGNMENT",
      title: "Alineación y balanceo",
      est_price: 1200,
      est_duration_minutes: 60,
      description: "Alineación precisa y balanceo para mejorar estabilidad."
    },
    {
      code: "BATTERY_CHECK",
      title: "Chequeo de batería",
      est_price: 300,
      est_duration_minutes: 20,
      description: "Revisión completa del estado y funcionamiento de la batería."
    },
    {
      code: "FILTER_CHANGE",
      title: "Cambio de filtro",
      est_price: 500,
      est_duration_minutes: 25,
      description: "Cambio de filtros de aire y aceite para un mejor rendimiento."
    }
  ];

  try {
    for (const service of services) {
      const { data, error } = await supabase
        .from('services')
        .upsert(service, { onConflict: 'code' }); // upsert by code to avoid duplicates

      if (error) {
        console.error('Error inserting service:', service.title, error);
      } else {
        console.log('Inserted/updated service:', service.title);
      }
    }
    console.log('Service seeding completed.');
  } catch (err) {
    console.error('Unexpected error during service seeding:', err);
  }
}

seedServices();
