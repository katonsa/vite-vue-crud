export interface MemberData {
  id?: number; // This can be optional if your database auto-generates IDs
  name: string;
  phone_number: string;
  address: string;
  joined_at: string;
  expired_at: string;
}
