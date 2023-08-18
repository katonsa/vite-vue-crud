import Dexie from 'dexie';
import { MemberData } from '../types';

class MemberDatabase extends Dexie {
  members: Dexie.Table<MemberData, number>;

  constructor() {
    super('MemberDatabase');
    this.version(1).stores({
      members: '++id,name,phone_number,address,joined_at,expired_at'
    });
    this.members = this.table('members');
  }
}

export const db = new MemberDatabase();

export const addMember = async (member: MemberData) => {
  await db.members.add(member);
};

export const clearDatabase = async () => {
  await db.members.clear();
};
