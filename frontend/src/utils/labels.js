export const formatAnimalStatus = (status) => {
  const labels = {
    Available: "Disponibil",
    Adopted: "Adoptat",
  };

  return labels[status] || status || "-";
};

export const formatRequestStatus = (status) => {
  const labels = {
    Pending: "In asteptare",
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
    Caretaker: "Ingrijitor",
  };

  return labels[role] || role || "-";
};

export const formatGender = (gender) => {
  const labels = {
    Male: "Mascul",
    Female: "Femela",
  };

  return labels[gender] || gender || "-";
};
