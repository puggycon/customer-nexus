import type { Customer } from "./types";

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "김민지",
    mobile: "010-1234-5678",
    tags: ["고혈압", "정기복용"],
    lastVisit: "2026-06-20",
    visits: [
      {
        id: "1-1",
        visitDate: "2026-05-21",
        product: "암로디핀정 5mg",
        price: 18000,
        durationDays: 30,
        memo: "혈압 안정적, 동일 처방 유지",
      },
      {
        id: "1-2",
        visitDate: "2026-06-20",
        product: "암로디핀정 5mg",
        price: 18000,
        durationDays: 30,
        memo: "복약 순응도 양호",
      },
    ],
  },
  {
    id: "2",
    name: "이준호",
    mobile: "010-2345-6789",
    tags: ["당뇨"],
    lastVisit: "2026-06-18",
    visits: [
      {
        id: "2-1",
        visitDate: "2026-06-18",
        product: "메트포르민정 500mg",
        price: 15000,
        durationDays: 60,
        memo: "공복혈당 다소 높음, 식이조절 권고",
      },
    ],
  },
  {
    id: "3",
    name: "박서연",
    mobile: "010-3456-7890",
    tags: ["임산부", "영양제"],
    lastVisit: "2026-06-15",
    visits: [
      {
        id: "3-1",
        visitDate: "2026-06-15",
        product: "엽산 + 종합영양제",
        price: 32000,
        durationDays: 90,
        memo: "임신 2분기, 입덧 거의 없음",
      },
    ],
  },
  {
    id: "4",
    name: "최도윤",
    mobile: "010-4567-8901",
    tags: ["감기약"],
    lastVisit: "2026-06-10",
    visits: [
      {
        id: "4-1",
        visitDate: "2026-06-10",
        product: "판콜에이",
        price: 8000,
        durationDays: 5,
        memo: "인후통 동반, 충분한 수분 섭취 안내",
      },
    ],
  },
  {
    id: "5",
    name: "정하은",
    mobile: "010-5678-9012",
    tags: ["피부질환", "정기복용"],
    lastVisit: "2026-06-02",
    visits: [
      {
        id: "5-1",
        visitDate: "2026-06-02",
        product: "항히스타민제",
        price: 12000,
        durationDays: 14,
        memo: "아토피 악화, 보습제 병용 권고",
      },
    ],
  },
];
