export const formatAnimalStatus = (status) => {
  const labels = {
    Available: "Disponibil",
    Adopted: "Adoptat",
    Fostered: "În plasament",
  };

  return labels[status] || status || "-";
};

export const formatRequestStatus = (status) => {
  const labels = {
    Pending: "În așteptare",
    Approved: "Aprobat",
    Rejected: "Respins",
  };

  return labels[status] || status || "-";
};

export const formatRole = (role) => {
  const labels = {
    user: "Utilizator",
    Manager: "Manager",
    Vet: "Veterinar",
    Caretaker: "Îngrijitor",
  };

  return labels[role] || role || "-";
};

export const formatGender = (gender) => {
  const labels = {
    Male: "Mascul",
    Female: "Femelă",
  };

  return labels[gender] || gender || "-";
};

export const formatAppointmentStatus = (status) => {
  const labels = {
    Scheduled: "Programată",
    Completed: "Finalizată",
    Cancelled: "Anulată",
  };

  return labels[status] || status || "-";
};

export const formatSpecies = (species) => {
  const labels = {
    Dog: "Câine",
    Cat: "Pisică",
  };

  return labels[species] || species || "-";
};
