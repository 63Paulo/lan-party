import { z } from 'zod';

export const bookingSchema = z.object({
    userId: z.coerce.number({ required_error: "L'ID utilisateur est requis" }).int("L'ID utilisateur doit être un entier"),
    stationId: z.coerce.number({ required_error: "L'ID de la station est requis" }).int("L'ID de la station doit être un entier"),
    startTime: z.coerce.date({ required_error: "L'heure de début est requise" }),
    endTime: z.coerce.date({ required_error: "L'heure de fin est requise" }),
    status: z.enum(['pending', 'confirmed', 'cancelled'], { required_error: "Le statut est requis" }),
}).refine(data => data.startTime < data.endTime, {
    message: "L'heure de début doit être avant l'heure de fin",
});
