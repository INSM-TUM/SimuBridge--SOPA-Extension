// db.js
import Dexie from 'dexie';

export const db = new Dexie('AnalysisDatabase');
db.version(1).stores({
  // chunks is table name
  // [projectName+key] is primary
  chunks: '[projectName+key], projectName' 
});