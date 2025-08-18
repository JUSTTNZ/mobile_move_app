// src/lib/appwrite.ts
import { Client, Account, Databases, Storage } from 'react-native-appwrite';

export const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')        // or your self-hosted URL
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)                      // copy from Appwrite console
  .setPlatform('com.nz.movieapp');                    // <-- Android package name

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
