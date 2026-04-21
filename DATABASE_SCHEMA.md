# Database Schema

Schema de mai jos este reconstruita din modelele Sequelize din `backend/src/models`.

## 1. `Users`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `username` | STRING | NOT NULL |
| `email` | STRING | NOT NULL, UNIQUE |
| `password` | STRING | NOT NULL |
| `phonenumber` | STRING | NULL |
| `address` | STRING | NULL |
| `role` | ENUM(`user`, `Manager`, `Vet`, `Caretaker`) | default: `user` |

Relatii:
- `Users` 1:1 `Staff` prin `Staff.user_id`
- `Users` 1:N `Appointments` prin `Appointments.user_id`
- `Users` 1:N `Adoption_requests` prin `Adoption_requests.user_id`
- `Users` 1:N `reset_tokens` prin `reset_tokens.userId`
- `Users` N:M `Animals` prin `Adoption_history`

## 2. `Staff`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `name` | STRING | NOT NULL |
| `email` | STRING | NOT NULL, UNIQUE |
| `position_id` | INTEGER | FK -> `Positions.id` |
| `phonenumber` | STRING | NULL |
| `user_id` | INTEGER | NOT NULL, FK -> `Users.id` |

Relatii:
- `Staff` N:1 `Positions`
- `Staff` 1:N `Appointments`
- `Staff` 1:N `Medications` prin `prescribing_vet`
- `Staff` N:M `Boxes` prin `Responsible_boxes`

## 3. `Positions`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `title` | STRING | NOT NULL |
| `description` | TEXT | NULL |

Relatii:
- `Positions` 1:N `Staff`

## 4. `Species`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `name` | STRING | NOT NULL |

Relatii:
- `Species` 1:N `Animals`
- `Species` 1:N `Boxes`

## 5. `Boxes`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `box_number` | STRING | NOT NULL, UNIQUE |
| `capacity` | INTEGER | NOT NULL |
| `current_occupancy` | INTEGER | NOT NULL, default: `0` |
| `species_id` | INTEGER | NOT NULL, FK -> `Species.id` |

Relatii:
- `Boxes` N:1 `Species`
- `Boxes` 1:N `Animals`
- `Boxes` N:M `Staff` prin `Responsible_boxes`

## 6. `Responsible_boxes`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `box_id` | INTEGER | NOT NULL, FK -> `Boxes.id` |
| `responsible_id` | INTEGER | NOT NULL, FK -> `Staff.id` |

Rol:
- tabel de legatura intre `Boxes` si `Staff`

## 7. `Medical_files`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `weight` | FLOAT | NULL |
| `last_checkup_date` | DATE | NULL |
| `general_observations` | TEXT | NULL |

Relatii:
- `Medical_files` 1:1 `Animals` prin `Animals.medical_file_id`
- `Medical_files` 1:N `Medications`

## 8. `Animals`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `name` | STRING | NOT NULL |
| `species_id` | INTEGER | NOT NULL, FK -> `Species.id` |
| `breed` | STRING | NULL |
| `age` | INTEGER | NULL |
| `date_added` | DATE | NULL, default: NOW |
| `gender` | ENUM(`Male`, `Female`) | NOT NULL |
| `box_id` | INTEGER | NULL, FK -> `Boxes.id` |
| `medical_file_id` | INTEGER | NULL, FK -> `Medical_files.id` |
| `status` | ENUM(`Available`, `Adopted`, `Fostered`) | default: `Available` |
| `image_url` | STRING | NULL |

Relatii:
- `Animals` N:1 `Species`
- `Animals` N:1 `Boxes`
- `Animals` 1:1 `Medical_files`
- `Animals` 1:N `Appointments`
- `Animals` 1:N `Adoption_requests`
- `Animals` N:M `Users` prin `Adoption_history`

## 9. `Medications`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `name` | STRING | NOT NULL |
| `description` | TEXT | NULL |
| `dosage` | STRING | NOT NULL |
| `frequency` | STRING | NOT NULL |
| `start_date` | DATE | NOT NULL |
| `end_date` | DATE | NULL |
| `prescribing_vet` | INTEGER | NOT NULL, FK -> `Staff.id` |
| `medical_file_id` | INTEGER | NOT NULL, FK -> `Medical_files.id` |

Relatii:
- `Medications` N:1 `Staff`
- `Medications` N:1 `Medical_files`

