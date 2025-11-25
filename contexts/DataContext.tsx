import { supabase } from "@/utils/supabase";
import * as FileSystem from "expo-file-system";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  plate: string;
  km: number;
}

interface Appointment {
  id: number;
  date: string;
  workshop: string;
  service: string;
}

interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
}

interface DataContextProps {
  vehicles: Vehicle[];
  appointments: Appointment[];
  expenses: Expense[];
  loadData: () => void;
  addVehicle: (payload: {
    make?: string;
    brand?: string;
    model?: string;
    year?: number;
    plate?: string;
    odometer?: number;
    km?: number;
    vin?: string;
    color?: string;
    photo_url?: string;
    status?: string;
    meta?: any;
  }) => Promise<{ ok: boolean; data?: any; error?: any }>;
  // sendMessage ahora sube media (si existe) y crea un registro en diagnostics
  sendMessage: (
    chatId: string,
    userId: string | null,
    message?: string,
    mediaUri?: string,
    mediaType?: "image" | "video"
  ) => Promise<{ ok: boolean; data?: any; error?: any }>;
}

export const DataContext = createContext<DataContextProps>({
  vehicles: [],
  appointments: [],
  expenses: [],
  loadData: () => { },
  addVehicle: async () => ({ ok: false }),
  sendMessage: async () => ({ ok: false }),
});

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const loadData = async () => {
    try {
      const { data: v } = await supabase.from("vehicles").select("*");
      setVehicles((v as any) ?? []);
      const { data: a } = await supabase.from("appointments").select("*");
      setAppointments((a as any) ?? []);
      const { data: e } = await supabase.from("expenses").select("*");
      setExpenses((e as any) ?? []);
    } catch (err) {
      console.error("loadData error", err);
    }
  };

  // addVehicle (compatible con distintos nombres de columna)
  const addVehicle = async (payload: any) => {
    try {
      const sessionRes = await supabase.auth.getSession();
      let userId = sessionRes?.data?.session?.user?.id;
      if (!userId) {
        const userRes = await supabase.auth.getUser();
        userId = userRes?.data?.user?.id;
      }
      if (!userId) return { ok: false, error: "No autenticado" };

      const row: any = {
        owner_id: userId,
        make: payload.make ?? payload.brand ?? null,
        brand: payload.brand ?? payload.make ?? null,
        model: payload.model ?? null,
        year: payload.year ?? null,
        plate: payload.plate ?? null,
        odometer: payload.odometer ?? payload.km ?? null,
        km: payload.km ?? payload.odometer ?? null,
        vin: payload.vin ?? null,
        color: payload.color ?? null,
        photo_url: payload.photo_url ?? null,
        status: payload.status ?? null,
        meta: payload.meta ?? null,
      };

      const { data, error } = await supabase.from("vehicles").insert([row]).select().single();
      if (error) return { ok: false, error };
      setVehicles((prev) => (data ? [data as any, ...prev] : prev));
      return { ok: true, data };
    } catch (err) {
      console.error("addVehicle exception:", err);
      return { ok: false, error: err };
    }
  };

  // sendMessage: si viene mediaUri lee archivo como base64 y crea fila en diagnostics.
  const sendMessage = async (
    chatId: string,
    userId: string | null,
    message?: string,
    mediaUri?: string,
    mediaType?: "image" | "video"
  ) => {
    try {
      let inputPayload: any = { text: message ?? null };

      if (mediaUri) {
        // lee archivo local como base64 (Expo FileSystem)
        // EncodingType may not be available on the FileSystem namespace in some versions,
        // so pass the string literal and cast to any to satisfy the typings.
        const base64 = await FileSystem.readAsStringAsync(mediaUri, { encoding: "base64" } as any);

        const extMatch = /\.([a-zA-Z0-9]+)(?:\?.*)?$/.exec(mediaUri);
        const ext = extMatch ? extMatch[1] : mediaType === "video" ? "mp4" : "jpg";
        const mime = mediaType === "video" ? `video/${ext}` : `image/${ext}`;

        inputPayload = {
          media_base64: base64,
          media_type: mediaType,
          mime,
          name: `upload_${Date.now()}.${ext}`,
        };
      }

      const payload = {
        vehicle_id: null, // si tienes vehicleId pásalo aquí
        user_id: userId ?? null,
        input: inputPayload,
        result: {}, // se puede actualizar luego con el resultado IA
        status: mediaUri ? "pending" : "done",
      };

      const { data, error } = await supabase.from("diagnostics").insert([payload]).select().single();
      if (error) {
        console.error("insert diagnostics error:", error);
        return { ok: false, error };
      }

      return { ok: true, data };
    } catch (err) {
      console.error("sendMessage exception:", err);
      return { ok: false, error: err };
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        vehicles,
        appointments,
        expenses,
        loadData,
        addVehicle,
        sendMessage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
