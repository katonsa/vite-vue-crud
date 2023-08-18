// import Dexie from 'dexie';

// const db = new Dexie('CSVDatabase');
// db.version(1).stores({
//   csvData: '++id, *columnName', // Define your schema here
// });


// export default db;


// db.ts
import Dexie from 'dexie';
import { MemberData } from '../types'; // Adjust the path as needed

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
