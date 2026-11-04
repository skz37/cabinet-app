/** GET /patient/me `data`. Dates are `yyyy-MM-dd`. */
export type Patient = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  dateNaissance: string;
};