## 10. `Rooms`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `room_number` | STRING | NOT NULL, UNIQUE |

Relatii:
- `Rooms` 1:N `Appointments`

## 11. `Appointments`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `user_id` | INTEGER | NOT NULL, FK -> `Users.id` |
| `staff_id` | INTEGER | NOT NULL, FK -> `Staff.id` |
| `animal_id` | INTEGER | NOT NULL, FK -> `Animals.id` |
| `room_id` | INTEGER | NOT NULL, FK -> `Rooms.id` |
| `date` | DATE | NOT NULL |
| `hour` | TIME | NOT NULL |
| `status` | ENUM(`Scheduled`, `Completed`, `Cancelled`) | default: `Scheduled` |

Relatii:
- `Appointments` N:1 `Users`
- `Appointments` N:1 `Staff`
- `Appointments` N:1 `Animals`
- `Appointments` N:1 `Rooms`

## 12. `Adoption_requests`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `animal_id` | INTEGER | NOT NULL, FK -> `Animals.id` |
| `user_id` | INTEGER | NOT NULL, FK -> `Users.id` |
| `status` | ENUM(`Pending`, `Approved`, `Rejected`) | default: `Pending` |
| `request_date` | DATE | default: NOW |

Constrangeri suplimentare:
- UNIQUE compus pe (`user_id`, `animal_id`)

Relatii:
- `Adoption_requests` N:1 `Animals`
- `Adoption_requests` N:1 `Users`

## 13. `Adoption_history`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `animal_id` | INTEGER | NOT NULL, FK -> `Animals.id` |
| `adopter_id` | INTEGER | NOT NULL, FK -> `Users.id` |
| `adoption_date` | DATE | default: NOW |

Rol:
- istoric adoptii
- tabel de legatura intre `Animals` si `Users`

## 14. `reset_tokens`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `token_hash` | STRING | NOT NULL |
| `created_at` | DATE | default: NOW |
| `expires_at` | DATE | NOT NULL |
| `userId` | INTEGER | NOT NULL, FK -> `Users.id` |
| `used` | BOOLEAN | default: `false` |

Relatii:
- `reset_tokens` N:1 `Users`

## 15. `Breed_Metadata`

| Coloana | Tip | Constrangeri |
|---|---|---|
| `id` | INTEGER | PK, autoIncrement |
| `species` | ENUM(`Dog`, `Cat`) | NOT NULL |
| `breed_name` | STRING | NOT NULL, UNIQUE |
| `temperament` | STRING | NULL |
| `energy_level` | ENUM(`Low`, `Medium`, `High`) | NULL |
| `size` | ENUM(`Small`, `Medium`, `Large`) | NULL |
| `good_with_kids` | BOOLEAN | NULL |
| `good_with_other_pets` | BOOLEAN | NULL |
| `apartment_friendly` | BOOLEAN | NULL |
| `grooming_needs` | ENUM(`Low`, `Medium`, `High`) | NULL |
| `life_expectancy` | STRING | NULL |
| `description` | TEXT | NULL |

Rol:
- metadate pentru rase de caini/pisici, folosite in recomandari/AI

## Relatii principale pe scurt

- `Users` -> `Staff`: 1:1
- `Positions` -> `Staff`: 1:N
- `Species` -> `Animals`: 1:N
- `Species` -> `Boxes`: 1:N
- `Boxes` -> `Animals`: 1:N
- `Boxes` <-> `Staff`: N:M prin `Responsible_boxes`
- `Medical_files` -> `Animals`: 1:1
- `Medical_files` -> `Medications`: 1:N
- `Users` -> `Appointments`: 1:N
- `Staff` -> `Appointments`: 1:N
- `Animals` -> `Appointments`: 1:N
- `Rooms` -> `Appointments`: 1:N
- `Users` -> `Adoption_requests`: 1:N
- `Animals` -> `Adoption_requests`: 1:N
- `Users` <-> `Animals`: N:M prin `Adoption_history`

## Observatii

- In cod, aproape toate relatiile sunt definite cu `onDelete: CASCADE`.
- Tabela token-urilor are numele real `reset_tokens`, in timp ce majoritatea celorlalte tabele folosesc nume cu initiala mare.
- In modelul `Medications`, referinta la `medical_file_id` apare ca `Medical_Files`, dar tabela definita in proiect este `Medical_files`. Merita verificat daca in DB reala functioneaza exact asa cum te astepti.
