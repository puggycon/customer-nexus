import type { Customer } from "./types";

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "김민지",
    mobile: "010-1234-5678",
    tags: ["고혈압", "정기복용"],
    lastVisit: "2026-06-20",
  },
  {
    id: "2",
    name: "이준호",
    mobile: "010-2345-6789",
    tags: ["당뇨"],
    lastVisit: "2026-06-18",
  },
  {
    id: "3",
    name: "박서연",
    mobile: "010-3456-7890",
    tags: ["임산부", "영양제"],
    lastVisit: "2026-06-15",
  },
  {
    id: "4",
    name: "최도윤",
    mobile: "010-4567-8901",
    tags: ["감기약"],
    lastVisit: "2026-06-10",
  },
  {
    id: "5",
    name: "정하은",
    mobile: "010-5678-9012",
    tags: ["피부질환", "정기복용"],
    lastVisit: "2026-06-02",
  },
];
