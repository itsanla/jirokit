-- Seed: Quota
-- Slot per event. remaining_slots Kuliner = 2 (sudah ada 1 yang booking), sisanya 3.

INSERT INTO `Quota` (event_id, total_slots, remaining_slots) VALUES
(1, 5, 4),
(2, 5, 2),
(3, 5, 2),
(4, 5, 0),
(5, 5, 0);
