import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError } from './firebase';
import { OperationType, Project, Category, Certification, Blog, Service } from '../types';

export const firestoreService = {
  // Generic list
  async list<T>(collectionName: string, queryConstraints: any[] = []): Promise<T[]> {
    try {
      const q = query(collection(db, collectionName), ...queryConstraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionName);
      return [];
    }
  },

  // Generic get
  async get<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const d = await getDoc(doc(db, collectionName, id));
      return d.exists() ? ({ id: d.id, ...d.data() } as T) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${collectionName}/${id}`);
      return null;
    }
  },

  // Generic create
  async create<T>(collectionName: string, data: any): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, collectionName);
      return '';
    }
  },

  // Generic update
  async update(collectionName: string, id: string, data: any): Promise<void> {
    try {
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${id}`);
    }
  },

  // Generic set (upsert)
  async set(collectionName: string, id: string, data: any): Promise<void> {
    try {
      await setDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error: any) {
      alert("Error saving: " + error?.message);
      handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${id}`);
    }
  },

  // Generic delete
  async delete(collectionName: string, id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
    }
  }
};
